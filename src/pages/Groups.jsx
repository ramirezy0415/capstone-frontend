import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { createNewGroup } from "../api/groups";

export default function Groups() {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const handleGroupFormSubmission = async (e) => {
    try {
      e.preventDefault();
      setError(null);

      const formData = new FormData(e.target);
      const group_name = formData.get("group_name");
      const description = formData.get("description");
      await createNewGroup(token, group_name, description);
      e.target.reset();
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };
  return (
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
  );
}
