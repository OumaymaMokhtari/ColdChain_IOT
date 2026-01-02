import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "./IncidentBadge.css";

function IncidentBadge() {
  const [activeCount, setActiveCount] = useState(0);
  const navigate = useNavigate();

  const fetchActiveIncidents = () => {
    api.get("incidents/")
      .then(res => {
        const active = res.data.filter(
          inc => inc.status === "ACTIVE"
        );
        setActiveCount(active.length);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchActiveIncidents();
    const interval = setInterval(fetchActiveIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 S’il n’y a aucun incident actif → rien à afficher
  if (activeCount === 0) return null;

  return (
    <div
      className="incident-bell"
      onClick={() => navigate("/incidents")}
      title="Voir les incidents"
    >
      <FontAwesomeIcon icon={faBell} />
      <span className="incident-count">{activeCount}</span>
    </div>
  );
}

export default IncidentBadge;
