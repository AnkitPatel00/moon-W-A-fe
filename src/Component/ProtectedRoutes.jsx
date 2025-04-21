import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [navigate, token]);

  return children;
};

export default ProtectedRoutes;
