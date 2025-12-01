import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router";

const API = import.meta.env.VITE_API;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // Register user
  async function register({ email, username, password }) {
    try {
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Save token and user
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsError(false);

      return data;
    } catch (error) {
      setIsError(true);
      console.error("Registration Error:", error);
      throw error;
    }
  }

  // Login user
  async function login(username, password) {
    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsError(false);

      return true;
    } catch (error) {
      setIsError(true);
      console.error("Login failed:", error);
      return false;
    }
  }

  // Authenticate user (verify token)
  async function authenticate(token) {
    try {
      const response = await fetch(`${API}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }

  // Logout
  function logout() {
    setToken(null);
    setUser(null);
    setIsError(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const value = useMemo(() => {
    return { token, user, isError, register, login, authenticate, logout };
  }, [token, user, isError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth anywhere
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
