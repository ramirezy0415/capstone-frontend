import { useNavigate } from "react-router";

export default function GroupsList() {
  const navigate = useNavigate();

  const handleNewGroupButton = () => {
    navigate("new");
  };

  return (
    <div>
      <button className="new-group-btn" onClick={handleNewGroupButton}>
        Create New Group
      </button>
      <p>List of all groups...</p>
    </div>
  );
}
