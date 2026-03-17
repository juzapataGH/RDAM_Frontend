import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SolicitarCodigo from "./pages/SolicitarCodigo";
import VerificarCodigo from "./pages/VerificarCodigo";
import CrearSolicitud from "./pages/CrearSolicitud";
import MisSolicitudes from "./pages/MisSolicitudes";
import VerificarCertificado from "./pages/VerificarCertificado";
import PortalCiudadano from "./pages/PortalCiudadano";
import PortalInterno from "./pages/PortalInterno";
import AdminSolicitudes from "./pages/AdminSolicitudes";
import GestionOperadores from "./pages/GestionOperadores";
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
        <Route path="/portal-interno" element={<PortalInterno />} />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/solicitar-certificado" replace />} />
        <Route path="/admin/solicitudes" element={<AdminSolicitudes />} />
        <Route path="/admin/operadores" element={<GestionOperadores />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;