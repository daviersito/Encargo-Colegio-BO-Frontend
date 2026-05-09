import React, { useState } from 'react';
import { getToken } from '../utils/auth';

export default function AdminMatriculas() {
  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    fechaNacimiento: '',
    curso: '',
    usuarioId: '',
    estado: 'Activo',
    apoderado: {
      rut: '',
      nombre: '',
      telefono: '',
      correo: ''
    }
  });

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('/api/usuarios', {
          headers: { 'Authorization': 'Bearer ' + getToken() }
        });
        if (res.ok) {
          const data = await res.json();
          const alumnos = data.filter(u => u.rol?.toLowerCase() === 'alumno' || !u.rol);
          setUsuarios(alumnos.length > 0 ? alumnos : data);
        }
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    };
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('apoderado.')) {
      const field = name.split('.')[1];
      setForm({
        ...form,
        apoderado: { ...form.apoderado, [field]: value }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    
    // Preparar el payload asegurando que usuarioId sea numérico si existe
    const payload = {
      ...form,
      usuarioId: form.usuarioId ? parseInt(form.usuarioId, 10) : null
    };

    try {
      const res = await fetch('/api/matricula/registrar-completo', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok || res.status === 201) {
        setMensaje({ texto: '¡Matrícula registrada exitosamente en el sistema!', tipo: 'success' });
        // Limpiar el formulario
        setForm({
          nombre: '', rut: '', fechaNacimiento: '', curso: '', usuarioId: '', estado: 'Activo',
          apoderado: { rut: '', nombre: '', telefono: '', correo: '' }
        });
      } else {
        setMensaje({ texto: `Error al crear la matrícula (Status: ${res.status}).`, tipo: 'danger' });
      }
    } catch (err) {
      setMensaje({ texto: 'Error de conexión con el servidor al registrar matrícula.', tipo: 'danger' });
      console.error('Error POST /api/matricula/registrar-completo:', err);
    }
  };

  return (
    <div className="container-fluid pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 shadow-sm rounded">
        <div>
          <h2 className="text-primary fw-bold mb-0">Gestión de Matrículas</h2>
          <small className="text-muted">Inscripción completa de Alumnos y Apoderados</small>
        </div>
      </div>

      <div className="card shadow border-0 p-4 mx-auto" style={{ maxWidth: '800px' }}>
        <h4 className="fw-bold mb-4 border-bottom pb-2">Formulario de Nueva Matrícula</h4>
        
        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo} py-2`} role="alert">
            {mensaje.texto}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* --- SECCIÓN ALUMNO --- */}
            <div className="col-md-6 mb-4">
              <h5 className="text-secondary fw-bold mb-3"><i className="bi bi-person-badge me-2"></i>Datos del Alumno</h5>
              
              <div className="mb-3">
                <label className="form-label small fw-bold">Nombre Completo</label>
                <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej: Juan Pérez" />
              </div>
              
              <div className="mb-3">
                <label className="form-label small fw-bold">RUT Alumno</label>
                <input type="text" className="form-control" name="rut" value={form.rut} onChange={handleChange} required placeholder="Ej: 12345678-9" />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Fecha de Nacimiento</label>
                <input type="date" className="form-control" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Curso Asignado (String)</label>
                <input type="text" className="form-control" name="curso" value={form.curso} onChange={handleChange} required placeholder="Ej: 1A, 2B, etc." />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Vincular a Cuenta de Usuario</label>
                <select className="form-select" name="usuarioId" value={form.usuarioId} onChange={handleChange} required>
                  <option value="">Seleccione cuenta de usuario...</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>ID: {u.id} - {u.email || u.correo}</option>
                  ))}
                </select>
                <div className="form-text">ID de la cuenta (usuarioId) asociada al alumno.</div>
              </div>
            </div>

            {/* --- SECCIÓN APODERADO --- */}
            <div className="col-md-6 mb-4">
              <h5 className="text-secondary fw-bold mb-3"><i className="bi bi-person-hearts me-2"></i>Datos del Apoderado</h5>
              
              <div className="mb-3">
                <label className="form-label small fw-bold">Nombre del Apoderado</label>
                <input type="text" className="form-control" name="apoderado.nombre" value={form.apoderado.nombre} onChange={handleChange} required placeholder="Ej: María González" />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">RUT Apoderado</label>
                <input type="text" className="form-control" name="apoderado.rut" value={form.apoderado.rut} onChange={handleChange} required placeholder="Ej: 98765432-1" />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Teléfono</label>
                <input type="tel" className="form-control" name="apoderado.telefono" value={form.apoderado.telefono} onChange={handleChange} required placeholder="Ej: 987654321" />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Correo Electrónico</label>
                <input type="email" className="form-control" name="apoderado.correo" value={form.apoderado.correo} onChange={handleChange} required placeholder="Ej: correo@ejemplo.com" />
              </div>
            </div>
          </div>

          <hr className="mb-4" />
          <button type="submit" className="btn btn-primary w-100 py-3 shadow-sm fw-bold fs-5">
            <i className="bi bi-save me-2"></i>Registrar Matrícula Completa
          </button>
        </form>
      </div>
    </div>
  );
}
