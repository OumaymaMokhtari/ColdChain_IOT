import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import api from "./api/axios";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import Login from "./pages/Login";
import IncidentDetail from "./pages/IncidentDetail";
import Operators from "./pages/Operators"; // CRUD opérateurs

function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("access")
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Charger l'utilisateur connecté
  useEffect(() => {
    if (!isAuth) return;

    api.get("me/")
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setIsAuth(false);
        setLoading(false);
      });
  }, [isAuth]);

  // 🔹 Pas connecté → login
  if (!isAuth) {
    return <Login onLogin={() => setIsAuth(true)} />;
  }

  // 🔹 En attente du profil utilisateur
  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <BrowserRouter>

      {/* SIDEBAR */}
      <Sidebar
        user={user}
        onLogout={() => setIsAuth(false)}
      />

      {/* CONTENU */}
      <main
        style={{
          marginLeft: "240px",
          padding: "30px",
          minHeight: "100vh",
          backgroundColor: "#f5f6fa"
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* Incidents actifs */}
          <Route path="/incidents" element={<Incidents />} />

          {/* Incidents archivés */}
          <Route path="/incidents/archive" element={<Incidents archive />} />

          {/* Détail incident */}
          <Route path="/incidents/:id" element={<IncidentDetail />} />

          {/* CRUD opérateurs — ADMIN SEULEMENT */}
          <Route
            path="/operators"
            element={
              user.isAdmin ? <Operators /> : <Navigate to="/" />
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
