
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function ProtectedRoute({ children, roles }) {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  // Wait until the saved token has been validated.
  if (authLoading) {
    return (
      <div className="container">
        <p>Checking your session...</p>
      </div>
    );
  }

  // No valid session: redirect to login.
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // A logged-in user without the required role cannot access this route.
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
