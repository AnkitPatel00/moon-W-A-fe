import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <ul className="navbar-nav">
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
      {/* <li className="nav-item">
        <NavLink to="/setting" className="nav-link ">
          Setting
        </NavLink>
      </li> */}
    </ul>
  );
};

export default Sidebar;
