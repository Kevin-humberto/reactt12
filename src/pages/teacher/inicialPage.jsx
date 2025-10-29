import React from "react";
import {
    BookOpen,
    Users,
    Calendar,
    FileText,
    AlertTriangle,
    BarChart3,
    ArrowRight,
} from "lucide-react";

// --- Clase de Hoy ---
const TodayClassItem = ({ title, code, students, time }) => (
    <div className="flex items-center justify-between bg-gray-500 rounded-xl px-4 py-3 mb-3">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="text-gray-800 font-medium">{title}</p>
                <p className="text-xs text-gray-100">
                    {code} • {students} estudiantes
                </p>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <p className="text-gray-100 font-semibold text-sm">{time}</p>
            <button className="mt-1 px-3 py-1 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700 text-white transition">
                Tomar Asistencia
            </button>
        </div>
    </div>
);

// --- Estadísticas por curso ---
const CourseStatItem = ({ title, code, students, attendance, alerts }) => (
    <div className="flex justify-between items-center bg-gray-500 rounded-lg px-3 py-2 mb-2">
        <div>
            <p className="text-gray-900 font-medium">{title}</p>
            <p className="text-xs text-gray-100">
                {code} • {students} estudiantes
            </p>
        </div>
        <div className="text-right">
            <p className="text-gray-900 font-semibold text-sm">{attendance}</p>
            {alerts > 0 ? (
                <span className="text-xs font-semibold bg-red-200 text-red-700 px-2 py-0.5 rounded-full">
                    {alerts} alertas
                </span>
            ) : (
                <span className="text-xs font-semibold text-green-600">Sin alertas</span>
            )}
        </div>
    </div>
);

// --- Justificaciones ---
const JustificationItem = ({ name, date, reason, code }) => (
    <div className="p-3 bg-gray-500 rounded-xl border border-gray-300 mb-3">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-gray-900 font-semibold">{name}</h3>
            <span className="text-xs font-bold rounded-full bg-amber-600 text-white px-2 py-0.5">
                {code}
            </span>
        </div>
        <p className="text-xs text-gray-100">Falta del {date}</p>
        <p className="text-sm text-gray-700 mt-1">{reason}</p>
        <div className="flex gap-2 mt-3">
            <button className="flex-1 py-1 rounded-md text-sm bg-green-600 hover:bg-green-700 text-white font-semibold">
                Aprobar
            </button>
            <button className="flex-1 py-1 rounded-md text-sm bg-gray-400 hover:bg-gray-500 text-white font-semibold">
                Rechazar
            </button>
        </div>
    </div>
);

