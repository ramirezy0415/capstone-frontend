const API = import.meta.env.VITE_API;
const BASE_GROUPS_URL = `${API}/groups`;

export async function createNewGroup(token, name, description) {
  try {
    const data = await fetch(`${BASE_GROUPS_URL}/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    const response = await data.json();
    if (!response) throw new Error("Error in creating new group");

    return response;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}
