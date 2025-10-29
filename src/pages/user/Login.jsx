import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../services/user/userService';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Intentando login con:', formData);

    try {
      const response = await userService.login(formData);
      console.log('Respuesta del servidor:', response);
      
      // Adaptamos para la estructura de respuesta de tu backend
      if (response && response.message && response.message.toLowerCase().includes('exitoso') && response.user_id) {
        // Creamos el objeto user con la estructura que espera la app
        const userData = {
          id: response.user_id,
          user_name: response.user_name,
          role: response.rol,
          status: response.status
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', 'dummy_token'); // Tu backend no devuelve token aún
        
        console.log('Usuario guardado en localStorage:', userData);
        console.log('Token guardado en localStorage: dummy_token');
        
        onLogin(userData);
        console.log('Llamando a navigate("/dashboard")');
        navigate('/dashboard');
      } else {
        console.error('Respuesta del servidor inválida:', response);
        setError('Credenciales incorrectas o respuesta del servidor inválida.');
      }
    } catch (error) {
      console.error('Error de login:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:5000');
      } else {
        setError(error.message || 'Error en el inicio de sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-2xl border border-slate-600">
        {/* Header */}
        <div className="px-8 py-8 text-center border-b border-slate-600">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            👤
          </div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Iniciar Sesión</h2>
          <p className="text-slate-400">Accede a tu cuenta</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-600">
          <div className="flex-1 py-4 px-6 text-center bg-blue-600 text-white font-medium">
            Iniciar Sesión
          </div>
          <Link 
            to="/register" 
            className="flex-1 py-4 px-6 text-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors border-l border-slate-600"
          >
            Registrarse
          </Link>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 text-red-300 px-4 py-3 rounded-md border border-red-800 text-sm">
                {error}
              </div>
            )}
            
            {/* Usuario */}
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-slate-200 mb-2">
                Usuario
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                placeholder="Tu nombre de usuario"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-500 rounded-md bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••••"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-500 rounded-md bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;