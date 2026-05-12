import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import AdminLayout from './AdminLayout';
import AdminMatriculas from './AdminMatriculas';
import ProfesorLayout from './ProfesorLayout';
import ProfesorAsistencia from './ProfesorAsistencia';
import Home from './Home';
import Contacto from './Contacto';
import Asistencia from './asistencia';
import Cursos from './cursos';
import Navbar from './nabvar'; // Verifica que el nombre sea exacto

// ESTO DEBE ESTAR AQUÍ PARA QUE NO DE REFERENCE ERROR
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = getUserRole();
  if (!role) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.some(r => r.toLowerCase() === role.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Con N mayúscula */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/cursos" element={
          <ProtectedRoute>
            <Cursos />
          </ProtectedRoute>
        } />

        <Route path="/asistencia" element={
          <ProtectedRoute>
            <Asistencia />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="usuarios" replace />} />
          <Route path="usuarios" element={<AdminDashboard />} />
          <Route path="matriculas" element={<AdminMatriculas />} />
        </Route>

        <Route path="/profesor" element={
          <ProtectedRoute allowedRoles={['Profesor']}>
            <ProfesorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="asistencia" replace />} />
          <Route path="asistencia" element={<ProfesorAsistencia />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
