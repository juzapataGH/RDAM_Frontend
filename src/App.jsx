import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SolicitarCodigo from "./pages/SolicitarCodigo";
import VerificarCodigo from "./pages/VerificarCodigo";
import CrearSolicitud from "./pages/CrearSolicitud";
import MisSolicitudes from "./pages/MisSolicitudes";
import VerificarCertificado from "./pages/VerificarCertificado";
import PortalCiudadano from "./pages/PortalCiudadano";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* redirección automática */}
        <Route path="/" element={<Navigate to="/solicitar-certificado" replace />} />

        <Route path="/solicitar-certificado" element={<SolicitarCodigo />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/portal" element={<PortalCiudadano />} />
        <Route path="/crear-solicitud" element={<CrearSolicitud />} />
        <Route path="/mis-certificados" element={<MisSolicitudes />} />
        <Route path="/verificar-certificado" element={<VerificarCertificado />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/solicitar-certificado" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;