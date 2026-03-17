import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PortalCiudadano() {
  const { tokenPublico } = useAuth();

  if (!tokenPublico) {
    return <Navigate to="/solicitar-certificado" replace />;
  }

  return (
    <div className="page page-auth">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Ministerio de Justicia</p>
          <h1>Portal ciudadano</h1>
          <p className="subtitle">
            Seleccioná una opción para continuar dentro del sistema.
          </p>
        </div>

        <div className="portal-actions">
          <Link to="/crear-solicitud" className="portal-link">
            <button className="btn-primary">Crear solicitud</button>
          </Link>

          <Link to="/mis-certificados" className="portal-link">
            <button className="btn-primary">Ver mis solicitudes</button>
          </Link>

          <Link to="/verificar-certificado" className="portal-link">
            <button className="btn-primary">Verificar certificado</button>
          </Link>
        </div>

        <div className="auth-footer">
          <p>
            Desde este panel podés iniciar nuevos trámites, consultar tus
            solicitudes y verificar certificados emitidos.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PortalCiudadano;