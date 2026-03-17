import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function VerificarCodigo() {
  const savedEmail = localStorage.getItem("otp_email") || "";
  const navigate = useNavigate();
  const { guardarTokenPublico } = useAuth();

  const [code, setCode] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!savedEmail) {
    return (
      <div className="page page-auth">
        <div className="auth-card">
          <div className="auth-header">
            <p className="eyebrow">Ministerio de Justicia</p>
            <h1>Verificar código</h1>
            <p className="subtitle">
              Primero tenés que solicitar un código para continuar.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate("/solicitar-certificado")}
          >
            Ir a solicitar código
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/public/auth/verify-code", {
        email: savedEmail,
        code,
      });

      const token = response.data?.token || response.data?.tokenPublico;

      if (token) {
        guardarTokenPublico(token);
        localStorage.removeItem("otp_email");
        navigate("/portal");
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-auth">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Ministerio de Justicia</p>
          <h1>Verificar código</h1>
          <p className="subtitle">
            Ingresá el código de 6 dígitos enviado al correo para continuar con el trámite.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={savedEmail}
              readOnly
              className="input-readonly"
            />
          </div>

          <div className="form-group">
            <label htmlFor="code">Código de verificación</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              placeholder="Ingresá el código"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>

        {mensaje && <p className="message success">{mensaje}</p>}
        {error && <p className="message error">{error}</p>}

        <div className="auth-footer">
          <p>
            Si no recibiste el correo, verificá la bandeja de spam o volvé a solicitar un nuevo código.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerificarCodigo;