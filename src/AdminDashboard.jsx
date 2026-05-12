import { useEffect, useState } from 'react';
import { getUserRole, getToken } from '../utils/auth';

export default function AdminDashboard() {
  const role = getUserRole();
  const isAdmin = role?.toLowerCase() === 'admin';
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ correo: '', password: '', rol: 'Alumno' });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [errorUsuarios, setErrorUsuarios] = useState('');

  const cargarUsuarios = async () => {
    if (!isAdmin) return;

    setErrorUsuarios('');
    try {
      const res = await fetch('/api/usuarios', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status} al cargar usuarios`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setUsuarios(data);
      } else {
        setUsuarios([]);
        setErrorUsuarios('La respuesta del servidor no tiene el formato esperado.');
      }
    } catch (err) {
      setUsuarios([]);
      setErrorUsuarios('No se pudieron cargar los usuarios registrados.');
      console.error("Error al cargar usuarios:", err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [isAdmin]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });

    // Validación de dominio de correo
    const emailValue = form.correo.toLowerCase();
    const allowedDomains = ['@gmail.com', '@hotmail.com', '@bernardo.cl'];
    const isDomainValid = allowedDomains.some(domain => emailValue.endsWith(domain));

    if (!isDomainValid) {
      setMensaje({ texto: 'El correo debe ser @gmail.com, @hotmail.com o @bernardo.cl', tipo: 'danger' });
      return;
    }

    // Validación de longitud de contraseña
    if (form.password.length < 6 || form.password.length > 15) {
      setMensaje({ texto: 'La contraseña debe tener entre 6 y 15 caracteres.', tipo: 'danger' });
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMensaje({ texto: 'Usuario creado exitosamente.', tipo: 'success' });
        setForm({ correo: '', password: '', rol: 'Alumno' });
        cargarUsuarios();
      } else {
        const errData = await res.json();
        setMensaje({ texto: errData.error || 'Error al crear usuario.', tipo: 'danger' });
      }
    } catch (err) {
      setMensaje({ texto: 'Error de conexión.', tipo: 'danger' });
    }
  };

  return (
    <div className="container-fluid">
      
      {/* Encabezado Superior */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 shadow-sm rounded">
        <div>
          <h2 className="text-primary fw-bold mb-0">Gestión de Usuarios</h2>
          <small className="text-muted">Creación de usuarios y asignación de roles</small>
        </div>
      </div>

      <div className="row g-4">
        {/* Columna Izquierda: Formulario */}
        <div className="col-lg-4">
          <div className="card shadow border-0 p-4">
            <h4 className="fw-bold mb-4">Registrar Nuevo Usuario</h4>
            
            {mensaje.texto && (
              <div className={`alert alert-${mensaje.tipo} py-2`} role="alert">
                {mensaje.texto}
              </div>
            )}
            
            <form onSubmit={handleCreateUser}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Correo Electrónico</label>
                <input type="email" className="form-control" placeholder="usuario@bernardo.cl" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} required />
              </div>
              
              <div className="mb-3">
                <label className="form-label small fw-bold">Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="6 a 15 caracteres" 
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  minLength={6}
                  maxLength={15}
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Asignar Rol</label>
                <select className="form-select" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
                  <option value="Alumno">Alumno</option>
                  <option value="Apoderado">Apoderado</option>
                  <option value="Profesor">Profesor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm fw-bold">
                Crear Usuario
              </button>
            </form>
          </div>
        </div>

        {/* Columna Derecha: Tabla */}
        <div className="col-lg-8">
          <div className="card shadow border-0 overflow-hidden">
            <div className="bg-dark p-3">
              <h4 className="text-white mb-0 fs-5">Usuarios Registrados</h4>
            </div>
            {errorUsuarios && (
              <div className="alert alert-danger m-3 mb-0" role="alert">
                {errorUsuarios}
              </div>
            )}
            <div className="table-responsive" style={{ maxHeight: '500px' }}>
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">ID</th>
                    <th>Correo Electrónico</th>
                    <th className="text-center">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td className="ps-3 text-muted">#{u.id}</td>
                      <td className="fw-medium">{u.correo}</td>
                      <td className="text-center">
                        <span className={`badge rounded-pill ${
                          u.rol === 'Admin' ? 'bg-danger' : 
                          u.rol === 'Profesor' ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {u.rol}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {usuarios.length === 0 && !errorUsuarios && (
              <div className="p-5 text-center text-muted">
                No hay usuarios registrados actualmente.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
