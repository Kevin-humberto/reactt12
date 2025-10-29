import React from 'react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, DocumentTextIcon, ChevronDownIcon, AdjustmentsHorizontalIcon, UsersIcon } from '@heroicons/react/24/outline';

// Datos de ejemplo simulados
const justifications = [
    {
        id: 1,
        student: "Vicente López Junior Jeanpier",
        course: "Introducción a la Programación (INO) - Código: 7197563",
        status: "Pendiente",
        dateMissed: "18/1/2025",
        dateSent: "20/1/2025, 10:30:00 a. m.",
        reason: "Cita médica de emergencia en el Hospital Nacional. Adjunto certificado médico.",
        revision: null,
        isUrgent: false,
    },
    {
        id: 2,
        student: "Ana García Mendoza",
        course: "Comunicación Oral y Escrita (COE) - Código: 6089967",
        status: "Aprobada",
        dateMissed: "20/1/2025",
        dateSent: "22/1/2025, 8:15:00 a. m.",
        reason: "Problema familiar urgente - fallecimiento de familiar directo.",
        revision: "Justificación válida. Documentación correcta y dentro del plazo establecido.",
        revisionDate: "22/1/2025, 2:20:00 p. m.",
        isUrgent: true,
    },
    {
        id: 3,
        student: "Carlos Rodríguez Silva",
        course: "Tecnología de la Información (TPI) - Código: 69078948",
        status: "Rechazada",
        dateMissed: "15/1/2025",
        dateSent: "19/1/2025, 4:45:00 a. m.",
        reason: "Transporte público cancelado por huelga general en la ciudad.",
        revision: "Justificación enviada fuera del plazo de 48 horas. No se puede aprobar según reglamento.",
        revisionDate: "20/1/2025, 8:10:00 a. m.",
        isUrgent: false,
        flag: "Fuera de plazo",
    },
];

// Componente para las tarjetas de resumen (Pendientes, Aprobadas, Rechazadas)
const StatusCard = ({ title, count, color }) => {
    let borderColor = '';
    let innerBgColor = ''; 

    if (color === 'Pendientes') {
        borderColor = 'border-yellow-600';
        innerBgColor = 'bg-yellow-600/10'; // Fondo amarillo suave
    } else if (color === 'Aprobadas') {
        borderColor = 'border-green-600';
        innerBgColor = 'bg-green-600/10'; // Fondo verde suave
    } else if (color === 'Rechazadas') {
        borderColor = 'border-red-600';
        innerBgColor = 'bg-red-600/10'; // Fondo rojo suave
    }

    return (
        // 🚨 CORRECCIÓN: Se elimina 'border' y se mantiene solo 'border-2' para evitar el conflicto.
        <div className={`p-5 rounded-xl border-2 ${borderColor} bg-gray-800 ${innerBgColor} text-white shadow-xl flex flex-col items-center justify-center`}>
            <span className="text-4xl font-extrabold">{count}</span>
            <span className="text-lg font-medium">{title}</span>
        </div>
    );
};

// Componente principal
const JustificationManagementPage = () => {
    // Contadores basados en los datos de ejemplo
    const pendingCount = justifications.filter(j => j.status === 'Pendiente').length;
    const approvedCount = justifications.filter(j => j.status === 'Aprobada').length;
    const rejectedCount = justifications.filter(j => j.status === 'Rechazada').length;

    return (
        // Fondo general (bg-gray-800)
        <div className="min-h-screen bg-gray-800 p-8 text-gray-100">
            
            {/* Título y Subtítulo de la página (Blanco) */}
            <h1 className="text-3xl font-bold mb-2">Gestión de Justificaciones</h1>
            <p className="text-sm font-light mb-8 opacity-70">
                Revisa y aprueba las solicitudes de justificación de tus estudiantes
            </p>

            {/* --- 1. Tarjetas de Estado --- */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <StatusCard 
                    title="Pendientes" 
                    count={pendingCount} 
                    color="Pendientes" 
                />
                <StatusCard 
                    title="Aprobadas" 
                    count={approvedCount} 
                    color="Aprobadas" 
                />
                <StatusCard 
                    title="Rechazadas" 
                    count={rejectedCount} 
                    color="Rechazadas" 
                />
            </div>

            {/* --- 2. Filtros --- */}
            {/* Fondo: bg-slate-300 | Texto: text-gray-900 */}
            <div className="bg-slate-300 p-4 rounded-xl shadow-lg mb-6 text-gray-900"> 
                <h2 className="text-sm font-semibold opacity-70 mb-3">Filtros</h2>
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* Filtro Estado */}
                    <div>
                        <label className="block text-xs font-medium mb-1 opacity-70">Estado</label>
                        <div className="relative">
                            <select
                                // Inputs oscuros para contrastar con bg-slate-300
                                className="w-full pl-3 pr-10 py-2 text-sm bg-gray-700 text-white rounded-lg appearance-none border border-slate-600 focus:ring-blue-700 focus:border-blue-700"
                            >
                                <option>Todos los estados</option>
                                <option>Pendiente</option>
                                <option>Aprobada</option>
                                <option>Rechazada</option>
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Filtro Curso */}
                    <div>
                        <label className="block text-xs font-medium mb-1 opacity-70">Curso</label>
                        <div className="relative">
                            <select
                                className="w-full pl-3 pr-10 py-2 text-sm bg-gray-700 text-white rounded-lg appearance-none border border-slate-600 focus:ring-blue-700 focus:border-blue-700"
                            >
                                <option>Todos los cursos</option>
                                <option>Introducción a la Programación (INO)</option>
                                <option>Comunicación Oral y Escrita (COE)</option>
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. Lista de Justificaciones --- */}
            <div className="space-y-4">
                {justifications.map((justification) => (
                    <JustificationItem key={justification.id} justification={justification} />
                ))}
            </div>

        </div>
    );
};

