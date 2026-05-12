import { useNavigate } from 'react-router-dom';
import { removeToken, getUserRole } from '../utils/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const role = getUserRole();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className="container-fluid autumn-bg d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '600px', borderRadius: '20px' }}>
        
        {/* Cabecera de la Card */}
        <div className="card-header bg-primary text-white text-center py-4" style={{ borderRadius: '20px 20px 0 0' }}>
          <h2 className="mb-0 fw-bold">Bienvenido</h2>
        </div>

        <div className="card-body p-5 text-center">
          {/* Sección de Bienvenida */}
          <div className="mb-4">
            <p className="text-muted fs-5 mb-1">Bienvenido de nuevo</p>
            <h4 className="fw-semibold text-dark">
              Rol asignado: <span className="badge bg-info text-dark">{role || 'Usuario'}</span>
            </h4>
          </div>

          <hr className="my-4 text-secondary opacity-25" />

          {/* Botones de Navegación */}
          <div className="row g-3 mb-4">
            <div className="col-6">
              <button 
                onClick={() => navigate('/cursos')} 
                className="btn btn-outline-primary w-100 py-3 shadow-sm d-flex flex-column align-items-center"
              >
                <i className="bi bi-journal-bookmark fs-3 mb-2"></i>
                <span>Mis Cursos</span>
              </button>
            </div>
            <div className="col-6">
              <button 
                onClick={() => {
                  if (role?.toLowerCase() === 'profesor') {
                    navigate('/profesor/asistencia');
                  } else {
                    navigate('/asistencia');
                  }
                }} 
                className="btn btn-outline-primary w-100 py-3 shadow-sm d-flex flex-column align-items-center"
              >
                <i className="bi bi-calendar-check fs-3 mb-2"></i>
                <span>Asistencia</span>
              </button>
            </div>
          </div>

          {/* Botón de Cierre de Sesión */}
          <div className="d-grid">
            <button 
              onClick={handleLogout} 
              className="btn btn-danger btn-lg shadow-sm fw-bold"
              style={{ borderRadius: '10px' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="card-footer text-center bg-light py-3" style={{ borderRadius: '0 0 20px 20px' }}>
          <small className="text-muted italic">Plataforma de Gestión Académica</small>
        </div>
      </div>
    </div>
  );
}