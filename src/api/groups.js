const API = import.meta.env.VITE_API;
const BASE_GROUPS_URL = `${API}/groups`;

export async function getUserGroups(token) {
  try {
    const data = await fetch(`${BASE_GROUPS_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${token}`,
      },
    });
    const response = await data.json();

    if (!response) throw new Error("Error retriving user groups.");

    return response;
  } catch (error) {
    console.error(error.message);
  }
}

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

export async function getGroupDetails(token, group_id) {
  try {
    const data = await fetch(`${BASE_GROUPS_URL}/${group_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${token}`,
      },
    });
    const response = await data.json();

    if (!response) throw new Error("Error retriving group details.");

    return response;
  } catch (error) {
    console.error(error.message);
  }
}
