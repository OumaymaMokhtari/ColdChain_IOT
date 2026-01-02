import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Operators.css";

function Operators() {
  const [operators, setOperators] = useState([]);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const fetchOperators = () => {
    api.get("operators/")
      .then(res => setOperators(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addOperator = () => {
    setError(null);

    if (form.password !== form.confirm_password) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    api.post("operators/", form)
      .then(() => {
        setForm({
          username: "",
          email: "",
          password: "",
          confirm_password: ""
        });
        fetchOperators();
      })
      .catch(err => {
        const msg = err.response?.data;
        setError(JSON.stringify(msg));
      });
  };

  const deleteOperator = (id) => {
    if (!window.confirm("Supprimer cet opérateur ?")) return;

    api.delete(`operators/${id}/delete/`)
      .then(fetchOperators)
      .catch(err => console.error(err));
  };

  return (
    <div className="operators-page">
      <h1>Gestion des opérateurs</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card">
        <h3>Ajouter un opérateur</h3>

        <div className="form-grid">
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} />
          <input type="password" name="confirm_password" placeholder="Confirmer le mot de passe" value={form.confirm_password} onChange={handleChange} />
        </div>

        <button className="primary-btn" onClick={addOperator}>
          Ajouter
        </button>
      </div>

      <div className="card">
        <h3>Liste des opérateurs</h3>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {operators.map(op => (
              <tr key={op.id}>
                <td>{op.username}</td>
                <td>{op.email}</td>
                <td>
                  <button className="danger-btn" onClick={() => deleteOperator(op.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Operators;
