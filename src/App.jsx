import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Homepage from "./pages/Homepage";
import Login from "./auth/Login";
import Register from "./auth/Register";

import Profile from "./pages/profile";
import Groups from "./pages/Groups";
import GroupsList from "./pages/GroupsList";
import NewGroup from "./pages/NewGroup";
import SplitBills from "./pages/SplitBills";

import ProtectedRoute from "./layout/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Homepage />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            // <ProtectedRoute>
            <Profile />
            /* </ProtectedRoute> */
          }
        />
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/groups" element={<Groups />}>
          <Route index element={<GroupsList />} />
          <Route path="new" element={<NewGroup />} />
        </Route>
        {/* </Route> */}
        <Route
          path="/splitbills"
          element={
            <ProtectedRoute>
              <SplitBills />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
