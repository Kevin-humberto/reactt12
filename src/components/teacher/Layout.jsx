import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  CalendarCheck as CalendarCheckIcon,
  FileText as FileTextIcon,
  BarChart3 as BarChart3Icon,
  GraduationCap as GraduationCapIcon,
  ChevronLeft as ChevronLeftIcon,
  LogOut as LogOutIcon
} from 'lucide-react';

const TeacherLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/teacher/inicial" },
    { name: "Tomar Asistencia", icon: CalendarCheckIcon, path: "/teacher/attendance" },
    { name: "Justificaciones", icon: FileTextIcon, path: "/teacher/justifications" },
    { name: "Reportes", icon: BarChart3Icon, path: "/teacher/reports" },
  ];

  const getIsActive = (path) => location.pathname.startsWith(path);

  const userName = "María González";
  const userEmail = "docente1@allegrande.edu.pe";

  const handleLogout = () => {
    console.log("Cerrando sesión...");
  };

  return (
    // Cambiamos el fondo principal a bg-gray-900
    <div className="flex min-h-screen bg-gray-800">
      
      {/*para que el sidebar tenga el 100% de la altura de la pantalla y se mantenga fijo. */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl h-screen sticky top-0">

        {/* Encabezado: 'Valle Grande' */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <GraduationCapIcon className="w-8 h-8 text-blue-400" />
            <div>
              <h4 className="text-xl font-bold leading-none">Valle Grande</h4>
              <p className="text-xs text-gray-400">Teacher</p>
            </div>
          </div>
          <ChevronLeftIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto">
          <ul>
            {navItems.map((item) => {
              const isActive = getIsActive(item.path);
              const IconComponent = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-4 py-3 px-4 font-medium text-sm transition-colors no-underline
                      ${
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                    style={isActive ? { backgroundColor: '#2c3340', color: '#fff' } : {}}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        isActive 
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    />
                    <span className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sección de Perfil y Cerrar Sesión */}
        <div className="p-4 border-t border-gray-800">
          <div className="p-3 bg-gray-800 rounded-lg mb-3">
            <p className="text-sm font-semibold text-white">{userName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{userEmail}</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-2 px-3 text-red-500 hover:text-red-400 transition-colors w-full rounded-md hover:bg-gray-800"
          >
            <LogOutIcon className="w-5 h-5 transform rotate-180" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>

      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;