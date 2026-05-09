import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  

  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form) 
      });
      
      if (res.ok) {
        navigate('/login');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Error al registrar la cuenta.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
        <div className="card-body">
          <h2 className="text-center mb-4 fw-bold text-success">Crear Cuenta</h2>
          
          {error && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="ejemplo@correo.com"
                value={form.correo} 
                onChange={e => setForm({...form, correo: e.target.value})} 
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Mínimo 6 caracteres"
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                required 
              />
              <div className="form-text">Nunca compartas tu contraseña con nadie.</div>
            </div>

            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-success btn-lg shadow-sm">
                Registrarse
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted">
              ¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none fw-bold text-success">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}