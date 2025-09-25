import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    return (
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white h-100 rounded shadow-sm">
        <ul className="nav nav-pills flex-column mb-auto fs-6">
          <li className="nav-item">
            <NavLink to="/" className="nav-link text-white" end>
              <i className="fa-solid fa-bars-progress me-2"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/project" className="nav-link text-white">
              <i className="fa-solid fa-folder me-2"></i> Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/team" className="nav-link text-white">
              <i className="fa-solid fa-headset me-2"></i> Team
            </NavLink>
          </li>
          <li>
            <NavLink to="/report" className="nav-link text-white">
              <i className="fa-solid fa-chart-simple me-2"></i> Reports
            </NavLink>
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white h-100 rounded shadow-sm">
        <h5 className="mb-4 fw-bold text-primary">Navigation</h5>
        <ul className="nav flex-column">
          <li>
            <NavLink className="btn btn-outline-light mb-3 w-100" to="/">
              <i className="fa-solid fa-bars-progress"></i> Back to Dashboard
            </NavLink>
          </li>
          <li>
            <button
              className="btn btn-outline-light w-100"
              onClick={() => navigate(-1)}
            >
              <i className="fa-solid fa-arrow-left"></i> Go Back
            </button>
          </li>
        </ul>
      </div>
    );
  }
};

export default Sidebar;
