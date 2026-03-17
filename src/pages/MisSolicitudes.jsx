import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function MisSolicitudes() {
  const { tokenPublico, limpiarTokenPublico } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  if (!tokenPublico) {
    return <Navigate to="/solicitar-certificado" replace />;
  }

  const params = new URLSearchParams(location.search);
  const refresh = params.get("refresh");
  const solicitudId = params.get("solicitudId");
  const status = params.get("status");

  const handleLogout = () => {
    limpiarTokenPublico();
    localStorage.removeItem("otp_email");
    navigate("/solicitar-certificado");
  };

  const cargarSolicitudes = async () => {
    try {
      const response = await api.get("/public/solicitudes", {
        headers: {
          Authorization: `Bearer ${tokenPublico}`,
        },
      });

      setSolicitudes(response.data?.items || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Error al cargar las solicitudes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  useEffect(() => {
    if (refresh === "1") {
      if (status === "success") {
        setMensaje(
          solicitudId
            ? `El pago de la solicitud ${solicitudId} fue procesado. Actualizando estado...`
            : "El pago fue procesado. Actualizando estado..."
        );
      } else if (status === "error") {
        setMensaje(
          solicitudId
            ? `El pago de la solicitud ${solicitudId} fue rechazado.`
            : "El pago fue rechazado."
        );
      }

      // Reintenta varias veces por si el webhook tarda en reflejarse
      let intentos = 0;
      const maxIntentos = 6;

      const interval = setInterval(async () => {
        intentos += 1;
        const response = await api.get("/public/solicitudes", {
  headers: {
    Authorization: `Bearer ${tokenPublico}`,
  },
});

const nuevas = response.data?.items || [];
setSolicitudes(nuevas);

if (solicitudId) {
  const encontrada = nuevas.find(
    (s) => String(s.id) === String(solicitudId)
  );
          if (
            encontrada &&
            (encontrada.estado === "PAGADO" ||
              encontrada.estado === "PUBLICADO" ||
              encontrada.estado === "RECHAZADO")
          ) {
            clearInterval(interval);
          }
        }

        if (intentos >= maxIntentos) {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, solicitudId, status]);

  const handlePagar = async (solicitud) => {
    try {
      const response = await api.post(
        "/payments/create",
        { solicitudId: solicitud.id },
        {
          headers: {
            Authorization: `Bearer ${tokenPublico}`,
          },
        }
      );

      const redirectUrl = response.data?.redirectUrl;

      if (!redirectUrl) {
        alert("No se recibió la URL de redirección al pago");
        return;
      }

      window.location.href = redirectUrl;
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "No se pudo iniciar el pago"
      );
    }
  };

  const handleDescargar = async (solicitudId) => {
    try {
      const response = await api.get(
        `/public/solicitudes/${solicitudId}/certificado`,
        {
          headers: {
            Authorization: `Bearer ${tokenPublico}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificado-${solicitudId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("No se pudo descargar el certificado");
    }
  };

  const renderAccion = (solicitud) => {
    if (solicitud.estado === "PENDIENTE") {
      return (
        <button
          className="btn-small btn-pay"
          onClick={() => handlePagar(solicitud)}
        >
          Pagar
        </button>
      );
    }

    if (solicitud.estado === "PAGADO") {
      return <span className="texto-muted">En revisión</span>;
    }

    if (solicitud.estado === "PUBLICADO") {
      return (
        <button
          className="btn-small btn-download"
          onClick={() => handleDescargar(solicitud.id)}
        >
          Descargar
        </button>
      );
    }

    if (solicitud.estado === "RECHAZADO") {
  return (
    <span className="texto-muted">
      {solicitud.observaciones || "Pago rechazado"}
    </span>
  );
}

    return <span className="texto-muted">Sin acciones</span>;
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
          <h1>Mis solicitudes</h1>
          <p className="subtitle">
            Consultá el estado de tus certificados solicitados.
          </p>
        </div>

        {mensaje && <p className="message success">{mensaje}</p>}
        {loading && <p>Cargando solicitudes...</p>}
        {error && <p className="message error">{error}</p>}

        {!loading && !error && solicitudes.length === 0 && (
          <p>No tenés solicitudes registradas.</p>
        )}

        {!loading && !error && solicitudes.length > 0 && (
          <table className="tabla-solicitudes">
            <thead>
              <tr>
                <th>N° Trámite</th>
                <th>Estado</th>
                <th>Distrito</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.id}>
                  <td>{s.nro_tramite}</td>
                  <td>
                    <span className={`estado estado-${s.estado?.toLowerCase()}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td>{s.distrito}</td>
                  <td>
                    {s.created_at
                      ? new Date(s.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{renderAccion(s)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MisSolicitudes;