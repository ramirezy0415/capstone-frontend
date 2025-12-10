import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { createNewGroup } from "../api/groups";
import { useNavigate } from "react-router";

export default function NewGroups() {
  const { token } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGroupFormSubmission = async (e) => {
    try {
      e.preventDefault();
      setError(null);

      const formData = new FormData(e.target);
      const group_name = formData.get("group_name");
      const description = formData.get("description");
      const result = await createNewGroup(token, group_name, description);
      if (result) {
        e.target.reset();
      }
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  const handleBackButton = () => {
    navigate("/groups");
  };
  return (
    <div>
      <button onClick={handleBackButton}> Back </button>
      <form className="auth-form" onSubmit={handleGroupFormSubmission}>
        <label>Group name:</label>
        <input type="text" name="group_name" required />
        <label>Description:</label>
        <input type="text" name="description" />
        <button type="submit" className="auth-btn">
          Submit
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}
