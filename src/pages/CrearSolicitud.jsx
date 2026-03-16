import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function CrearSolicitud() {
  const { tokenPublico } = useAuth();

  const [formData, setFormData] = useState({
    cuil: "",
    nombre: "",
    apellido: "",
    distritoId: 1,
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "distritoId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const response = await api.post("/public/solicitudes", formData, {
        headers: {
          Authorization: `Bearer ${tokenPublico}`,
        },
      });

      setMensaje("Solicitud creada correctamente");
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error al crear la solicitud"
      );
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Crear solicitud</h2>

      {!tokenPublico && (
        <p style={{ color: "orange" }}>
          Primero tenés que solicitar y verificar el código para obtener el token público.
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>CUIL</label>
          <input
            type="text"
            name="cuil"
            value={formData.cuil}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Distrito ID</label>
          <input
            type="number"
            name="distritoId"
            value={formData.distritoId}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", padding: "0.75rem" }}
          />
        </div>

        <button type="submit" disabled={!tokenPublico}>
          Crear solicitud
        </button>
      </form>

      {mensaje && <p style={{ color: "green", marginTop: "1rem" }}>{mensaje}</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}

export default CrearSolicitud;