/* eslint-disable react/prop-types */
import { Loader } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAllowed,isLoading, redirectTo = "/login", children }) => {
  if (isLoading) {
    return (
      <div>
        <Loader className="w-20 h-20 animate-spin mr-4" />
      </div>
    );
  }

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