// Componente para un item individual de justificación
const JustificationItem = ({ justification }) => {
    // Clase para el color del badge de estado
    const badgeClass = justification.status === 'Pendiente' 
        ? 'bg-yellow-600 text-white' 
        : justification.status === 'Aprobada'
        ? 'bg-green-600 text-white' 
        : 'bg-red-600 text-white';     

    // Color del círculo para el ícono de estado
    const iconColor = justification.status === 'Pendiente' 
        ? 'text-yellow-600' 
        : justification.status === 'Aprobada'
        ? 'text-green-600'
        : 'text-red-600';

    return (
        // Fondo de tarjeta: bg-slate-300
        <div className="bg-slate-300 p-5 rounded-xl shadow-lg border-l-4 border-slate-400">
            {/* Cabecera del Estudiante y Estado */}
            <div className="flex items-start justify-between mb-3 text-gray-900">
                <div className="flex items-center">
                    <CheckCircleIcon className={`w-4 h-4 mr-2 ${iconColor} ${justification.status === 'Rechazada' && justification.flag ? 'hidden' : ''}`} />
                    <XCircleIcon className={`w-4 h-4 mr-2 text-red-600 ${justification.status === 'Rechazada' && justification.flag ? '' : 'hidden'}`} />
                    <div className='flex flex-col'>
                        {/* Texto nombre estudiante: text-gray-900 */}
                        <span className="text-lg font-semibold text-gray-900">{justification.student}</span> 
                        {/* Texto curso: text-gray-600 */}
                        <span className="text-xs text-gray-600 mt-0.5">{justification.course}</span> 
                    </div>
                </div>
                
                {/* Badge de Estado */}
                <div className="flex items-center space-x-2">
                    {justification.flag && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-700 text-white border border-red-400">
                            {justification.flag}
                        </span>
                    )}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}>
                        {justification.status}
                    </span>
                </div>
            </div>

            {/* Detalles (Fecha y Motivo) */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-4 text-gray-800">
                <div>
                    <span className="block text-gray-600">Fecha de la falta:</span>
                    <span className="font-medium">{justification.dateMissed}</span>
                </div>
                <div className="text-right">
                    <span className="block text-gray-600">Fecha de envío:</span>
                    <span className="font-medium">
                        <ClockIcon className="w-4 h-4 inline-block mr-1 align-sub" />
                        {justification.dateSent}
                    </span>
                </div>
            </div>

            {/* Motivo de la Justificación (Fondo oscuro para contraste) */}
            <div className="p-3 rounded-lg bg-gray-700/80 mb-3 border-l-4 border-gray-600 text-white">
                <span className="block text-xs opacity-70 mb-1">Motivo de la justificación:</span>
                <p className="text-sm font-light italic">{justification.reason}</p>
            </div>

            {/* Evidencia */}
            <div className="flex justify-between items-center mb-4 text-gray-900">
                <span className="block text-xs text-gray-600">Evidencia adjunta:</span>
                <button className="flex items-center space-x-1 px-3 py-1 text-xs text-white font-medium rounded-lg bg-gray-700 hover:bg-gray-600 transition border border-gray-600">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>Ver documento</span>
                </button>
            </div>

            {/* Acciones o Observaciones de Revisión */}
            {justification.status === 'Pendiente' ? (
                // Botón de acción para Pendientes (Fondo Azul)
                <div className="mt-4">
                    <button className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm text-white font-medium rounded-lg bg-blue-700 hover:bg-blue-600 transition">
                        <AdjustmentsHorizontalIcon className="w-5 h-5" />
                        <span>Revisar Justificación</span>
                    </button>
                </div>
            ) : (
                // Observaciones de Revisión para Aprobadas/Rechazadas
                <div className="mt-4 border-t border-slate-400 pt-3 text-gray-900">
                    <span className="block text-xs text-gray-600 mb-1">Observaciones de la revisión:</span>
                    {/* FONDO OSCURO PARA BLOQUES INTERNOS (Observaciones) */}
                    <div className="p-3 rounded-lg bg-gray-700/80 border-l-4 border-gray-600 text-white"> 
                        <p className="text-sm font-light">{justification.revision}</p>
                    </div>
                    <span className="block text-xs text-gray-500 mt-1">Revisado el {justification.revisionDate}</span>
                </div>
            )}
        </div>
    );
};

export default JustificationManagementPage;
