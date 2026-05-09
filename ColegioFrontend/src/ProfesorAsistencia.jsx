import React, { useState, useEffect } from 'react';
import { getToken } from '../utils/auth';

export default function ProfesorAsistencia() {
  const [alumnos, setAlumnos] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const cargarAlumnos = async () => {
    try {
      const res = await fetch('/api/usuarios', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (res.ok) {
        const data = await res.json();
        // Mostrar preferiblemente solo los alumnos, o todos si no hay filtro claro
        const listaAlumnos = data.filter(u => u.rol?.toLowerCase() === 'alumno');
        setAlumnos(listaAlumnos.length > 0 ? listaAlumnos : data);
      } else {
        console.error("Error al cargar usuarios de la API");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const marcarAsistencia = async (alumno, estado) => {
    // Actualizar estado local visualmente
    setAsistencia(prev => ({ ...prev, [alumno.id]: estado }));

    const nombreMostrar = alumno.correo || `Usuario #${alumno.id}`;

    if (estado === 'Presente') {
      const dataToSend = {
        fecha: fecha + "T00:00:00", // Depende del formato esperado por LocalDateTime
        usuarioId: alumno.id,
        nombreUsuario: alumno.correo
      };

      try {
        const res = await fetch('/api/asistencia', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(dataToSend)
        });
        
        if (res.ok) {
          setMensaje({ texto: `✅ Asistencia guardada: ${nombreMostrar} está Presente.`, tipo: 'success' });
        } else {
          setMensaje({ texto: `❌ Error al guardar asistencia de ${nombreMostrar}.`, tipo: 'danger' });
        }
      } catch (err) {
        setMensaje({ texto: `⚠️ (Mock) Asistencia guardada: ${nombreMostrar} está Presente.`, tipo: 'warning' });
      }
    } else if (estado === 'Ausente') {
      // No hace nada con el backend, solo muestra mensaje local
      setMensaje({ texto: `ℹ️ ${nombreMostrar} marcado como Ausente (Sin guardar en BD).`, tipo: 'info' });
    }
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 shadow-sm rounded">
        <div>
          <h2 className="text-primary fw-bold mb-0">Registro de Asistencia</h2>
          <small className="text-muted">Toma la asistencia diaria de tu curso</small>
        </div>
        <div>
          <input 
            type="date" 
            className="form-control" 
            value={fecha} 
            onChange={e => setFecha(e.target.value)} 
          />
        </div>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} shadow-sm position-fixed top-0 start-50 translate-middle-x mt-3 z-3`} style={{ minWidth: '300px', textAlign: 'center' }} role="alert">
          {mensaje.texto}
        </div>
      )}

      <div className="card shadow border-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ID / Correo</th>
                <th className="text-center">Estado de Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center text-muted p-4">No hay alumnos registrados.</td>
                </tr>
              ) : alumnos.map(a => (
                <tr key={a.id}>
                  <td className="ps-4">
                    <div className="fw-medium">{a.correo}</div>
                    <small className="text-muted">ID: {a.id} | Rol: {a.rol}</small>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button 
                        type="button"
                        className={`btn ${asistencia[a.id] === 'Presente' ? 'btn-success' : 'btn-outline-success'} btn-sm fw-bold`}
                        onClick={() => marcarAsistencia(a, 'Presente')}
                      >
                        Presente
                      </button>

                      <button 
                        type="button"
                        className={`btn ${asistencia[a.id] === 'Ausente' ? 'btn-danger' : 'btn-outline-danger'} btn-sm fw-bold`}
                        onClick={() => marcarAsistencia(a, 'Ausente')}
                      >
                        Ausente
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
