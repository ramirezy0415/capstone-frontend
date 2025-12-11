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
import GroupDetails from "./pages/GroupDetails";
import ExpenseDetail from "./pages/ExpenseDetail";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Homepage />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/groups" element={<Groups />}>
            <Route index element={<GroupsList />} />
            <Route path=":id" element={<GroupDetails />} />
            <Route path="new" element={<NewGroup />} />
          </Route>

          <Route path="/splitbills" element={<SplitBills />}></Route>
          <Route path="/splitbills/:id" element={<ExpenseDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}
