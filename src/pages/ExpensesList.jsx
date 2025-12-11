import { useNavigate } from "react-router";

export default function ExpensesList({ expenses }) {
  const navigate = useNavigate();
  const handleViewExpenseDetailButton = (expense_id) => {
    navigate(`/splitbills/${expense_id}`);
  };

  return (
    <div>
      {expenses.length === 0 ? (
        <p> No Expenses for user.</p>
      ) : (
        <li>
          <ul>
            {expenses.map((e) => (
              <li key={e.id}>
                {e.group_name} Amount Owed: ${Number(e.item_amount).toFixed(2)}{" "}
                <button
                  onClick={() => {
                    handleViewExpenseDetailButton(e.id);
                  }}
                >
                  View Expense Detail
                </button>
              </li>
            ))}
          </ul>
        </li>
      )}
    </div>
  );
}
