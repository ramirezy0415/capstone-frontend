import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
}
