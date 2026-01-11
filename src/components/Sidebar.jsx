import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <h2>Hotel ULEAM</h2>
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/reservas" className={({ isActive }) => (isActive ? "active" : "")}>
            Reservas
          </NavLink>
        </li>
        <li>
          <NavLink to="/clientes" className={({ isActive }) => (isActive ? "active" : "")}>
            Clientes
          </NavLink>
        </li>
        <li>
          <NavLink to="/habitaciones" className={({ isActive }) => (isActive ? "active" : "")}>
            Habitaciones
          </NavLink>
        </li>
        <li>
          <NavLink to="/logout" className={({ isActive }) => (isActive ? "active" : "")}>
            Cerrar sesión
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
