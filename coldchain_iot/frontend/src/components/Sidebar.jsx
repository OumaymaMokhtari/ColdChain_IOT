import { NavLink, useNavigate } from "react-router-dom";
import IncidentBadge from "./IncidentBadge";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faChartLine,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1️⃣ Supprimer les tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // 2️⃣ Mettre à jour l'état d'authentification
    onLogout();

    // 3️⃣ Rediriger vers login
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="sidebar-header">
        <h2>Cold Chain</h2>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        <NavLink to="/" className="sidebar-link">
          <FontAwesomeIcon icon={faChartLine} />
          Dashboard
        </NavLink>

        <NavLink to="/incidents" className="sidebar-link">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          Incidents
        </NavLink>
      </nav>

      {/* BADGE INCIDENT */}
      <div className="sidebar-incidents">
        <IncidentBadge />
      </div>

      {/* LOGOUT */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            style={{ marginRight: "8px" }}
          />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
