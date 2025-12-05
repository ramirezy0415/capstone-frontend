import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { createNewGroup } from "../api/groups";

export default function Groups() {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const handleGroupFormSubmission = async () => {
    try {
      await createNewGroup(token, "new group name", "some description");
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };
  console.log(token);

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
