import React from 'react';
import { DocumentTextIcon, ChartBarIcon, BellAlertIcon, ClockIcon, UserGroupIcon, ArrowsPointingOutIcon, AdjustmentsHorizontalIcon, ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';

// Datos de ejemplo simulados para la sección de Reportes
const reportData = {
    summary: [
        { course: "Introducción a la Programación", code: "INO", students: 25, present: 88.5, late: 6.9, missing: 3.3, justified: 1.3 },
        { course: "Comunicación Oral y Escrita", code: "COE", students: 22, present: 92.1, late: 5.4, missing: 1.9, justified: 0.6 },
        { course: "Fundamentos de Administración", code: "FAH", students: 20, present: 85.3, late: 9.1, missing: 3.6, justified: 2.0 },
        { course: "Tecnología de la Información", code: "TPI", students: 18, present: 79.2, late: 12.3, missing: 6.5, justified: 2.0 },
    ],
    alerts: [
        { student: "Carlos Mendoza", code: "TPI", percentage: 65.2, reason: "Múltiples faltas sin justificar", type: "CRITICO" },
        { student: "Ana Rodríguez", code: "INO", percentage: 72.8, reason: "Tardanzas frecuentes", type: "ALERTA" },
        { student: "Luis García", code: "FAH", percentage: 74.1, reason: "Asistencia irregular", type: "ALERTA" },
    ],
    trends: [
        { week: 1, alerts: 5, attendance: 87.2 },
        { week: 2, alerts: 3, attendance: 89.1 },
        { week: 3, alerts: 7, attendance: 85.8 },
        { week: 4, alerts: 4, attendance: 88.5 },
    ]
};

// Componente de los Porcentajes dentro del Resumen
const PercentagePill = ({ label, percentage, bgColor, textColor = 'text-white' }) => (
    <div className={`text-xs p-1 rounded-md text-center ${bgColor} ${textColor} font-medium`}>
        <span className="block font-semibold">{percentage}%</span>
        <span className="block font-light text-[10px] opacity-80">{label}</span>
    </div>
);

// Componente para una fila de Resumen de Asistencia
const SummaryRow = ({ courseData }) => {
    return (
        <div className="border-b border-slate-400 py-3 last:border-b-0">
            <div className="flex justify-between items-center mb-2">
                <div className="text-gray-900">
                    <span className="text-sm font-semibold block">{courseData.course}</span>
                    <span className="text-xs text-gray-600 block">{courseData.code} - {courseData.students} estudiantes</span>
                </div>
                <div className="text-right text-gray-900">
                    <span className="text-2xl font-bold">{courseData.present.toFixed(1)}%</span>
                    <span className="text-xs text-gray-600 block">Asistencia</span>
                </div>
            </div>

            {/* Barras de porcentaje */}
            <div className="grid grid-cols-4 gap-2">
                <PercentagePill 
                    label="Presente" 
                    percentage={courseData.present.toFixed(1)} 
                    bgColor="bg-green-600" 
                />
                <PercentagePill 
                    label="Tardanza" 
                    percentage={courseData.late.toFixed(1)} 
                    bgColor="bg-yellow-600" 
                />
                <PercentagePill 
                    label="Falta" 
                    percentage={courseData.missing.toFixed(1)} 
                    bgColor="bg-red-700" 
                />
                <PercentagePill 
                    label="Justificado" 
                    percentage={courseData.justified.toFixed(1)} 
                    bgColor="bg-gray-700" 
                />
            </div>
        </div>
    );
};

// Componente para una Alerta Activa
const AlertItem = ({ alert }) => {
    const isCritical = alert.type === 'CRITICO';
    const bgColor = isCritical ? 'bg-red-700' : 'bg-yellow-600';
    const tagText = isCritical ? 'CRÍTICO' : 'ALERTA';

    return (
        // Fondo de Item de Alerta: bg-slate-400 (un tono más oscuro que la tarjeta base)
        <div className="bg-slate-400 p-3 rounded-xl mb-3 flex justify-between items-start text-gray-900">
            <div className="flex flex-col">
                <div className='flex items-center space-x-2'>
                    <span className="text-md font-semibold">{alert.student}</span>
                    <span className="text-xs font-medium text-gray-500">{alert.code}</span>
                </div>
                <span className="text-sm font-light text-gray-700">{alert.percentage}% de asistencia</span>
                <span className="text-xs italic text-gray-500 mt-1">{alert.reason}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${bgColor}`}>
                {tagText}
            </span>
        </div>
    );
};

// Componente para una Tendencia por Periodo
const TrendItem = ({ trend }) => {
    return (
        // Fondo de Item de Tendencia: bg-slate-400 (un tono más oscuro que la tarjeta base)
        <div className="bg-slate-400 p-3 rounded-xl mb-3 flex justify-between items-center text-gray-900">
            <div className="flex flex-col">
                <span className="text-sm font-semibold">{`Semana ${trend.week}`}</span>
                <span className="text-xs text-gray-600">{trend.alerts} alertas generadas</span>
            </div>
            <div className="text-right">
                <span className="text-lg font-bold">{trend.attendance.toFixed(1)}%</span>
                <span className="text-xs text-gray-600">Asistencia promedio</span>
            </div>
        </div>
    );
};

// Componente auxiliar para botones rápidos
const QuickReportButton = ({ icon, label, colorClass }) => {
    // 💡 SOLUCIÓN DEFINITIVA: 
    // 1. Desestructuramos como 'icon' (minúscula).
    // 2. Renombramos la variable a 'IconComponent' (mayúscula) dentro de la función.
    // 3. Usamos 'IconComponent' en el JSX.
    // Esto es mucho más claro para el linter que el renombramiento en la desestructuración.
    const IconComponent = icon; 
    
    return (
        <button className={`flex items-center w-full p-3 rounded-lg text-white font-medium shadow-md ${colorClass} hover:opacity-90 transition-opacity`}>
            <IconComponent className="w-5 h-5 mr-3" /> 
            <span>{label}</span>
        </button>
    );
};


// Componente principal
const ReportsPage = () => {
    
    // Colores para los botones de Reportes Rápidos
    const reportColors = {
        green: 'bg-green-600',
        blue: 'bg-blue-600',
        purple: 'bg-purple-600',
        orange: 'bg-orange-600',
        teal: 'bg-teal-600',
    };

    return (
        // Fondo general (bg-gray-800)
        <div className="min-h-screen bg-gray-800 p-8 text-gray-100">
            
            {/* Título y Subtítulo de la página (Blanco) */}
            <h1 className="text-3xl font-bold mb-2">Reportes y Análisis</h1>
            <p className="text-sm font-light mb-8 opacity-70">
                Genera reportes detallados sobre el rendimiento y asistencia de tus estudiantes por semestre
            </p>

            {/* --- 1. Configuración de Reporte (bg-slate-300) --- */}
            <div className="bg-slate-300 p-6 rounded-xl shadow-lg mb-8 text-gray-900">
                <div className="flex items-center mb-5">
                    <DocumentTextIcon className="w-6 h-6 mr-2 text-gray-700" />
                    <h2 className="text-lg font-semibold">Configuración de Reporte</h2>
                </div>
                
                <div className="grid grid-cols-5 gap-6 items-end">
                    
                    {/* Selects */}
                    {['Semestre', 'Tipo de Reporte', 'Curso', 'Periodo'].map((label, index) => (
                        <div key={index}>
                            <label className="block text-xs font-medium mb-1 text-gray-600">{label}</label>
                            <div className="relative">
                                {/* Inputs/Selects Oscuros (bg-slate-600) con texto blanco */}
                                <select
                                    className="w-full pl-3 pr-8 py-2 text-sm bg-slate-600 text-white rounded-lg appearance-none border border-slate-500 focus:ring-blue-700 focus:border-blue-700"
                                    readOnly 
                                    defaultValue={index === 0 ? '3° Semestre' : index === 1 ? 'Reporte de Asistencia' : index === 2 ? 'Todos los cursos' : 'Último mes'}
                                >
                                    <option>{index === 0 ? '3° Semestre' : index === 1 ? 'Reporte de Asistencia' : index === 2 ? 'Todos los cursos' : 'Último mes'}</option>
                                </select>
                                <ArrowDownOnSquareIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                            </div>
                        </div>
                    ))}
                    
                    {/* Botón Generar Reporte */}
                    <button className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm text-white font-medium rounded-lg bg-blue-700 hover:bg-blue-600 transition shadow-lg">
                        <ArrowDownOnSquareIcon className="w-5 h-5" />
                        <span>Generar Reporte</span>
                    </button>
                </div>
            </div>

            {/* --- 2. Contenido Principal: Resumen, Alertas, Tendencias y Reportes Rápidos --- */}
            <div className="grid grid-cols-3 gap-6">
                
                {/* Columna Izquierda (Resumen y Tendencias) */}
                <div className="col-span-2 space-y-6">
                    
                    {/* Resumen de Asistencia por Curso (bg-slate-300) */}
                    <div className="bg-slate-300 p-6 rounded-xl shadow-lg text-gray-900">
                        <div className="flex items-center mb-4">
                            <ChartBarIcon className="w-6 h-6 mr-2 text-gray-700" />
                            <h2 className="text-lg font-semibold">Resumen de Asistencia por Curso</h2>
                        </div>
                        <p className="text-xs text-gray-600 mb-4">3° Semestre - Porcentajes del último mes</p>
                        
                        <div className="space-y-3">
                            {reportData.summary.map((course, index) => (
                                <SummaryRow key={index} courseData={course} />
                            ))}
                        </div>
                    </div>

                    {/* Tendencias por Periodo (bg-slate-300) */}
                    <div className="bg-slate-300 p-6 rounded-xl shadow-lg text-gray-900">
                        <div className="flex items-center mb-4">
                            <ArrowsPointingOutIcon className="w-6 h-6 mr-2 text-gray-700" />
                            <h2 className="text-lg font-semibold">Tendencias por Periodo</h2>
                        </div>
                        <p className="text-xs text-gray-600 mb-4">3° Semestre - Evolución por semanas</p>

                        <div className="space-y-2">
                            {reportData.trends.map((trend, index) => (
                                <TrendItem key={index} trend={trend} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha (Alertas y Reportes Rápidos) */}
                <div className="col-span-1 space-y-6">
                    
                    {/* Alertas Activas (bg-slate-300) */}
                    <div className="bg-slate-300 p-6 rounded-xl shadow-lg text-gray-900">
                        <div className="flex items-center mb-4">
                            <BellAlertIcon className="w-6 h-6 mr-2 text-gray-700" />
                            <h2 className="text-lg font-semibold">Alertas Activas</h2>
                        </div>
                        <p className="text-xs text-gray-600 mb-4">3° Semestre - Todos los cursos</p>
                        
                        <div className="space-y-3">
                            {reportData.alerts.map((alert, index) => (
                                <AlertItem key={index} alert={alert} />
                            ))}
                        </div>
                        
                        {/* Botón Ver Todas las Alertas (Color de Alerta: Naranja/Amarillo) */}
                        <button className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm text-white font-medium rounded-lg bg-yellow-600 hover:bg-yellow-500 transition shadow-lg">
                            <span>Ver Todas las Alertas</span>
                        </button>
                    </div>
                    
                    {/* Reportes Rápidos (bg-slate-300) */}
                    <div className="bg-slate-300 p-6 rounded-xl shadow-lg text-gray-900">
                        <div className="flex items-center mb-4">
                            <ClockIcon className="w-6 h-6 mr-2 text-gray-700" />
                            <h2 className="text-lg font-semibold">Reportes Rápidos</h2>
                        </div>
                        <p className="text-xs text-gray-600 mb-4">Reportes específicos para 3° Semestre</p>
                        
                        <div className="space-y-3">
                            <QuickReportButton 
                                icon={AdjustmentsHorizontalIcon} 
                                label="Asistencia Diaria - Hoy" 
                                colorClass={reportColors.green} 
                            />
                            <QuickReportButton 
                                icon={UserGroupIcon} 
                                label="Lista de Estudiantes por Curso" 
                                colorClass={reportColors.blue} 
                            />
                            <QuickReportButton 
                                icon={BellAlertIcon} 
                                label="Estudiantes en Riesgo" 
                                colorClass={reportColors.purple} 
                            />
                            <QuickReportButton 
                                icon={DocumentTextIcon} 
                                label="Justificaciones del Mes" 
                                colorClass={reportColors.orange} 
                            />
                            <QuickReportButton 
                                icon={ChartBarIcon} 
                                label="Análisis de Tendencias" 
                                colorClass={reportColors.teal} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
