import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard as DashboardIcon,
  BookOpen as BookOpenIcon,
  ClipboardCheck as ClipboardCheckIcon,
  FileText as FileTextIcon,
  Bell as BellIcon,
  GraduationCap as GraduationCapIcon,
  ChevronLeft as ChevronLeftIcon,
  LogOut as LogOutIcon
} from 'lucide-react';

const StudentLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: DashboardIcon, path: "/student/dashboard" },
    { name: "Mis Cursos", icon: BookOpenIcon, path: "/student/cursos" },
    { name: "Asistencias", icon: ClipboardCheckIcon, path: "/student/asistencias" },
    { name: "Justificaciones", icon: FileTextIcon, path: "/student/justificaciones" },
    { name: "Alertas", icon: BellIcon, path: "/student/alertas" },
  ];

  const getIsActive = (path) => location.pathname.startsWith(path);

  const studentName = "Vicente López";
  const studentEmail = "vicente.lopez@allegrande.edu.pe";

  const handleLogout = () => {
    console.log("Cerrando sesión...");
  };

  return (
    <div className="flex min-h-screen bg-gray-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl h-screen sticky top-0">

        {/* Encabezado */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <GraduationCapIcon className="w-8 h-8 text-blue-400" />
            <div>
              <h4 className="text-xl font-bold leading-none">Valle Grande</h4>
              <p className="text-xs text-gray-400">Student</p>
            </div>
          </div>
          <ChevronLeftIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
        </div>

        {/* Navegación */}
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
            <p className="text-sm font-semibold text-white">{studentName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{studentEmail}</p>
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

export default StudentLayout;