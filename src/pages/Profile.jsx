import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getProfile } from "../api/profile";
import ExpensesList from "./ExpensesList";

export default function Profile() {
  const { user, token } = useAuth();
  const [totalOwed, setTotalOwed] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    async function fetchProfile() {
      try {
        const data = await getProfile(token);

        setTotalOwed(Number(data.totalOwed) || 0);

        setExpenses(data.expensesOwed || []);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError(err.message || "Failed to load profile");
      }
    }

    fetchProfile();
  }, [token]);

  return (
    <div className="profile-container">
      <h1>Hello {user?.username}!</h1>

      {error && <p className="error-text">{error}</p>}

      <h2>Total Owed: ${totalOwed.toFixed(2)}</h2>

      <h2>Your Expenses</h2>
      <ExpensesList expenses={expenses} />
    </div>
  );
}
