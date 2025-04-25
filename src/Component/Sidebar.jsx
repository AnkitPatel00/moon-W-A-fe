import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    return (
      <ul className="navbar-nav fs-5">
        <li className="nav-item">
          <NavLink to="/" className="nav-link ">
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/project" className="nav-link ">
            Project
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/team" className="nav-link ">
            Team
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/report" className="nav-link ">
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
