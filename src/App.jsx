import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayout from './layouts/DashboardLayout';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenExpiration = localStorage.getItem('token_expiration');
      if (tokenExpiration && Date.now() > parseInt(tokenExpiration)) {
        // Token kadaluarsa, lakukan logout dan redirect
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiration');
        navigate('/login'); // Redirect ke halaman login
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 1000); // Periksa setiap detik

    return () => clearInterval(interval); // Bersihkan interval
  }, [navigate]);

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      {isAuthenticated ? <Route path='/*' element={<DashboardLayout />} /> : <Route path='*' element={<Navigate to='/login' />} />}
    </Routes>
  );
};

export default App;
