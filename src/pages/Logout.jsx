import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const nav = useNavigate();

  useEffect(() => {
    localStorage.removeItem("auth"); // cierra sesión
    nav("/"); // 👈 redirige a Inicio.jsx
  }, [nav]);

  return (
    <div className="logout-container">
      <h2>Cerrando sesión...</h2>
    </div>
  );
}
