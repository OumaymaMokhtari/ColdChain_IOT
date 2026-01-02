import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import "./Incidents.css";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const isArchive = location.pathname.includes("archive");

  const fetchIncidents = () => {
    const url = isArchive
      ? "incidents/history/"
      : "incidents/";

    api.get(url)
      .then(res => {
        if (!isArchive) {
          // NON résolus seulement
          setIncidents(
            res.data.filter(inc =>
              ["ACTIVE", "IN_PROGRESS", "ESCALATED"].includes(inc.status)
            )
          );
        } else {
          setIncidents(res.data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchIncidents();
  }, [isArchive]);

  const acceptIncident = (id) =>
    api.post(`incidents/accept/${id}/`).then(fetchIncidents);

  const refuseIncident = (id) =>
    api.post(`incidents/refuse/${id}/`).then(fetchIncidents);

  const resolveIncident = (id) =>
    api.post(`incidents/resolve/${id}/`).then(fetchIncidents);

  return (
    <div className="incidents-page">
      <h1>
        {isArchive ? "Archives des incidents" : "Gestion des incidents"}
      </h1>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Capteur</th>
              <th>Température</th>
              <th>Statut</th>
              <th>Date</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map(inc => (
              <tr
                key={inc.id}
                onClick={() => navigate(`/incidents/${inc.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{inc.sensor_name}</td>
                <td>{inc.temperature} °C</td>
                <td>
                  <span className={`status ${inc.status.toLowerCase()}`}>
                    {inc.status}
                  </span>
                </td>
                <td>{new Date(inc.created_at).toLocaleString()}</td>

                <td className="actions">
                  {!isArchive && inc.status === "ACTIVE" && (
                    <>
                      <button
                        className="icon-btn accept"
                        onClick={(e) => {
                          e.stopPropagation();
                          acceptIncident(inc.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>

                      <button
                        className="icon-btn refuse"
                        onClick={(e) => {
                          e.stopPropagation();
                          refuseIncident(inc.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </>
                  )}

                  {!isArchive && inc.status === "IN_PROGRESS" && (
                    <button
                      className="icon-btn resolve"
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveIncident(inc.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} />
                    </button>
                  )}

                  {isArchive && <span className="muted">—</span>}
                </td>
              </tr>
            ))}

            {incidents.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  Aucun incident
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Incidents;
