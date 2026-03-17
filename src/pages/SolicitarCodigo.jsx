import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function SolicitarCodigo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modo, setModo] = useState("email"); // email | internal
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/public/auth/check-email", { email });

      if (response.data.type === "internal") {
        setModo("internal");
      } else {
        await api.post("/public/auth/request-code", { email });
        localStorage.setItem("otp_email", email);
        navigate("/verificar-codigo");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "No se pudo validar el correo"
      );
    } finally {
      setLoading(false);
    }
  };

 const handleInternalLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await api.post("/internal/auth/login", {
      email,
      password,
    });

    const token = response.data?.token;
    const user = response.data?.user;

    if (!token) {
      setError("No se recibió token del backend");
      return;
    }

    localStorage.setItem("tokenInterno", token);

    if (user) {
      localStorage.setItem("userInterno", JSON.stringify(user));
    }

    if (user?.rol === "OPERADOR") {
      navigate("/admin/solicitudes");
    } else {
      navigate("/portal-interno");
    }
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message || "Credenciales inválidas"
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
          <h1>Registro Digital de Antecedentes</h1>
          <p className="subtitle">
            Ingresá tu correo electrónico para acceder al sistema.
          </p>
        </div>

        {modo === "email" && (
          <form onSubmit={handleCheckEmail} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="nombre@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Validando..." : "Continuar"}
            </button>
          </form>
        )}

        {modo === "internal" && (
          <form onSubmit={handleInternalLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email-readonly">Correo electrónico</label>
              <input
                id="email-readonly"
                type="email"
                value={email}
                readOnly
                className="input-readonly"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        )}

        {error && <p className="message error">{error}</p>}
      </div>
    </div>
  );
}

export default SolicitarCodigo;