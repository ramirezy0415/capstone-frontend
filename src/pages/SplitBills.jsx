import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { createExpense } from "../api/expenses";

export default function SplitBills() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [usernames, setUsernames] = useState([{ username: "" }]);
  const [items, setItems] = useState([{ name: "", amount: "", assigned: [] }]);
  const [splitType, setSplitType] = useState("even");
  const [percentages, setPercentages] = useState({});
  const [error, setError] = useState(null);

  const addUsername = () => setUsernames([...usernames, { username: "" }]);
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
    const oldName = updatedUsernames[index].username;
    updatedUsernames[index].username = value;
    setUsernames(updatedUsernames);

    if (splitType === "percentage" && oldName in percentages) {
      const updatedPercentages = { ...percentages };
      updatedPercentages[value] = updatedPercentages[oldName];
      delete updatedPercentages[oldName];
      setPercentages(updatedPercentages);
    }

    const updatedItems = items.map((item) => ({
      ...item,
      assigned: item.assigned.map((u) => (u === oldName ? value : u)),
    }));
    setItems(updatedItems);
  };

  const addItem = () =>
    setItems([...items, { name: "", amount: "", assigned: [] }]);
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const toggleAssignUser = (itemIndex, username) => {
    const updatedItems = [...items];
    const assigned = updatedItems[itemIndex].assigned || [];
    updatedItems[itemIndex].assigned = assigned.includes(username)
      ? assigned.filter((u) => u !== username)
      : [...assigned, username];
    setItems(updatedItems);
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
        const perAssigned =
          parseFloat(item.amount || 0) / (assigned.length || 1);
        assigned.forEach((u) => (shares[u] += perAssigned));
      });
      usernameList.forEach((u) => (shares[u] = shares[u].toFixed(2)));
    } else if (splitType === "percentage") {
      usernameList.forEach((u) => {
        const pct = percentages[u] || 0;
        shares[u] = ((total * pct) / 100).toFixed(2);
      });
    }

    return shares;
  };

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

  const shares = calculateShares();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Add New Bill</h1>
        <form className="auth-form" onSubmit={onSubmit}>
          <label>Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
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
              {splitType === "byItem" && (
                <div>
                  <label>Assign to:</label>
                  {usernames.map((u) => (
                    <label key={u.username}>
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
          <label>
            <input
              type="radio"
              value="even"
              checked={splitType === "even"}
              onChange={(e) => setSplitType(e.target.value)}
            />
            Even
          </label>
          <label>
            <input
              type="radio"
              value="byItem"
              checked={splitType === "byItem"}
              onChange={(e) => setSplitType(e.target.value)}
            />
            By Item
          </label>
          <label>
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
              <h4>Set Percentage per Username</h4>
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


