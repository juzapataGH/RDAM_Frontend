import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Registro Digital de Antecedentes</h1>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link to="/solicitar-codigo">
          <button>Solicitar código</button>
        </Link>

        <Link to="/verificar-codigo">
          <button>Verificar código</button>
        </Link>

        <Link to="/crear">
          <button>Crear solicitud</button>
        </Link>

        <Link to="/mis-solicitudes">
          <button>Ver mis solicitudes</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;