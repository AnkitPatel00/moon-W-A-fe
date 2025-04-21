import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginRouteProtect = ({ children }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return children;
};

export default LoginRouteProtect;
