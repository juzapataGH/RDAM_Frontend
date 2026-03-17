import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PortalCiudadano() {
  const { tokenPublico, limpiarTokenPublico } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!tokenPublico) {
    return <Navigate to="/solicitar-certificado" replace />;
  }

  const flashMessage = location.state?.flashMessage || "";

  const handleLogout = () => {
    limpiarTokenPublico();
    localStorage.removeItem("otp_email");
    navigate("/solicitar-certificado");
  };

  return (
    <div className="page page-auth">
      <div className="page-header">
        <button
          type="button"
          className="btn-secondary btn-danger-soft"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Ministerio de Justicia</p>
          <h1>Portal ciudadano</h1>
          <p className="subtitle">
            Seleccioná una opción para continuar dentro del sistema.
          </p>
        </div>

        {flashMessage && <p className="message success">{flashMessage}</p>}

        <div className="menu-grid">
          <Link to="/crear-solicitud" className="portal-link">
            <button className="btn-primary">Crear solicitud</button>
          </Link>

          <Link to="/mis-certificados" className="portal-link">
            <button className="btn-primary">Ver mis solicitudes</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PortalCiudadano;