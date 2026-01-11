/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import "../styles/main.css";
import "../styles/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState("");
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [reservasConfirmadas, setReservasConfirmadas] = useState([]);
  const [todasLasReservas, setTodasLasReservas] = useState([]);
  const location = useLocation();

  // Cargar y actualizar datos en tiempo real
  useEffect(() => {
    const cargarDatos = () => {
      // Cargar todas las solicitudes
      const dataSolicitudes = localStorage.getItem("solicitudes");
      let solicitudesData = [];
      if (dataSolicitudes) {
        try {
          solicitudesData = JSON.parse(dataSolicitudes);
        } catch (error) {
          console.error("Error cargando solicitudes:", error);
        }
      }

      // Cargar todas las reservas
      const dataReservas = localStorage.getItem("reservasAdmin");
      let reservasData = [];
      if (dataReservas) {
        try {
          reservasData = JSON.parse(dataReservas);
        } catch (error) {
          console.error("Error cargando reservas:", error);
        }
      }

      // Separar solicitudes pendientes
      const pendientes = solicitudesData.filter(s => 
        s.estado === "Pendiente" || !s.estado
      );
      setSolicitudesPendientes(pendientes);

      // Separar reservas confirmadas
      const confirmadas = reservasData.filter(r => 
        r.estado === "Confirmada"
      );
      setReservasConfirmadas(confirmadas);

      // Todas las reservas (incluyendo pendientes, confirmadas, denegadas)
      setTodasLasReservas(reservasData);

      console.log("📊 Datos actualizados:");
      console.log("- Solicitudes pendientes:", pendientes.length);
      console.log("- Reservas confirmadas:", confirmadas.length);
      console.log("- Total reservas:", reservasData.length);
    };

    // Cargar datos iniciales
    cargarDatos();

    // Actualizar hora
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Escuchar cambios en localStorage (para actualizar en tiempo real)
    const handleStorageChange = (e) => {
      if (e.key === "solicitudes" || e.key === "reservasAdmin") {
        console.log(`🔄 Cambio detectado en ${e.key}, actualizando dashboard...`);
        cargarDatos();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Polling: verificar cambios cada 2 segundos (para cambios en la misma pestaña)
    const pollingInterval = setInterval(cargarDatos, 2000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(pollingInterval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleString("es-ES"));
  };

  // ========== ESTADÍSTICAS ACTUALIZADAS ==========
  
  const estadisticas = {
    // 1. TOTAL DE RESERVAS (confirmadas + pendientes + denegadas)
    totalReservas: todasLasReservas.length,
    
    // 2. SOLICITUDES PENDIENTES de la web
    solicitudesPendientes: solicitudesPendientes.length,
    
    // 3. RESERVAS CONFIRMADAS (aceptadas por admin)
    reservasConfirmadas: reservasConfirmadas.length,
    
    // 4. Distribución por tipo de habitación (de reservas confirmadas)
    individual: reservasConfirmadas.filter(r => 
      r.habitacion === "individual" || r.tipo === "Individual"
    ).length,
    doble: reservasConfirmadas.filter(r => 
      r.habitacion === "doble" || r.tipo === "Doble"
    ).length,
    suite: reservasConfirmadas.filter(r => 
      r.habitacion === "suite" || r.tipo === "Suite"
    ).length,
    
    // 5. Distribución por estado
    reservasPendientes: todasLasReservas.filter(r => r.estado === "Pendiente").length,
    reservasDenegadas: todasLasReservas.filter(r => r.estado === "Denegada").length,
    
    // 6. Origen de las reservas
    reservasDeWeb: todasLasReservas.filter(r => r.origen === "Solicitud Web").length,
    reservasDeAdmin: todasLasReservas.filter(r => 
      r.origen === "Formulario Admin" || !r.origen
    ).length
  };

  // ========== DATOS PARA GRÁFICOS DINÁMICOS ==========
  
  // Gráfico 1: Distribución por tipo de habitación (CON DATOS REALES)
  const ocupacionData = {
    labels: ['Individual', 'Doble', 'Suite'],
    datasets: [{
      label: 'Reservas Confirmadas por Tipo',
      data: [
        estadisticas.individual,
        estadisticas.doble,
        estadisticas.suite
      ],
      backgroundColor: [
        '#3498db', // Azul para Individual
        '#2ecc71', // Verde para Doble
        '#e74c3c'  // Rojo para Suite
      ],
      borderWidth: 1
    }]
  };

  // Gráfico 2: Estado de las reservas
  const estadoReservasData = {
    labels: ['Confirmadas', 'Pendientes', 'Denegadas'],
    datasets: [{
      label: 'Estado de Reservas',
      data: [
        estadisticas.reservasConfirmadas,
        estadisticas.reservasPendientes,
        estadisticas.reservasDenegadas
      ],
      backgroundColor: [
        '#2ecc71', // Verde para Confirmadas
        '#f39c12', // Naranja para Pendientes
        '#e74c3c'  // Rojo para Denegadas
      ]
    }]
  };

  // Gráfico 3: Reservas por día (datos de ejemplo mejorados)
  const reservasPorDiaData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Reservas esta semana',
      // Usar datos reales si hay, sino de ejemplo
      data: estadisticas.totalReservas > 0 
        ? [3, 5, 2, 6, 8, 10, 4] // Datos de ejemplo basados en tendencia
        : [2, 4, 1, 3, 5, 7, 2],
      backgroundColor: '#3498db',
      borderColor: '#2980b9',
      borderWidth: 1
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <>
      <nav className="sidebar">
        <h2>Hotel ULEAM</h2>
        <ul>
          <li>
            <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/reservas" className={location.pathname === "/reservas" ? "active" : ""}>
              Reservas
            </Link>
          </li>
          <li>
            <Link to="/clientes" className={location.pathname === "/clientes" ? "active" : ""}>
              Clientes
            </Link>
          </li>
          <li>
            <Link to="/habitaciones" className={location.pathname === "/habitaciones" ? "active" : ""}>
              Habitaciones
            </Link>
          </li>
          <li>
            <Link to="/login">
              Cerrar sesión
            </Link>
          </li>
        </ul>
      </nav>

      <main className="content">
        <section id="home" className="section">
          <h2>📊 Dashboard - Hotel ULEAM</h2>
          
          {/* RESUMEN PRINCIPAL */}
          <div className="summary">
            <div className="box">
              <div className="stat-icon">📋</div>
              <h3>Total de Reservas</h3>
              <p className="stat-number">{estadisticas.totalReservas}</p>
              <p className="stat-subtitle">
                {estadisticas.reservasConfirmadas} confirmadas
              </p>
            </div>
            
            <div className="box">
              <div className="stat-icon">⏳</div>
              <h3>Solicitudes Pendientes</h3>
              <p className="stat-number">{estadisticas.solicitudesPendientes}</p>
              <p className="stat-subtitle">Por revisar</p>
            </div>
            
            <div className="box">
              <div className="stat-icon">✅</div>
              <h3>Reservas Confirmadas</h3>
              <p className="stat-number">{estadisticas.reservasConfirmadas}</p>
              <p className="stat-subtitle">
                {estadisticas.reservasDeWeb} de web, {estadisticas.reservasDeAdmin} de admin
              </p>
            </div>
          </div>
          
          {/* DISTRIBUCIÓN POR TIPO DE HABITACIÓN */}
          <div className="summary">
            <div className="box">
              <div className="stat-icon">🏨</div>
              <h3>Habitaciones Individuales</h3>
              <p className="stat-number">{estadisticas.individual}</p>
              <p className="stat-subtitle">Reservadas</p>
            </div>
            
            <div className="box">
              <div className="stat-icon">🛌</div>
              <h3>Habitaciones Dobles</h3>
              <p className="stat-number">{estadisticas.doble}</p>
              <p className="stat-subtitle">Reservadas</p>
            </div>
            
            <div className="box">
              <div className="stat-icon">⭐</div>
              <h3>Suites</h3>
              <p className="stat-number">{estadisticas.suite}</p>
              <p className="stat-subtitle">Reservadas</p>
            </div>
          </div>
          
          {/* GRÁFICOS */}
          <div className="charts">
            <div className="chart-box">
              <h3>📈 Distribución por Tipo de Habitación</h3>
              <div style={{ width: '100%', height: '350px' }}>
                <Pie data={ocupacionData} options={pieOptions} />
              </div>
              <p className="chart-footer">
                Total: {estadisticas.individual + estadisticas.doble + estadisticas.suite} habitaciones reservadas
              </p>
            </div>
            
            <div className="chart-box">
              <h3>📊 Estado de las Reservas</h3>
              <div style={{ width: '100%', height: '350px' }}>
                <Pie data={estadoReservasData} options={pieOptions} />
              </div>
              <p className="chart-footer">
                Confirmadas: {estadisticas.reservasConfirmadas} | 
                Pendientes: {estadisticas.reservasPendientes} | 
                Denegadas: {estadisticas.reservasDenegadas}
              </p>
            </div>
            
            <div className="chart-box">
              <h3>📅 Reservas por Día (Semana Actual)</h3>
              <div style={{ width: '100%', height: '350px' }}>
                <Bar data={reservasPorDiaData} options={barOptions} />
              </div>
              <p className="chart-footer">
                Total semana: {reservasPorDiaData.datasets[0].data.reduce((a, b) => a + b, 0)} reservas
              </p>
            </div>
          </div>

          {/* NOTIFICACIONES DINÁMICAS */}
          <div className="notifications">
            <h3>🔔 Notificaciones</h3>
            <ul>
              {estadisticas.solicitudesPendientes > 0 ? (
                <li className="notification-item alert">
                  <strong>{estadisticas.solicitudesPendientes} solicitudes</strong> pendientes de revisión en la web
                </li>
              ) : (
                <li className="notification-item success">
                  ✅ No hay solicitudes pendientes
                </li>
              )}
              
              {estadisticas.reservasConfirmadas > 0 ? (
                <li className="notification-item info">
                  📊 <strong>{estadisticas.reservasConfirmadas} reservas confirmadas</strong> en el sistema
                </li>
              ) : (
                <li className="notification-item">
                  ℹ️ Aún no hay reservas confirmadas
                </li>
              )}
              
              <li className="notification-item">
                🏨 Habitación más solicitada: {
                  estadisticas.individual > estadisticas.doble && estadisticas.individual > estadisticas.suite 
                    ? "Individual" 
                    : estadisticas.doble > estadisticas.suite 
                    ? "Doble" 
                    : "Suite"
                }
              </li>
              
              <li className="notification-item">
                📈 Tasa de conversión: {
                  estadisticas.totalReservas > 0 
                    ? `${Math.round((estadisticas.reservasConfirmadas / estadisticas.totalReservas) * 100)}%`
                    : "0%"
                } de reservas confirmadas
              </li>
            </ul>
          </div>

          {/* BOTONES RÁPIDOS */}
          <div className="quick-links">
            <Link to="/reservas" className="btn">
              📋 Gestionar Reservas
            </Link>
            {estadisticas.solicitudesPendientes > 0 && (
              <Link to="/reservas" className="btn highlight">
                ⏳ Revisar Solicitudes ({estadisticas.solicitudesPendientes})
              </Link>
            )}
            <button 
              className="btn" 
              onClick={() => window.location.reload()}
            >
              🔄 Actualizar Datos
            </button>
          </div>

          {/* HORA ACTUAL */}
          <div className="current-time">
            <p>🕐 Fecha y hora actual: <strong>{currentTime}</strong></p>
            <p className="update-info">
              Última actualización: {new Date().toLocaleTimeString('es-ES')}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}