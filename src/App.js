import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Inicio from "./pages/Inicio.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Clientes from "./pages/Clientes.jsx";
import Habitaciones from "./pages/Habitaciones.jsx";
import Reservas from "./pages/Reservas.jsx";

function AppLayout() {
  const location = useLocation();

  // Sidebar solo en "internas"
  const showSidebar = ["/dashboard", "/clientes", "/habitaciones", "/reservas", "/logout"].includes(
    location.pathname
  );

  return (
    <>
      {showSidebar && <Sidebar />}

      {/* En tu HTML original la clase era content, la usamos igual */}
      <main className={showSidebar ? "content" : ""}>
        <Routes>
          {/* Público */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />

          {/* Interno */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/habitaciones" element={<Habitaciones />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
