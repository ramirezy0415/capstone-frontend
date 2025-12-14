const API = import.meta.env.VITE_API;

export async function searchUsers(token, query) {
  const res = await fetch(`${API}/users/search?q=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}

export async function searchGroups(token, query) {
  const res = await fetch(`${API}/groups/search?q=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}
