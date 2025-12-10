const API = import.meta.env.VITE_API;
const BASE_PROFILE_URL = `${API}/profile`;

export async function getProfile(token) {
  try {
    const res = await fetch(BASE_PROFILE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    
    if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

    return data;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}
