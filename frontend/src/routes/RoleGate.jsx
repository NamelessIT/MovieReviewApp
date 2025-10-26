import { Navigate, useLocation } from "react-router-dom";
import AdminRoutes from "./AdminRoute";
import UserRoutes from "./UserRoute";
import AuthPage from "../page/Login/authPage.jsx";

const RoleGate = () => {
  const location = useLocation();
  // Choose route set based only on role stored in localStorage
  const role = localStorage.getItem("role");

  // Public auth route handling: move /auth out of UserRoutes and serve it here
  if (
    location.pathname.startsWith("/auth") ||
    location.pathname.startsWith("/login")
  ) {
    console.log("role",role)
    // If user already has a role, redirect them to their default area instead of showing login
    if (role === "Admin" || role === "Moderator") {
        console.log("roleAdmin", role);
      return <Navigate to="/admin/homepage" replace />;
    }
    if (role) {
        console.log("roleAdmin", role);
      return <Navigate to="/user/homepage" replace />;
    }
    // No role -> show public auth page
    return <AuthPage />;
  }
  console.log("auth", role);
  // Role-based routing
  if (role == "Admin" || role === "Moderator"){
    console.log("authAdmin",role);
        return <AdminRoutes />;
  } 
  return <UserRoutes />;
};

export default RoleGate;
