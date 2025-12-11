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

  return (
    <div>
      <button onClick={handleBackButton}>Back</button>
      <section>
        <h2>
          Expense ID: {selectedExpense.expense_id} <br />
          Group Name: {selectedExpense.group_name}
        </h2>
        <p>
          Split Type: {selectedExpense.split_type} <br />
          Expense Total: {selectedExpense.expense_total} <br />
        </p>

        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Item Quantity</th>
              <th>Item Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedExpense.item_name}</td>
              <td>{selectedExpense.quantity}</td>
              <td>{selectedExpense.price}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
