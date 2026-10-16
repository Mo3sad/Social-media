import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userDataContext } from "../../Context/userData.Context";
import Loader from "../Loader/Loader";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const context = useContext(userDataContext);

  if (!context) {
    throw new Error("ProtectedRoute must be inside UserDataProvider");
  }

  const { userData, isLoadingUser } = context;

  const token = localStorage.getItem("userToken");

  if (isLoadingUser) {
    return <Loader />;
  }

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  return children;
}