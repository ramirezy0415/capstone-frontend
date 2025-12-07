import { Outlet } from "react-router";

export default function Groups() {
  return (
    <div className="groups-container">
      <h1>👥 Groups</h1>
      <Outlet />
    </div>
  );
}