// --- Página Principal ---
const InicialPage = () => {
    const currentClasses = [
        {
            title: "Introducción a la Programación",
            code: "INO - Lab 1",
            students: 25,
            time: "08:00 - 10:00",
        },
        {
            title: "Comunicación Oral y Escrita",
            code: "COI - Aula 203",
            students: 22,
            time: "14:00 - 16:00",
        },
    ];

    const courseStats = [
        {
            title: "Introducción a la Programación",
            code: "INO",
            students: 25,
            attendance: "88.5%",
            alerts: 2,
        },
        {
            title: "Comunicación Oral y Escrita",
            code: "COI",
            students: 22,
            attendance: "92.1%",
            alerts: 0,
        },
        {
            title: "Fundamentos de Administración",
            code: "FAH",
            students: 20,
            attendance: "85.3%",
            alerts: 1,
        },
        {
            title: "Tecnología de la Información",
            code: "TP2",
            students: 18,
            attendance: "79.2%",
            alerts: 3,
        },
    ];

    const pendingJustifications = [
        {
            name: "Vicente López",
            date: "2025-01-19",
            reason: "Cita médica de emergencia",
            code: "INO",
        },
        {
            name: "Ana García",
            date: "2025-01-21",
            reason: "Problema familiar urgente",
            code: "COI",
        },
    ];

    const recentActivity = [
        {
            type: "calendar",
            text: "Asistencia registrada para INO - 25 estudiantes",
            time: "Hace 2 horas",
        },
        {
            type: "file",
            text: "Nueva justificación de Vicente López",
            time: "Hace 4 horas",
        },
        {
            type: "alert",
            text: "Alerta crítica generada para TP2",
            time: "Hace 1 día",
        },
        {
            type: "calendar",
            text: "Asistencia registrada para COI - 22 estudiantes",
            time: "Hace 2 días",
        },
    ];

    return (
        <div className="p-8 bg-gray-800 min-h-screen text-gray-50">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">¡Bienvenida, María!</h1><br></br>
                <p className="text-sm text-gray-500">
                    DOC001 • Sistemas de Información • 4 cursos • 85 estudiantes
                </p>
            </div>

            {/* Grid Principal */}
            <div className="grid grid-cols-12 gap-6">
                {/* Izquierda */}
                <div className="col-span-12 lg:col-span-7 space-y-6">
                    {/* Clases de hoy */}
                    <div className="bg-slate-300 p-5 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-gray-800" />
                            <h2 className="text-lg font-bold text-gray-800">Clases de Hoy</h2>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                            miércoles, 17 de septiembre de 2025
                        </p>
                        {currentClasses.map((clase, i) => (
                            <TodayClassItem key={i} {...clase} />
                        ))}
                    </div>

                    {/* Estadísticas */}
                    <div className="bg-slate-300 p-5 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-5 h-5 text-gray-800" />
                            <h2 className="text-lg font-bold text-gray-800">Estadísticas por Curso</h2>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                            Resumen de asistencia y alertas por curso
                        </p>
                        {courseStats.map((stat, i) => (
                            <CourseStatItem key={i} {...stat} />
                        ))}
                    </div>
                </div>

                {/* Derecha */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    {/* Resumen rápido */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-950 rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg">
                            <p className="text-3xl font-bold text-white">4</p>
                            <p className="text-sm text-gray-300">Cursos</p>
                        </div>
                        <div className="bg-emerald-950 rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg">
                            <p className="text-3xl font-bold text-white">85</p>
                            <p className="text-sm text-gray-300">Estudiantes</p>
                        </div>
                    </div>

                    {/* Justificaciones */}
                    <div className="bg-gray-100 p-5 rounded-2xl ">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-gray-800" />
                            <h2 className="text-lg font-bold text-gray-800">
                                Justificaciones Pendientes{" "}
                                <span className="ml-2 text-xs font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                                    2
                                </span>
                            </h2>
                        </div>
                        {pendingJustifications.map((just, i) => (
                            <JustificationItem key={i} {...just} />
                        ))}
                        <button className="w-full mt-2 py-2 text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                            Ver Todas las Justificaciones <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="bg-gray-100 p-5 rounded-2xl shadow-lg text-gray-900">
                        <h2 className="text-lg font-semibold mb-3">Acciones Rápidas</h2>
                        <div className="flex flex-col gap-3">
                            <button className="py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 flex items-center justify-center gap-2">
                                <Calendar className="w-5 h-5" /> Tomar Asistencia
                            </button>
                            <button className="py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                                <Users className="w-5 h-5" /> Ver Estudiantes
                            </button>
                            <button className="py-3 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                                <BarChart3 className="w-5 h-5" /> Generar Reporte
                            </button>
                        </div>
                    </div>

                    {/* Actividad reciente */}
                    <div className="bg-gray-100 p-5 rounded-2xl shadow-lg text-gray-900">
                        <h2 className="text-lg font-semibold mb-3">Acciones Rápidas</h2>
                        {recentActivity.map((activity, i) => (
                            <div
                                key={i}
                                className="flex justify-between items-start py-2 border-b border-gray-700 last:border-b-0"
                            >
                                <div className="flex items-start gap-3">
                                    {activity.type === "file" ? (
                                        <FileText className="w-5 h-5 text-amber-300 mt-1" />
                                    ) : activity.type === "calendar" ? (
                                        <Calendar className="w-5 h-5 text-blue-400 mt-1" />
                                    ) : (
                                        <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                                    )}
                                    <p className="text-sm text-gray-800">{activity.text}</p>
                                </div>
                                <p className="text-xs text-gray-800">{activity.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InicialPage;
