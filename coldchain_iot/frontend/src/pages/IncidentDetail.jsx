import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./IncidentDetail.css";

function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchIncident = () => {
    api.get(`incidents/${id}/`)
      .then(res => {
        setIncident(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const addComment = () => {
    if (!comment.trim()) return;

    api.post(`incidents/comment/${incident.id}/`, {
      comment: comment
    })
    .then(() => {
      setComment("");
      fetchIncident();
    })
    .catch(err => console.error(err));
  };

  const archiveIncident = () => {
    api.post(`incidents/archive/${incident.id}/`)
      .then(() => {
        navigate("/incidents");
      })
      .catch(err => console.error(err));
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!incident) {
    return <p>Incident introuvable</p>;
  }

  return (
    <div className="incident-detail">

      <h1>Détails d’incident #{incident.id}</h1>

      <section className="card">
        <h3>Informations générales</h3>

        <div className="info-grid">
          <p><strong>Date début :</strong> {incident.start_date}</p>
          <p><strong>Date fin :</strong> {incident.end_date || "—"}</p>
          <p><strong>Durée :</strong> {incident.duration} min</p>
          <p><strong>Compteur d’alertes :</strong> {incident.alert_count}</p>
          <p><strong>Température maximale :</strong> {incident.max_temperature} °C</p>
          <p>
            <strong>État :</strong>{" "}
            <span className={`status ${incident.status.toLowerCase()}`}>
              {incident.status}
            </span>
          </p>
        </div>
      </section>
      <section className="card">
        <h3>Commentaires & accusés des opérateurs</h3>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Opérateur</th>
              <th>Accusé de réception</th>
              <th>Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {incident.comments && incident.comments.length > 0 ? (
              incident.comments.map(c => (
                <tr key={c.id}>
                  <td>{c.operator}</td>
                  <td>{c.ack ? "Oui" : "Non"}</td>
                  <td>{c.comment}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty">
                  Aucun commentaire
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <section className="card">
        <h3>Ajouter un commentaire</h3>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Commentaire opérateur..."
          rows={3}
        />

        <button
          className="back-btn"
          onClick={addComment}
          disabled={!comment.trim()}
        >
          Ajouter
        </button>
      </section>
      {incident.status === "RESOLVED" && (
        <button
          className="back-btn archive"
          onClick={archiveIncident}
        >
          Archiver l’incident
        </button>
      )}
      <button className="back-btn" onClick={() => navigate("/incidents")}>
        ← Retour aux incidents
      </button>

    </div>
  );
}

export default IncidentDetail;
