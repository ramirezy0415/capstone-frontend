import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getGroupDetails } from "../api/groups";
import { useAuth } from "../auth/AuthContext";

export default function GroupDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [groupDetails, setGroupDetails] = useState({});
  const [error, setError] = useState(null);

  const syncGroupDetails = async () => {
    const data = await getGroupDetails(token, id);
    setGroupDetails(data);
  };

  const handleBackButton = () => {
    navigate("/groups");
  };

  useEffect(() => {
    syncGroupDetails();
  }, []);

  return (
    <section>
      <button onClick={handleBackButton}>Back</button>
      <h2>{groupDetails.name}</h2>
      <p>{groupDetails.description}</p>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
