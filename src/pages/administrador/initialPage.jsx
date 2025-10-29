import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import * as teacherService from '../../services/teacher/teacherService';

import { ChartBarIcon, BellAlertIcon, BookOpenIcon, UsersIcon, Cog6ToothIcon, ClockIcon, UserGroupIcon, ServerStackIcon, DocumentTextIcon, CheckCircleIcon, ExclamationTriangleIcon, CalendarDaysIcon, ComputerDesktopIcon, DocumentCheckIcon, ArrowUpOnSquareStackIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const adminData = {
    students: 500,
    courses: 50,
    criticalAlerts: 8,
    systemSummary: [
        { label: "Asistencia Promedio", value: "88.5%", color: 'text-green-500', valueBg: 'bg-green-700/70', valueText: 'text-green-200' },
        { label: "Uptime del Sistema", value: "99.8%", color: 'text-green-500', valueBg: 'bg-green-700/70', valueText: 'text-green-200' },
        { label: "Justificaciones Pendientes", value: 12, color: 'text-yellow-500', valueBg: 'bg-yellow-700/70', valueText: 'text-yellow-200' },
        { label: "Alertas Críticas", value: 8, color: 'text-red-500', valueBg: 'bg-red-700/70', valueText: 'text-red-200' },
        { label: "Semestres Activos", value: 6, color: 'text-purple-500', valueBg: 'bg-purple-700/70', valueText: 'text-purple-200' },
        { label: "Carreras Activas", value: 2, color: 'text-purple-500', valueBg: 'bg-purple-700/70', valueText: 'text-purple-200' },
    ],
    criticalAlertsList: [
        { title: "Curso TP2 tiene 15 estudiantes en estado crítico", subtitle: "Curso: TP2", priority: "Alta", action: "Revisar" },
        { title: "Servidor de base de datos con alta carga", subtitle: "", priority: "Media", action: "Revisar" },
        { title: "12 justificaciones pendientes de revisión", subtitle: "", priority: "Baja", action: "Revisar" },
    ],
    recentActivity: [
        { text: "Nuevo estudiante registrado: Ana García", time: "Hace 2 horas", icon: UserCircleIcon, color: 'text-blue-500' },
        { text: "Alerta crítica generada para curso TP2", time: "Hace 4 horas", icon: ExclamationTriangleIcon, color: 'text-red-500' },
        { text: "15 justificaciones procesadas automáticamente", time: "Hace 6 horas", icon: DocumentCheckIcon, color: 'text-green-500' },
        { text: "Backup del sistema completado exitosamente", time: "Hace 1 día", icon: ShieldCheckIcon, color: 'text-green-500' },
        { text: "Reporte mensual de asistencias generado", time: "Hace 2 días", icon: ChartBarIcon, color: 'text-purple-500' },
    ],
    systemStatus: [
        { component: "Base de Datos", status: "Operativo", color: "text-green-500" },
        { component: "Servidor Web", status: "Operativo", color: "text-green-500" },
        { component: "Sistema de Backup", status: "En Proceso", color: "text-yellow-500" },
        { component: "Notificaciones", status: "Operativo", color: "text-green-500" },
    ]
};

// --- Componentes Reutilizables ---

// Tarjeta de Métrica Principal (MODIFICADA para ser clickeable y mostrar carga)
const MainMetricCard = ({ title, count, icon, borderColor, iconColor, bgColor, onClick }) => {
    const IconComponent = icon;

    // Hacemos que sea clickeable solo si se pasa la función onClick
    const isClickable = !!onClick;
    const clickableClasses = isClickable 
        ? 'cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl' 
        : '';

    // Muestra un estado de carga si count es null
    const displayCount = count === null ? (
        <svg className="animate-spin h-8 w-8 text-white opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    ) : count;

    return (
        <div 
            className={`p-6 rounded-xl shadow-lg border-2 ${borderColor} ${bgColor} text-white flex items-center justify-between ${clickableClasses}`}
            onClick={onClick}
        >
            <div>
                <span className="text-md font-light block">{title}</span>
                <span className="text-4xl font-extrabold block mt-1">{displayCount}</span>
            </div>
            <IconComponent className={`w-10 h-10 ${iconColor} opacity-75`} />
        </div>
    );
};

// Métrica dentro del Resumen del Sistema (Se mantiene igual)
const SystemMetricItem = ({ label, value, valueBg, valueText }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-500">
        <span className="text-sm font-light text-gray-800">{label}</span>
        <span className={`text-sm font-semibold px-2 py-0.5 rounded-md ${valueBg} ${valueText}`}>
            {value}
        </span>
    </div>
);


// Alerta Crítica del Sistema (Se mantiene igual)
const CriticalAlertItem = ({ data }) => {
    let priorityColor = '';
    
    if (data.priority === 'Alta') {
        priorityColor = 'bg-red-700';
    } else if (data.priority === 'Media') {
        priorityColor = 'bg-yellow-600';
    } else { // Baja
        priorityColor = 'bg-blue-600';
    }
    
    return (
        <div className="bg-slate-500 p-4 rounded-xl mb-3 flex items-center justify-between text-gray-900">
            <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-700 mt-1 flex-shrink-0" />
                <div className='flex-grow'>
                    <span className="text-sm font-medium block">{data.title}</span>
                    {data.subtitle && <span className="text-xs text-gray-700 block">{data.subtitle}</span>}
                </div>
            </div>
            <div className='flex space-x-3 items-center flex-shrink-0'>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md text-white ${priorityColor}`}>
                    {data.priority}
                </span>
                <button className="text-sm px-3 py-1 rounded-lg bg-blue-700 hover:bg-blue-600 transition text-white font-medium">
                    Revisar
                </button>
            </div>
        </div>
    );
};


// Componente de Actividad Reciente (Se mantiene igual)
const ActivityItem = ({ data }) => (
    <div className="flex items-start mb-4 text-gray-900">
        <data.icon className={`w-5 h-5 mr-3 ${data.color} flex-shrink-0`} />
        <div>
            <span className="text-sm font-medium block">{data.text}</span>
            <span className="text-xs text-gray-600">{data.time}</span>
        </div>
    </div>
);

// Componente para una Acción Rápida (Se mantiene igual)
const QuickActionButton = ({ icon, label, colorClass, onClick }) => {
    const IconComponent = icon;
    return (
        <button 
            className={`flex items-center justify-start w-full p-3 rounded-lg text-white font-medium shadow-md ${colorClass} hover:opacity-90 transition-opacity`}
            onClick={onClick}
        >
            <IconComponent className="w-5 h-5 mr-3" />
            <span>{label}</span>
        </button>
    );
};

// Componente para el Estado del Sistema (Se mantiene igual)
const SystemStatusItem = ({ component, status, color }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-400 last:border-b-0 text-gray-900">
        <span className="text-sm font-light text-gray-700">{component}</span>
        <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${color === 'text-green-500' ? 'bg-green-500' : color === 'text-yellow-500' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
            <span className={`text-sm font-medium ${color}`}>{status}</span>
        </div>
    </div>
);


// --- Componente Principal ---
const InitialPage = () => {
    const navigate = useNavigate();
    // 👈 Estado para almacenar las cuentas de docentes
    const [teacherCount, setTeacherCount] = useState({ total: null, active: null, inactive: null });

    // 👈 Lógica para cargar las cuentas de docentes usando el servicio
    useEffect(() => {
        const loadTeacherCounts = async () => {
            try {
                // Asumiendo que esta función existe en tu teacherService
                const counts = await teacherService.getTeacherStatusCounts(); 
                setTeacherCount(counts);
            } catch (error) {
                console.error("Error al cargar la cuenta de docentes:", error);
                setTeacherCount({ total: 0, active: 0, inactive: 0 }); // Fallback
            }
        };

        loadTeacherCounts();
    }, []);

    // Función de navegación para Docentes
    const handleTeacherClick = () => {
        navigate('/admin/manage-teacher');
    };
    
    // Función de navegación de ejemplo para Usuarios
    const handleUserManagementClick = () => {
        // Debes definir la ruta correcta para la gestión de usuarios si aplica
        navigate('/admin/manage-users'); 
    };


    const actionColors = {
        blue: 'bg-blue-700',
        green: 'bg-green-600',
        purple: 'bg-purple-600',
        orange: 'bg-orange-600',
    };

    // Estilos de las tarjetas superiores, ahora usamos el total de docentes para el título
    const metricCardStyles = {
        students: { borderColor: 'border-blue-600', iconColor: 'text-blue-400', bgColor: 'bg-blue-900/20' },
        teachers: { borderColor: 'border-green-600', iconColor: 'text-green-400', bgColor: 'bg-green-900/20' },
        courses: { borderColor: 'border-purple-600', iconColor: 'text-purple-400', bgColor: 'bg-purple-900/20' },
        alerts: { borderColor: 'border-red-600', iconColor: 'text-red-400', bgColor: 'bg-red-900/20' },
    };
    
    return (
        // Fondo general (bg-gray-800)
        <div className="min-h-screen bg-gray-800 p-8 font-sans">
            
            {/* Título y Subtítulo de la página (Blanco) */}
            <h1 className="text-3xl font-bold mb-1 text-white">Panel de Administración</h1>
            <p className="text-sm font-light mb-8 opacity-70 text-gray-200">
                Gestión completa del sistema de asistencias • Instituto Valle Grande
            </p>

            {/* --- 1. Métricas Principales (Fila de 4 Tarjetas) --- */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {/* Estudiantes Activos */}
                <MainMetricCard 
                    title="Estudiantes Activos"
                    count={adminData.students}
                    icon={UsersIcon}
                    {...metricCardStyles.students}
                />
                
                {/* Docentes - DINÁMICO Y CLICKABLE (Muestra ACTIVOS) */}
                <MainMetricCard 
                    // 👈 CAMBIO 1: El título ahora indica que muestra solo los activos
                    title="Docentes Activos"
                    // 👈 CAMBIO 2: Usa el conteo 'active' en lugar de 'total'
                    count={teacherCount.active} 
                    icon={UserGroupIcon}
                    {...metricCardStyles.teachers}
                    onClick={handleTeacherClick} // 👈 La navegación se mantiene
                />
                
                {/* Cursos */}
                <MainMetricCard 
                    title="Cursos"
                    count={adminData.courses}
                    icon={BookOpenIcon}
                    {...metricCardStyles.courses}
                />
                
                {/* Alertas Críticas */}
                <MainMetricCard 
                    title="Alertas Críticas"
                    count={adminData.criticalAlerts}
                    icon={ExclamationTriangleIcon}
                    {...metricCardStyles.alerts}
                />
            </div>

            {/* --- 2. Contenido Principal: Dos Columnas (Distribución de Ancho 3/2) --- */}
            <div className="grid grid-cols-5 gap-8">
                
                {/* Columna Izquierda (Resumen del Sistema y Alertas Críticas) - Ocupa 3/5 (60%) */}
                <div className="col-span-3 space-y-8">
                    
                    {/* Resumen del Sistema (bg-slate-300) */}
                    <div className="bg-slate-300 p-6 rounded-xl shadow-lg text-gray-900">
                        <div className="flex items-center mb-4">
                            <ChartBarIcon className="w-5 h-5 mr-2 text-gray-700" />
                            <h2 className="text-lg font-semibold">Resumen del Sistema</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-5">Métricas principales del sistema académico</p>
                        
                        {/* Grilla de Métricas 3x2 */}
                        <div className="grid grid-cols-2 gap-4">
                            {adminData.systemSummary.map((item, index) => (
                                <SystemMetricItem 
                                    key={index}
                                    label={item.label}
                                    value={item.value}
                                    valueBg={item.valueBg}
                                    valueText={item.valueText}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Alertas Críticas del Sistema (bg-slate-300) */}
                    <div className="bg-slate-300 p-6 rounded-xl shadow-lg text-gray-900">
                        <div className="flex items-center mb-4">
                            <BellAlertIcon className="w-5 h-5 mr-2 text-red-700" />
                            <h2 className="text-lg font-semibold">Alertas Críticas del Sistema</h2>
                            <span className="ml-3 text-sm font-bold px-2 py-0.5 rounded-full bg-red-700 text-white">
                                {adminData.criticalAlerts}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-5">Situaciones que requieren atención inmediata</p>
                        
                        <div className="space-y-3">
                            {adminData.criticalAlertsList.map((alert, index) => (
                                <CriticalAlertItem key={index} data={alert} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha (Acciones Rápidas, Actividad Reciente y Estado) - Ocupa 2/5 (40%) */}
                <div className="col-span-2 space-y-8">
                    
                    {/* Acciones Rápidas (bg-slate-300) */}
                    <div className="bg-slate-300 p-6 rounded-xl shadow-lg text-gray-900">
                        <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
                        <div className="space-y-3">
                            <QuickActionButton 
                                icon={UserGroupIcon} 
                                label="Gestionar Usuarios" 
                                colorClass={actionColors.blue} 
                                onClick={handleUserManagementClick}
                            />
                            <QuickActionButton 
                                icon={ChartBarIcon} 
                                label="Ver Reportes" 
                                colorClass={actionColors.green} 
                            />
                            <QuickActionButton 
                                icon={CalendarDaysIcon} 
                                label="Revisar Asistencias" 
                                colorClass={actionColors.purple} 
                            />
                            <QuickActionButton 
                                icon={Cog6ToothIcon} 
                                label="Configuración" 
                                colorClass={actionColors.orange} 
                            />
                        </div>
                    </div>
                    
                    {/* Actividad Reciente (bg-slate-300) */}
                    <div className="bg-slate-300 p-6 rounded-xl shadow-lg text-gray-900">
                        <div className="flex items-center mb-4">
                            <ClockIcon className="w-5 h-5 mr-2 text-gray-700" />
                            <h2 className="text-lg font-semibold">Actividad Reciente</h2>
                        </div>
                        
                        <div className="space-y-3">
                            {adminData.recentActivity.map((data, index) => (
                                <ActivityItem key={index} data={data} />
                            ))}
                        </div>
                        
                        <button className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm text-white font-medium rounded-lg bg-gray-700 hover:bg-gray-600 transition shadow-lg">
                            <span>Ver Todo el Historial</span>
                        </button>
                    </div>

                    {/* Estado del Sistema (bg-slate-300) */}
                    <div className="bg-slate-300 p-6 rounded-xl shadow-lg text-gray-900">
                        <div className="flex items-center mb-4">
                            <ServerStackIcon className="w-5 h-5 mr-2 text-gray-700" />
                            <h2 className="text-lg font-semibold">Estado del Sistema</h2>
                        </div>
                        
                        <div className="space-y-1">
                            {adminData.systemStatus.map((data, index) => (
                                <SystemStatusItem key={index} data={data} {...data} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InitialPage;