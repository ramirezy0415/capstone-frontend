import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

const navClass = ({ isActive }) =>
  isActive ? "nav-link active" : "nav-link";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <header id="navbar">
      <div className="navbar-left">
        <NavLink to="/" className={navClass}>
          Even Exchanges
        </NavLink>
      </div>

      <nav className="navbar-right">
        {token ? (
          <>
            <NavLink to="/profile" className={navClass}>
              Profile
            </NavLink>

            <NavLink to="/groups" className={navClass}>
              Groups
            </NavLink>

            <NavLink to="/splitbills" className={navClass}>
              Split Bills
            </NavLink>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navClass}>
              Login
            </NavLink>

            <NavLink to="/register" className={navClass}>
              Register
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
