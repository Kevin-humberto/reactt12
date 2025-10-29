import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../services/user/userService';

const Register = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    rol: ''
  });
  const [roles, setRoles] = useState(['admin', 'editor', 'cliente']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const rolesData = await userService.getRoles();
      if (Array.isArray(rolesData)) {
        setRoles(rolesData);
      }
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

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
    setSuccess('');

    try {
      await userService.register(formData);
      setSuccess('Usuario registrado exitosamente. Redirigiendo al login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Error en el registro');
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
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Registrarse</h2>
          <p className="text-slate-400">Crea una nueva cuenta</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-600">
          <Link 
            to="/login" 
            className="flex-1 py-4 px-6 text-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors border-r border-slate-600"
          >
            Iniciar Sesión
          </Link>
          <div className="flex-1 py-4 px-6 text-center bg-blue-600 text-white font-medium">
            Registrarse
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Messages */}
            {error && (
              <div className="bg-red-900/50 text-red-300 px-4 py-3 rounded-md border border-red-800 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-900/50 text-green-300 px-4 py-3 rounded-md border border-green-800 text-sm">
                {success}
              </div>
            )}
            
            {/* Nombre de Usuario */}
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-slate-200 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                placeholder="Nombre de usuario"
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

            {/* Rol */}
            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-slate-200 mb-2">
                Rol
              </label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-500 rounded-md bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                <option value="">Selecciona un rol</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;