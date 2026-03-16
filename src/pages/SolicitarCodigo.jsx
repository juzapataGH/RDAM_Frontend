import { useState } from "react";
import api from "../api/api";

function SolicitarCodigo() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const response = await api.post("/public/auth/request-code", { email });
      setMensaje(response.data?.message || "Código solicitado correctamente");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error al solicitar el código"
      );
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Solicitar código</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "0.75rem" }}
          />
        </div>

        <button type="submit">Solicitar código</button>
      </form>

      {mensaje && <p style={{ color: "green", marginTop: "1rem" }}>{mensaje}</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}

export default SolicitarCodigo;