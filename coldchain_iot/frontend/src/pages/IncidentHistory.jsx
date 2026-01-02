import { useEffect, useState } from "react";
import api from "../api/axios";

function IncidentHistory() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    api.get("incidents/history/")
      .then(res => setIncidents(res.data));
  }, []);

  return (
    <div className="incidents-page">
      <h1>Historique des incidents</h1>

      <table className="modern-table">
        <thead>
          <tr>
            <th>Capteur</th>
            <th>Température</th>
            <th>Statut</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(inc => (
            <tr key={inc.id}>
              <td>{inc.sensor}</td>
              <td>{inc.temperature} °C</td>
              <td>{inc.status}</td>
              <td>{new Date(inc.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentHistory;
