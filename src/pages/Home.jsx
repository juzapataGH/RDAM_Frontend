import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Registro Digital de Antecedentes</h1>
      <p>
        Accedé a los trámites y consultas del sistema de forma simple y segura.
      </p>

      <div style={{ display: "grid", gap: "1rem", marginTop: "2rem", maxWidth: "700px" }}>
        <Link to="/solicitar-certificado">
          <button style={{ width: "100%", padding: "1rem" }}>
            Solicitá un certificado
          </button>
        </Link>

        <Link to="/verificar-certificado">
          <button style={{ width: "100%", padding: "1rem" }}>
            Verificá un certificado
          </button>
        </Link>

        <Link to="/mis-certificados">
          <button style={{ width: "100%", padding: "1rem" }}>
            Mis Certificados
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;