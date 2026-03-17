import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function CrearSolicitud() {
  const { tokenPublico, limpiarTokenPublico } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cuil: "",
    nombre: "",
    apellido: "",
    distritoId: 1,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!tokenPublico) {
    return <Navigate to="/solicitar-certificado" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "distritoId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/public/solicitudes", formData, {
        headers: {
          Authorization: `Bearer ${tokenPublico}`,
        },
      });

      navigate("/portal", {
        state: {
          flashMessage: "Solicitud creada con éxito",
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error al crear la solicitud"
      );
    } finally {
      setLoading(false);
    }
  };

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
          className="btn-secondary"
          onClick={() => navigate("/portal")}
        >
          ← Volver
        </button>

        <button
          type="button"
          className="btn-secondary btn-danger-soft"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <p className="eyebrow">Ministerio de Justicia</p>
          <h1>Solicitar certificado</h1>
          <p className="subtitle">
            Completá los datos requeridos para generar una nueva solicitud de
            certificado.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="cuil">CUIL</label>
              <input
                id="cuil"
                type="text"
                name="cuil"
                value={formData.cuil}
                onChange={handleChange}
                placeholder="Ej: 20345678901"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="distritoId">Distrito</label>
              <select
                id="distritoId"
                name="distritoId"
                value={formData.distritoId}
                onChange={handleChange}
                required
              >
                <option value={1}>Santa Fe</option>
                <option value={2}>Rosario</option>
                <option value={3}>Reconquista</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresá el nombre"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ingresá el apellido"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Enviando..." : "Crear solicitud"}
          </button>
        </form>

        {error && <p className="message error">{error}</p>}

        <div className="auth-footer">
          <p>
            Verificá que todos los datos sean correctos antes de confirmar la
            solicitud.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CrearSolicitud;