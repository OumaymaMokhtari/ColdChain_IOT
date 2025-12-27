import { useEffect, useState } from "react";
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

  const fetchIncidents = () => {
    api.get("incidents/")
      .then(res => setIncidents(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const acceptIncident = (id) => {
    api.post(`incidents/accept/${id}/`).then(fetchIncidents);
  };

  const refuseIncident = (id) => {
    api.post(`incidents/refuse/${id}/`).then(fetchIncidents);
  };

  const resolveIncident = (id) => {
    api.post(`incidents/resolve/${id}/`).then(fetchIncidents);
  };

  return (
    <div className="incidents-page">
      <h1>Gestion des incidents</h1>

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
              <tr key={inc.id}>
                <td>{inc.sensor_name}</td>
                <td>{inc.temperature} °C</td>
                <td>
                  <span className={`status ${inc.status.toLowerCase()}`}>
                    {inc.status}
                  </span>
                </td>
                <td>{new Date(inc.created_at).toLocaleString()}</td>

                <td className="actions">
                  {inc.status === "ACTIVE" && (
                    <>
                      <button
                        className="icon-btn accept"
                        title="Accepter"
                        onClick={() => acceptIncident(inc.id)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>

                      <button
                        className="icon-btn refuse"
                        title="Refuser"
                        onClick={() => refuseIncident(inc.id)}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </>
                  )}

                  {inc.status === "IN_PROGRESS" && (
                    <button
                      className="icon-btn resolve"
                      title="Résoudre"
                      onClick={() => resolveIncident(inc.id)}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} />
                    </button>
                  )}

                  {inc.status === "ESCALATED" && (
                    <span className="muted">En attente</span>
                  )}

                  {inc.status === "RESOLVED" && (
                    <span className="resolved">Résolu</span>
                  )}
                </td>
              </tr>
            ))}

            {incidents.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  Aucun incident détecté
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
