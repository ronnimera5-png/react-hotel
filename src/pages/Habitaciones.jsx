/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/main.css";
import "../styles/habitacion.css";

export default function Habitaciones() {
  const [formData, setFormData] = useState({
    numero: "",
    tipo: "individual",
    precio: "",
    estado: "Disponible"
  });

  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Filtros
  const [filterTipo, setFilterTipo] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterPrecio, setFilterPrecio] = useState("");

  // Cargar habitaciones desde LocalStorage
  useEffect(() => {
    const cargarHabitaciones = () => {
      setLoading(true);
      
      try {
        // 1. Intentar cargar desde LocalStorage
        const datosLocal = localStorage.getItem("habitaciones");
        
        if (datosLocal) {
          const habitacionesLocal = JSON.parse(datosLocal);
          setHabitaciones(habitacionesLocal);
          setLoading(false);
          return;
        }
        
        // 2. Si NO hay en LocalStorage, usar datos iniciales
        const datosIniciales = [
          { id: 1, numero: "101", tipo: "individual", precio: 50, estado: "Disponible" },
          { id: 2, numero: "102", tipo: "individual", precio: 50, estado: "Disponible" },
          { id: 3, numero: "201", tipo: "doble", precio: 80, estado: "Disponible" },
          { id: 4, numero: "202", tipo: "doble", precio: 80, estado: "Disponible" },
          { id: 5, numero: "301", tipo: "suite", precio: 150, estado: "Disponible" },
          { id: 6, numero: "302", tipo: "suite", precio: 150, estado: "Disponible" }
        ];
        
        setHabitaciones(datosIniciales);
        localStorage.setItem("habitaciones", JSON.stringify(datosIniciales));
        
      } catch (error) {
        console.error("Error cargando habitaciones:", error);
        
        const datosEmergencia = [
          { id: Date.now(), numero: "999", tipo: "individual", precio: 100, estado: "Disponible" }
        ];
        
        setHabitaciones(datosEmergencia);
        localStorage.setItem("habitaciones", JSON.stringify(datosEmergencia));
        
      } finally {
        setLoading(false);
      }
    };
    
    cargarHabitaciones();
  }, []);

  // Función para guardar habitaciones
  const guardarHabitaciones = (nuevasHabitaciones) => {
    localStorage.setItem("habitaciones", JSON.stringify(nuevasHabitaciones));
    setHabitaciones(nuevasHabitaciones);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validaciones
  const validarNumeroHabitacion = () => {
    const numero = formData.numero.trim();
    if (!/^\d+$/.test(numero)) {
      window.alert("El número debe ser solo números");
      return false;
    }
    
    // Verificar si el número ya existe
    const numeroExistente = habitaciones.find(h => h.numero === numero);
    if (numeroExistente) {
      window.alert("Ya existe una habitación con este número");
      return false;
    }
    
    return true;
  };

  const validarPrecioHabitacion = () => {
    const precio = parseFloat(formData.precio);
    if (!formData.precio || precio <= 0) {
      window.alert("El precio debe ser mayor a 0");
      return false;
    }
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarNumeroHabitacion() || !validarPrecioHabitacion()) {
      return;
    }

    const nuevaHabitacion = {
      id: Date.now(),
      numero: formData.numero,
      tipo: formData.tipo,
      precio: parseFloat(formData.precio),
      estado: formData.estado
    };
    
    const nuevasHabitaciones = [...habitaciones, nuevaHabitacion];
    guardarHabitaciones(nuevasHabitaciones);
    
    window.alert("Habitación registrada correctamente.");
    
    // Limpiar formulario
    setFormData({
      numero: "",
      tipo: "individual",
      precio: "",
      estado: "Disponible"
    });
  };

  // Funciones CRUD
  const editHabitacion = (id) => {
    const habitacion = habitaciones.find(h => h.id === id);
    if (!habitacion) return;

    const nuevoNumero = window.prompt("Número:", habitacion.numero) || habitacion.numero;
    const nuevoTipo = window.prompt("Tipo (individual/doble/suite):", habitacion.tipo) || habitacion.tipo;
    const nuevoPrecio = window.prompt("Precio:", habitacion.precio) || habitacion.precio;
    const nuevoEstado = window.prompt("Estado (Disponible/Ocupada/En Mantenimiento):", habitacion.estado) || habitacion.estado;

    const nuevasHabitaciones = habitaciones.map(h => 
      h.id === id ? {
        ...h,
        numero: nuevoNumero,
        tipo: nuevoTipo,
        precio: parseFloat(nuevoPrecio),
        estado: nuevoEstado
      } : h
    );

    guardarHabitaciones(nuevasHabitaciones);
  };

  const deleteHabitacion = (id) => {
    if (window.confirm("¿Deseas eliminar esta habitación?")) {
      const nuevasHabitaciones = habitaciones.filter(h => h.id !== id);
      guardarHabitaciones(nuevasHabitaciones);
    }
  };

  const changeStatus = (id) => {
    const habitacion = habitaciones.find(h => h.id === id);
    if (!habitacion) return;

    const estados = ["Disponible", "Ocupada", "En Mantenimiento"];
    const estadoActual = habitacion.estado;
    const indiceActual = estados.indexOf(estadoActual);
    const siguienteEstado = estados[(indiceActual + 1) % estados.length];

    const nuevasHabitaciones = habitaciones.map(h => 
      h.id === id ? { ...h, estado: siguienteEstado } : h
    );

    guardarHabitaciones(nuevasHabitaciones);
  };

  // Aplicar filtros
  const applyHabitacionFilter = () => {
    // Los filtros se aplican automáticamente
  };

  // Filtrar habitaciones
  const habitacionesFiltradas = habitaciones.filter(habitacion => {
    // Filtrar por tipo
    if (filterTipo && habitacion.tipo.toLowerCase() !== filterTipo.toLowerCase()) {
      return false;
    }
    
    // Filtrar por estado
    if (filterEstado && habitacion.estado.toLowerCase() !== filterEstado.toLowerCase()) {
      return false;
    }
    
    // Filtrar por precio máximo
    if (filterPrecio && parseFloat(habitacion.precio) > parseFloat(filterPrecio)) {
      return false;
    }
    
    return true;
  });

  // Mostrar estado de carga
  if (loading) {
    return (
      <>
        <nav className="sidebar">
          <h2>Hotel ULEAM</h2>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/reservas">Reservas</Link></li>
            <li><Link to="/clientes">Clientes</Link></li>
            <li><Link to="/habitaciones" className="active">Habitaciones</Link></li>
            <li><Link to="/logout">Cerrar sesión</Link></li>
          </ul>
        </nav>
        <main className="content">
          <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>Cargando habitaciones...</h2>
            <p>Por favor espera...</p>
          </div>
        </main>
      </>
    );
  }

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
            <Link to="/logout">
              Cerrar sesión
            </Link>
          </li>
        </ul>
      </nav>

      <main className="content">
        <section id="habitaciones">
          <h2>Gestión de Habitaciones</h2>

          <form id="habitacion-form" onSubmit={handleSubmit} noValidate> 
            <h3>Agregar o Modificar Habitación</h3>

            <label htmlFor="numero-habitacion">Número de Habitación:</label>
            <input 
              type="text" 
              id="numero-habitacion" 
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              placeholder="Número de habitación" 
              required 
            />

            <label htmlFor="tipo-habitacion">Tipo de Habitación:</label>
            <select 
              id="tipo-habitacion" 
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              required
            >
              <option value="individual">Individual</option>
              <option value="doble">Doble</option>
              <option value="suite">Suite</option>
            </select>

            <label htmlFor="precio-habitacion">Precio:</label>
            <input 
              type="number" 
              id="precio-habitacion" 
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              placeholder="Precio" 
              required 
            />

            <label htmlFor="estado-habitacion">Estado:</label>
            <select 
              id="estado-habitacion" 
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              required
            >
              <option value="Disponible">Disponible</option>
              <option value="Ocupada">Ocupada</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
            </select>

            <button type="submit" className="btn">Guardar Habitación</button>
          </form>

          <div className="filters">
            <h3>Filtrar Habitaciones</h3>
            <select 
              id="filter-tipo-habitacion"
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
            >
              <option value="">Filtrar por Tipo</option>
              <option value="individual">Individual</option>
              <option value="doble">Doble</option>
              <option value="suite">Suite</option>
            </select>

            <select 
              id="filter-estado-habitacion"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="">Filtrar por Estado</option>
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="en mantenimiento">En Mantenimiento</option>
            </select>

            <input 
              type="number" 
              id="filter-precio-habitacion" 
              placeholder="Precio máximo"
              value={filterPrecio}
              onChange={(e) => setFilterPrecio(e.target.value)}
            />
            <button onClick={applyHabitacionFilter} className="btn">
              Aplicar Filtros
            </button>
          </div>

          <div id="lista-habitaciones">
            <h3>Habitaciones Registradas ({habitacionesFiltradas.length})</h3>
            
            {habitacionesFiltradas.length === 0 ? (
              <p className="no-data">
                {filterTipo || filterEstado || filterPrecio 
                  ? "No hay habitaciones con esos filtros" 
                  : "No hay habitaciones registradas"}
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Tipo</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody id="habitaciones-body">
                  {habitacionesFiltradas.map(habitacion => (
                    <tr key={habitacion.id}>
                      <td>{habitacion.numero}</td>
                      <td>{habitacion.tipo}</td>
                      <td>${habitacion.precio}</td>
                      <td>{habitacion.estado}</td>
                      <td>
                        <button className="btn edit-btn" onClick={() => editHabitacion(habitacion.id)}>
                          Editar
                        </button>
                        <button className="btn delete-btn" onClick={() => deleteHabitacion(habitacion.id)}>
                          Eliminar
                        </button>
                        <button className="btn change-status-btn" onClick={() => changeStatus(habitacion.id)}>
                          Cambiar Estado
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </>
  );
}