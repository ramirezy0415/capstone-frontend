import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getProfile } from "../api/profile";

export default function Profile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    async function fetchProfile() {
      try {
        const data = await getProfile(token);
        setProfile(data); // store full profile data from backend
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProfile();
  }, [token]);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h1>Hello {profile.username}!</h1>

      {error && <p className="error-text">{error}</p>}

      <p>Total Owed: ${profile.totalOwed?.toFixed(2) || "0.00"}</p>

      <h2>Your Expenses</h2>
      {profile.expenses && profile.expenses.length > 0 ? (
        <ul>
          {profile.expenses.map((e) => (
            <li key={e.id} className="expense-item">
              <p><strong>Group:</strong> {e.group_name}</p>
              <p><strong>Item:</strong> {e.item_name}</p>
              <p><strong>Total:</strong> ${e.total.toFixed(2)}</p>
              <p><strong>Type:</strong> {e.type}</p>
              <p><strong>Owed:</strong> ${e.amountOwed?.toFixed(2) || "0.00"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses yet.</p>
      )}
    </div>
  );
}

