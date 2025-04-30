import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    return (
      <ul className="navbar-nav fs-5">
        <li className="nav-item">
          <NavLink to="/" className="nav-link ">
            <i className="fa-solid fa-bars-progress me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/project" className="nav-link ">
            <i class="fa-solid fa-folder me-2"></i> Project
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/team" className="nav-link ">
            <i className="fa-solid fa-headset me-2"></i> Team
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/report" className="nav-link ">
            <i className="fa-solid fa-chart-simple me-2"></i>
            Reports
          </NavLink>
        </li>
      </ul>
    );
  } else {
    return (
      <ul className="navbar-nav ">
        <li className="nav-item">
          <NavLink className="btn  btn-outline-secondary mb-3" to="/">
            <i className="fa-solid fa-bars-progress"></i> Back to Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left"></i> Go Back
          </button>
        </li>
      </ul>
    );
  }
};

export default Sidebar;
