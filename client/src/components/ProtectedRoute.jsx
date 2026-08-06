import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ADMIN_PATH } from "../config/site";

export default function ProtectedRoute({ children }) {
  const { checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) {
    return <div className="grid min-h-[60vh] place-items-center font-bold text-ink/50">Checking secure access...</div>;
  }

  return isAuthenticated ? children : <Navigate to={`${ADMIN_PATH}/login`} replace />;
}
