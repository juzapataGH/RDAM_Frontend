import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function VerificarCodigo() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const { guardarTokenPublico } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const response = await api.post("/public/auth/verify-code", {
        email,
        code,
      });

      const token = response.data?.token || response.data?.tokenPublico;

      if (token) {
        guardarTokenPublico(token);
        setMensaje("Código verificado correctamente. Token guardado.");
      } else {
        setMensaje("Código verificado, pero no se encontró token en la respuesta.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error al verificar el código"
      );
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Verificar código</h2>

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

        <div style={{ marginBottom: "1rem" }}>
          <label>Código</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "0.75rem" }}
          />
        </div>

        <button type="submit">Verificar código</button>
      </form>

      {mensaje && <p style={{ color: "green", marginTop: "1rem" }}>{mensaje}</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}

export default VerificarCodigo; 