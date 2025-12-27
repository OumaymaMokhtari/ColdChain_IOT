import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import Login from "./pages/Login";

function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("access")
  );

  // 🔒 Si non authentifié → Login
  if (!isAuth) {
    return <Login onLogin={() => setIsAuth(true)} />;
  }

  return (
    <BrowserRouter>
      {/* SIDEBAR */}
      <Sidebar onLogout={() => setIsAuth(false)} />

      {/* CONTENU PRINCIPAL */}
      <main
        style={{
          marginLeft: "240px",   // largeur de la sidebar
          padding: "30px",
          minHeight: "100vh",
          backgroundColor: "#f5f6fa"
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
