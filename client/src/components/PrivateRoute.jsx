import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // Mengambil token dari localStorage
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
