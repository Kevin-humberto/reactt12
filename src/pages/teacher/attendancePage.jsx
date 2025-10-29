import React from 'react';
// Asumiendo que has instalado Heroicons (o una librería similar) para los iconos
import { CalendarIcon, ClockIcon, UsersIcon, BookOpenIcon } from '@heroicons/react/24/outline'; 

// --- Componente para las tarjetas de selección y contenido ---
const Card = ({ title, description, children }) => (
    // 🚨 CAMBIO AQUI: Cambiamos 'text-white' a 'text-gray-900' para el texto principal
    <div className="bg-slate-300 p-6 rounded-xl shadow-lg text-gray-900"> 
        {title && (
            <h2 className="text-xl font-semibold mb-1">{title}</h2>
        )}
        {description && (
            // La opacidad la mantenemos, pero el color base ahora es oscuro
            <p className="text-sm opacity-70 mb-4">{description}</p>
        )}
        {children}
    </div>
);

// --- Componente Principal ---
const AttendancePage = () => {

    return (
        // Fondo general (bg-gray-800) y padding. El título de la página sigue siendo blanco.
        <div className="min-h-screen bg-gray-800 p-8 text-gray-100">
            {/* Título y Subtítulo de la página (DEBE SER BLANCO) */}
            <h1 className="text-3xl font-bold mb-2">Tomar Asistencia</h1>
            <p className="text-sm font-light mb-8 opacity-70">
                Registra la asistencia de tus estudiantes por semestre, curso y fecha
            </p>

            <div className="space-y-6">
                
                {/* 1. Modo de Vista (Ahora el texto es negro por el cambio en Card) */}
                <Card title="Modo de Vista">
                    <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-lg bg-blue-700 hover:bg-blue-800 transition">
                            <CalendarIcon className="w-5 h-5" />
                            <span>Tomar Asistencia Hoy</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 text-gray-100 font-medium rounded-lg bg-gray-600 hover:bg-gray-700 transition">
                            <ClockIcon className="w-5 h-5" /> 
                            <span>Ver Historial</span>
                        </button>
                    </div>
                </Card>

                {/* 2. Seleccionar Semestre, Curso y Fecha (Texto es negro por el cambio en Card) */}
                <Card title="Seleccionar Semestre, Curso y Fecha">
                    <div className="p-6 rounded-xl bg-slate-200 grid grid-cols-3 gap-6 text-gray-900">
                        
                        {/* Semestre */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Semestre</label>
                            <select
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-inner focus:ring-blue-500 focus:border-blue-500 border-gray-600"
                            >
                                <option value="" disabled selected>Selecciona semestre</option>
                                <option value="2025-1">2025-I</option>
                                <option value="2024-2">2024-II</option>
                            </select>
                        </div>
                        
                        {/* Curso */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Curso</label>
                            <select
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-inner focus:ring-blue-500 focus:border-blue-500 border-gray-600"
                            >
                                <option value="" disabled selected>Selecciona curso</option>
                                <option value="ing">Introducción a la Programación</option>
                                <option value="coi">Comunicación Oral y Escrita</option>
                            </select>
                        </div>

                        {/* Fecha */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Fecha</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value="2025-09-17"
                                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-inner appearance-none focus:ring-blue-500 focus:border-blue-500 border-gray-600"
                                />
                                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                    </div>
                </Card>

                <Card>
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <CalendarIcon className="w-12 h-12 mb-4 text-gray-900" />
                        <h3 className="text-xl font-semibold text-gray-900">Selecciona un semestre</h3>
                        <p className="text-sm text-gray-600">
                            Elige el semestre para ver los cursos disponibles
                        </p>
                    </div>
                </Card>

            </div>
        </div>
    );
};

export default AttendancePage;
