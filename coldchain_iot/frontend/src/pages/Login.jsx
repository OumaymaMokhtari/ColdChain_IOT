import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        { username, password }
      );

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      onLogin();
    } catch (err) {
      setError("Identifiants incorrects");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="logo">Cold Chain</h2>

        <h3>Login</h3>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit">Sign in</button>
        </form>

        <p className="forgot">Forgot password?</p>
      </div>
    </div>
  );
}

export default Login;
