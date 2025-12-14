import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { createExpense } from "../api/expenses";
import { searchUsers, searchGroups } from "../api/search";
import Search from "./Search";

export default function SplitBills() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [usernames, setUsernames] = useState([{ username: "" }]);

  const [groupQuery, setGroupQuery] = useState("");
  const [groupResults, setGroupResults] = useState([]);

  const [items, setItems] = useState([{ name: "", amount: "", assigned: [] }]);
  const [splitType, setSplitType] = useState("even");
  const [percentages, setPercentages] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupQuery) {
      setGroupResults([]);
      return;
    }

    const fetchGroups = async () => {
      const data = await searchGroups(token, groupQuery);
      setGroupResults(data);
    };

    fetchGroups();
  }, [groupQuery, token]);

  const addUsername = () => {
    setUsernames([...usernames, { username: "" }]);
  };

  const removeUsername = (index) => {
     const updatedUsernames = [...usernames];
    const removed = updatedUsernames.splice(index, 1)[0];
    setUsernames(updatedUsernames);

    const updatedPercentages = { ...percentages };
    delete updatedPercentages[removed.username];
    setPercentages(updatedPercentages);

    const updatedItems = items.map((item) => ({
      ...item,
      assigned: item.assigned.filter((u) => u !== removed.username),
    }));
    setItems(updatedItems);
  };

  const handleUsernameChange = (index, value) => {
    const updatedUsernames = [...usernames];
    const oldValue = updatedUsernames[index].username;
    updatedUsernames[index].username = value;
    setUsernames(updatedUsernames);

    if (splitType === "percentage" && oldValue in percentages) {
      const updatedPercentages = { ...percentages };
      updatedPercentages[normalizedValue] = updatedPercentages[oldName];
      delete updatedPercentages[oldName];
      setPercentages(updatedPercentages);
    }

    const updatedItems = items.map((item) => ({
      ...item,
      assigned: item.assigned.map((u) => (u === oldName ? normalizedValue : u)),
    }));
    setItems(updatedItems);
  };

  const addItem = () =>
    setItems([...items, { name: "", amount: "", assigned: [] }]);

   const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
   };

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const toggleAssignUser = (itemIndex, username) => {
    const updatedItems = [...items];
    const assigned = updatedItems[itemIndex].assigned || [];
    updated[itemIndex].assigned = assigned.includes(username)
      ? assigned.filter((u) => u !== username)
      : [...assigned, username];
    setItems(updated);
  };

  const handlePercentageChange = (username, value) => {
    setPercentages({ ...percentages, [username]: Number(value) });
  };

  const calculateShares = () => {
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    const shares = {};
    const usernameList = usernames.map((u) => u.username).filter(Boolean);

    if (splitType === "even") {
      const perUser = total / (usernameList.length || 1);
      usernameList.forEach((u) => (shares[u] = perUser.toFixed(2)));
    } else if (splitType === "byItem") {
      usernameList.forEach((u) => (shares[u] = 0));
      items.forEach((item) => {
        const assigned = item.assigned.length ? item.assigned : usernameList;
        const perItem = parseFloat(item.amount || 0) / (assigned.length || 1);
        assigned.forEach((u) => (shares[u] += perItem));
      });
      usernameList.forEach((u) => (shares[u] = shares[u].toFixed(2)));
    } else if (splitType === "percentage") {
      usernameList.forEach((u) => {
        shares[u] = ((total * (percentages[u] || 0)) / 100).toFixed(2);
      });
    }

    return shares;
  };

  const shares = calculateShares();

  const mapSplitTypeToDB = (type) => {
    if (type === "byItem") return "custom";
    return type;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const usernameList = usernames.map((u) => u.username).filter(Boolean);
    if (!usernameList.length) {
      setError("Please add at least one username.");
      return;
    }

    if (splitType === "percentage") {
      const totalPercent = Object.values(percentages).reduce(
        (sum, val) => sum + Number(val || 0),
        0
      );
      if (totalPercent !== 100) {
        setError("Percentages must sum to 100%.");
        return;
      }
    }

    const shares = calculateShares();

    const billData = {
      groupName,
      usernames: usernameList,
      items,
      splitType: mapSplitTypeToDB(splitType),
      shares,
      createdBy: user?.username,
    };

    try {
      const response = await createExpense(token, billData);
      navigate("/profile");
    } catch (err) {
      setError("Failed to submit bill. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Add New Bill</h1>

        <form className="auth-form" onSubmit={onSubmit}>
          <h3>Group</h3>
          <Search
            placeholder="Search groups..."
            query={groupQuery}
            setQuery={(str) => {
              setGroupQuery(str);
              setGroupName(str);
            }}
            results={groupResults}
            onSelect={(g) => {
              setGroupName(g.name);
              setGroupQuery(g.name);
              setGroupResults([]);
            }}
          />

          <h3>Usernames</h3>
          {usernames.map((u, index) => (
            <div key={index} className="username-item">
              <input
                type="text"
                placeholder="Username"
                value={u.username}
                onChange={(e) => handleUsernameChange(index, e.target.value)}
                required
              />
              {usernames.length > 1 && (
                <button type="button" onClick={() => removeUsername(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addUsername} className="auth-btn">
            Add Username
          </button>

          <h3>Expense Items</h3>
          {items.map((item, index) => (
            <div key={index} className="expense-item">
              <input
                type="text"
                placeholder="Item Name"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(index, "amount", e.target.value)
                }
                required
                min="0"
                step="0.01"
              />
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)}>
                  Remove Item
                </button>
              )}
              {splitType === "byItem" && (
                <div className="assign-to-container">
                  <label>Assign to:</label>
                  {usernames.map((u) => (
                    <label key={u.username} className="assign-to-label">
                      <input
                        type="checkbox"
                        checked={item.assigned.includes(u.username)}
                        onChange={() => toggleAssignUser(index, u.username)}
                      />
                      {u.username}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={addItem} className="auth-btn">
            Add Item
          </button>

          <h3>Split Type</h3>
          <label className="split-type-option">
            <input
              type="radio"
              value="even"
              checked={splitType === "even"}
              onChange={(e) => setSplitType(e.target.value)}
            />
            Even
          </label>
          <label className="split-type-option">
            <input
              type="radio"
              value="byItem"
              checked={splitType === "byItem"}
              onChange={(e) => setSplitType(e.target.value)}
            />
            By Item
          </label>
          <label className="split-type-option">
            <input
              type="radio"
              value="percentage"
              checked={splitType === "percentage"}
              onChange={(e) => setSplitType(e.target.value)}
            />
            Percentage
          </label>

          {splitType === "percentage" && (
            <div>
              <h4>Set Percentage per User</h4>
              {usernames.map((u) => (
                <div key={u.username}>
                  <label>{u.username || "Username"} %</label>
                  <input
                    type="number"
                    value={percentages[u.username] || ""}
                    onChange={(e) =>
                      handlePercentageChange(u.username, e.target.value)
                    }
                    min="0"
                    max="100"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          <h4>Calculated Shares</h4>
          <ul>
            {usernames.map((u) => (
              <li key={u.username}>
                {u.username}: ${shares[u.username] || "0.00"}
              </li>
            ))}
          </ul>

          <button type="submit" className="auth-btn">
            Submit Bill
          </button>

          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}
