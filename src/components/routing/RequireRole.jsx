import { Navigate, Outlet } from "react-router-dom";

export default function RequireRole({ role }) {
  return localStorage.getItem("elitetix_role") === role ? <Outlet /> : <Navigate to="/events" replace />;
}
