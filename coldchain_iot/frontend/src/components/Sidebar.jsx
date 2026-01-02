import { NavLink, useNavigate } from "react-router-dom";
import IncidentBadge from "./IncidentBadge";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faChartLine,
  faTriangleExclamation,
  faBoxArchive,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar({ onLogout, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    onLogout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Cold Chain</h2>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/" end className="sidebar-link">
          <FontAwesomeIcon icon={faChartLine} />
          Dashboard
        </NavLink>

        <NavLink to="/incidents" end className="sidebar-link">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          Incidents
        </NavLink>

        <NavLink to="/incidents/archive" className="sidebar-link">
          <FontAwesomeIcon icon={faBoxArchive} />
          Archive
        </NavLink>

        {user?.isAdmin && (
          <NavLink to="/operators" className="sidebar-link">
            <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} />
            Opérateurs
          </NavLink>
        )}
      </nav>

      <div className="sidebar-incidents">
        <IncidentBadge />
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
