const API = import.meta.env.VITE_API;
const BASE_EXPENSES_URL = `${API}/splitbills`;

export async function createExpense(token, billData) {
  try {
    const res = await fetch(BASE_EXPENSES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(billData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to create expense");

    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

export async function getExpenseDetails(token, expense_id) {
  try {
    const res = await fetch(`${BASE_EXPENSES_URL}/${expense_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to create expense");

    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

export async function updateExpensePaid(token, expense_id, is_paid) {
  const res = await fetch(`${BASE_EXPENSES_URL}/${expense_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ is_paid }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update expense");
  }

  return await res.json();
}
