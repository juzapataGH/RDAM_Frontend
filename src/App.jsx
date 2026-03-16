import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CrearSolicitud from "./pages/CrearSolicitud";
import MisSolicitudes from "./pages/MisSolicitudes";
import SolicitarCodigo from "./pages/SolicitarCodigo";
import VerificarCodigo from "./pages/VerificarCodigo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitar-codigo" element={<SolicitarCodigo />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/crear" element={<CrearSolicitud />} />
        <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;