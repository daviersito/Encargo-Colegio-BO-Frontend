import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRole, removeToken, getToken } from '../utils/auth';
import '../styles/navbar.css'; 

const Navbar = () => {
  const navigate = useNavigate();
  const role = getUserRole();
  const isAuthenticated = !!getToken(); // Verifica si existe un token

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-sm custom-navbar shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Colegio BO</Link>
        
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/contacto">Contacto</Link>
          </li>

          {/* 1. MOSTRAR SOLO SI ES ADMIN */}
          {isAuthenticated && role?.toLowerCase() === 'admin' && (
            <li className="nav-item">
              <Link className="nav-link fw-bold text-primary" to="/admin">Panel Admin</Link>
            </li>
          )}

          {/* 2. MOSTRAR SOLO SI ES PROFESOR */}
          {isAuthenticated && role?.toLowerCase() === 'profesor' && (
            <li className="nav-item">
              <Link className="nav-link fw-bold text-success" to="/profesor">Panel Profesor</Link>
            </li>
          )}

          {/* 3. MOSTRAR SOLO SI ES ALUMNO/OTROS */}
          {isAuthenticated && role && !['admin', 'profesor'].includes(role?.toLowerCase()) && (
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Mi Panel</Link>
            </li>
          )}

          {/* CONDICIONAL: LOGIN O CERRAR SESIÓN */}
          <li className="nav-item ms-2">
            {!isAuthenticated ? (
              <Link className="nav-link btn-login px-3" to="/login">Iniciar sesión</Link>
            ) : (
              <button 
                onClick={handleLogout} 
                className="btn btn-outline-danger btn-sm fw-bold"
                style={{ borderRadius: '8px' }}
              >
                Cerrar Sesión
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
