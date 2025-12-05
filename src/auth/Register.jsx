import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  console.log(navigate);
  const onRegister = async (e) => {
    e.preventDefault();
    console.log("Register clicked"); // test 
    setError(null);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");

    console.log({ email, username, password }) 

console.log("Before register");
  await register({ email, username, password });
  console.log("After register");
      navigate("/profile");

    // try {
    //   await register({ email, username, password });
    //   navigate("/profile");
    // } catch (err) {
    //   setError(err.message);
    // }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>

        <form className="auth-form" onSubmit={onRegister}>
          <label>Email</label>
          <input type="email" name="email" required />

          <label>Username</label>
          <input type="text" name="username" required />

          <label>Password</label>
          <input type="password" name="password" required />

          <button type="submit" className="auth-btn">Register</button>

          {error && <p className="error-text">{error}</p>}
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

