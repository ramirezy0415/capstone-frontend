import { useNavigate } from "react-router";
import { getUserGroups } from "../api/groups";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export default function GroupsList() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [userGroups, setUserGroups] = useState([]);
  const [error, setError] = useState(null);

  const syncGroups = async () => {
    const data = await getUserGroups(token);
    setUserGroups(data);
  };

  const handleNewGroupButton = () => {
    navigate("new");
  };

  const handleViewGroupDetails = (groupId) => {
    navigate(String(groupId));
  };

  useEffect(() => {
    syncGroups();
  }, []);

  return (
    <div>
      <button className="new-group-btn" onClick={handleNewGroupButton}>
        Create New Group
      </button>
      <li>
        {userGroups.map((group) => (
          <ul key={group.id}>
            {group.name}
            <button
              onClick={() => {
                handleViewGroupDetails(group.id);
              }}
            >
              View Details
            </button>
          </ul>
        ))}
      </li>
    </div>
  );
}
