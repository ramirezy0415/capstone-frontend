import { useNavigate, useParams } from "react-router";
import { getExpenseDetails } from "../api/expenses";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function ExpenseDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [selectedExpense, setSelectedExpense] = useState({});
  const handleBackButton = () => {
    navigate(-1);
  };

  const syncExpenseDetails = async () => {
    const details = await getExpenseDetails(token, id);
    setSelectedExpense(details);
  };

  useEffect(() => {
    syncExpenseDetails();
  }, []);

  console.log(selectedExpense);
  return (
    <div>
      <button onClick={handleBackButton}>Back</button>
      <h1>Expense Detail for {id}</h1>
    </div>
  );
}
