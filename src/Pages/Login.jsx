import { useState, useEffect } from "react";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialData = { email: "", password: "" };

  const [formData, setFormData] = useState(initialData);

  const { loginState, loginMessage, loginError } = useSelector(
    (state) => state.userState
  );

  const handleForm = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (loginState === "success" && localStorage.getItem("accessToken")) {
      setFormData(initialData);
      navigate("/");
    }
  }, [loginState]);

  return (
    <>
      <div className="login-form-container bg-body-tertiary">
        <form onSubmit={handleSubmit} className="login-form bg-white rounded">
          <h3 className="text-center mb-5 display-6">Workasana Login</h3>
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            value={formData.email}
            className="form-control mb-3"
            type="text"
            onChange={handleForm}
            id="email"
            placeholder="name@example.com"
            required
          />
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            value={formData.password}
            className="form-control"
            type="password"
            onChange={handleForm}
            id="password"
            required
          />
          <button
            disabled={loginState === "loading" ? true : false}
            className="mt-3 btn btn-primary"
          >
            {loginState === "loading" ? "Please Wait" : "Login"}
          </button>
          <Link to="/signup" className="mt-3 btn btn-secondary ms-3">
            Signup
          </Link>
          {loginError && <p className="text-danger mt-2">{loginError}</p>}
        </form>
      </div>
    </>
  );
};
export default Login;
