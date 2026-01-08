import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectUser } from "../contexts/auth/authSlice";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector(selectUser);
  if (!isAuthenticated) return <Navigate to={"/auth/"} replace />;

  return <Outlet />;
};
