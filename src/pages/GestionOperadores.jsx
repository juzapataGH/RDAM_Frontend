import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function GestionOperadores() {
  const navigate = useNavigate();
  const tokenInterno = localStorage.getItem("tokenInterno");

  const [operadores, setOperadores] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    distritoId: 1,
  });
  const [editingId, setEditingId] = useState(null);

  const cargarOperadores = async () => {
    const response = await api.get("/internal/admin/operadores", {
      headers: {
        Authorization: `Bearer ${tokenInterno}`,
      },
    });

    setOperadores(response.data?.items || []);
  };

  useEffect(() => {
    cargarOperadores();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tokenInterno");
    localStorage.removeItem("userInterno");
    navigate("/solicitar-certificado");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "distritoId" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      distritoId: 1,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/internal/admin/operadores/${editingId}`,
          {
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            distritoId: formData.distritoId,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenInterno}`,
            },
          }
        );
      } else {
        await api.post("/internal/admin/operadores", formData, {
          headers: {
            Authorization: `Bearer ${tokenInterno}`,
          },
        });
      }

      resetForm();
      await cargarOperadores();
    } catch (error) {
      alert(error.response?.data?.message || "Error al guardar operador");
    }
  };

  const handleEditar = (op) => {
    setEditingId(op.id);
    setFormData({
      nombre: op.nombre,
      apellido: op.apellido,
      email: op.email,
      password: "",
      distritoId: op.distrito_id,
    });
  };

  const handleEliminar = async (id) => {
    const confirmado = window.confirm("¿Eliminar operador?");
    if (!confirmado) return;

    try {
      await api.delete(`/internal/admin/operadores/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenInterno}`,
        },
      });

      await cargarOperadores();
    } catch (error) {
      alert(error.response?.data?.message || "Error al eliminar operador");
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
          <h1>Gestionar operadores</h1>
          <p className="subtitle">
            Alta, edición y baja lógica de operadores.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="filters-panel">
          <div className="filters-grid-better">
            <div className="form-group">
              <label>Nombre</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <input name="apellido" value={formData.apellido} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Distrito</label>
              <select name="distritoId" value={formData.distritoId} onChange={handleChange}>
                <option value={1}>Santa Fe</option>
                <option value={2}>Rosario</option>
                <option value={3}>Reconquista</option>
              </select>
            </div>

            {!editingId && (
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>

          <div className="filters-actions">
            <button type="submit" className="btn-primary">
              {editingId ? "Guardar cambios" : "Crear operador"}
            </button>

            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
          </div>
        </form>

        <div className="tabla-wrapper">
          <table className="tabla-solicitudes">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Distrito</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {operadores.map((op) => (
                <tr key={op.id}>
                  <td>{op.nombre} {op.apellido}</td>
                  <td>{op.email}</td>
                  <td>{op.distrito}</td>
                  <td>{op.activo ? "Sí" : "No"}</td>
                  <td>
                    <button
                      className="btn-small btn-pay"
                      onClick={() => handleEditar(op)}
                    >
                      Editar
                    </button>{" "}
                    <button
                      className="btn-small btn-danger-soft"
                      onClick={() => handleEliminar(op.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GestionOperadores;