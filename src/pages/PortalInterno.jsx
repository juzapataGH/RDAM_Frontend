import { useNavigate } from "react-router-dom";

function PortalInterno() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("tokenInterno");
    localStorage.removeItem("userInterno");
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
          <h1>Portal interno</h1>
          <p className="subtitle">
            Gestión de solicitudes y operadores del sistema RDAM.
          </p>
        </div>

        <div className="menu-grid">
          <button
            className="btn-primary"
            onClick={() => navigate("/admin/solicitudes")}
          >
            Ver solicitudes
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/admin/operadores")}
          >
            Gestionar operadores
          </button>
        </div>
      </div>
    </div>
  );
}

export default PortalInterno;