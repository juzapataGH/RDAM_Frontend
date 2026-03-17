import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function AdminSolicitudes() {
  const navigate = useNavigate();
  const tokenInterno = localStorage.getItem("tokenInterno");

  const [solicitudes, setSolicitudes] = useState([]);
  const [estado, setEstado] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("tokenInterno");
    navigate("/solicitar-certificado");
  };

  const construirQuery = () => {
    const params = new URLSearchParams();

    if (estado) params.append("estado", estado);
    if (fechaDesde) params.append("fechaDesde", fechaDesde);
    if (fechaHasta) params.append("fechaHasta", fechaHasta);
    if (busqueda.trim()) params.append("q", busqueda.trim());

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);

      const query = construirQuery();

      const response = await api.get(`/internal/solicitudes${query}`, {
        headers: {
          Authorization: `Bearer ${tokenInterno}`,
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

  const handleBuscar = async (e) => {
    e.preventDefault();
    await cargarSolicitudes();
  };

  const handlePublicar = async (solicitudId) => {
    try {
      await api.put(
        `/internal/solicitudes/${solicitudId}/publicar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenInterno}`,
          },
        }
      );

      await cargarSolicitudes();
      alert("Solicitud publicada correctamente");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "No se pudo publicar la solicitud"
      );
    }
  };

  const limpiarFiltros = async () => {
    setEstado("");
    setFechaDesde("");
    setFechaHasta("");
    setBusqueda("");

    try {
      setLoading(true);

      const response = await api.get(`/internal/solicitudes`, {
        headers: {
          Authorization: `Bearer ${tokenInterno}`,
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

  return (
    <div className="page page-auth">
      <div className="page-header">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/portal-interno")}
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

      <div className="auth-card auth-card-wide auth-card-xl">
        <div className="auth-header">
          <p className="eyebrow">Ministerio de Justicia</p>
          <h1>Solicitudes internas</h1>
          <p className="subtitle">
            Consultá y gestioná las solicitudes del sistema.
          </p>
        </div>

        <form onSubmit={handleBuscar} className="filters-panel">
          <div className="filters-grid-better">
            <div className="form-group search-span">
              <label htmlFor="busqueda">Buscar</label>
              <input
                id="busqueda"
                type="text"
                placeholder="N° trámite, CUIL, nombre, apellido o email"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="PAGADO">PAGADO</option>
                <option value="PUBLICADO">PUBLICADO</option>
                <option value="RECHAZADO">RECHAZADO</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fechaDesde">Fecha desde</label>
              <input
                id="fechaDesde"
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaHasta">Fecha hasta</label>
              <input
                id="fechaHasta"
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>
          </div>

          <div className="filters-actions">
            <button type="submit" className="btn-primary btn-fixed">
              Buscar
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>
        </form>

        {loading && <p>Cargando solicitudes...</p>}
        {error && <p className="message error">{error}</p>}

        {!loading && !error && solicitudes.length === 0 && (
          <p>No hay solicitudes para mostrar.</p>
        )}

        {!loading && !error && solicitudes.length > 0 && (
          <div className="tabla-wrapper">
            <table className="tabla-solicitudes">
              <thead>
                <tr>
                  <th>N° Trámite</th>
                  <th>Solicitante</th>
                  <th>CUIL</th>
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
                    <td>{s.nombre} {s.apellido}</td>
                    <td>{s.cuil}</td>
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
                    <td>
                      {s.estado === "PAGADO" ? (
                        <button
                          className="btn-small btn-download"
                          onClick={() => handlePublicar(s.id)}
                        >
                          Publicar
                        </button>
                      ) : (
                        <span className="texto-muted">Sin acciones</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSolicitudes;