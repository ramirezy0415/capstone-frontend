import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getGroupDetails } from "../api/groups";
import { useAuth } from "../auth/AuthContext";
import ExpensesList from "./ExpensesList";
import { getProfile } from "../api/profile";

export default function GroupDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [groupDetails, setGroupDetails] = useState({});
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [error, setError] = useState(null);

  const syncGroupDetails = async () => {
    try {
      const data = await getGroupDetails(token, id);
    setGroupDetails(data);

    const profileData = await getProfile(token);

    const filteredExpenses =
      profileData.expensesOwed?.filter(
        (expense) => String(expense.group_id) === String(id)
      ) || [];

          setGroupExpenses(filteredExpenses);
  } catch (err) {
    console.error("Failed to load group details:", err);
    setError(err.message || "Failed to load group details");
  }
};

  const handleBackButton = () => {
    navigate("/groups");
  };

  useEffect(() => {
    if (token)
    syncGroupDetails();
  }, [id, token]);

  return (
    <section>
      <button onClick={handleBackButton}>Back</button>
      <h2>{groupDetails.name}</h2>
      <p>{groupDetails.description}</p>
      {error && <p role="alert">{error}</p>}
    <h2>Group Expenses</h2>
    <ExpensesList expenses={groupExpenses} />
    </section>
  );
}

