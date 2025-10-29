import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, ChevronDown, Plus, Edit2, Trash2, UserX, UserCheck,
    BookOpen, TriangleAlert, X, Phone, Mail, FileText, Calendar,
    ShieldCheck, GraduationCap
} from 'lucide-react';
import Swal from "sweetalert2";
import * as teacherService from '../../services/teacher/teacherService';

// --- Datos iniciales para Maestros ---
const initialTeacherStats = {
    total: { title: 'Total de Maestros', count: 0, color: 'border-purple-600', iconColor: 'text-purple-400', bgColor: 'bg-purple-900/20', icon: BookOpen, key: 'totalTeachers' },
    active: { title: 'Activos', count: 0, color: 'border-green-600', iconColor: 'text-green-400', bgColor: 'bg-green-900/20', icon: ShieldCheck, key: 'active' },
    inactive: { title: 'Inactivos', count: 0, color: 'border-red-600', iconColor: 'text-red-400', bgColor: 'bg-red-900/20', icon: TriangleAlert, key: 'inactive' },
};

const StatCard = ({ title, count, color, iconColor, bgColor, icon: Icon }) => (
    <div className={`flex flex-col p-4 sm:p-5 ${bgColor} border-2 ${color} rounded-xl shadow-lg`}>
        <div className="flex justify-between items-start">
            <div>
                <span className="text-2xl font-bold text-white">{count}</span>
                <span className="block text-sm text-gray-200">{title}</span>
            </div>
            <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
    </div>
);

const StateChip = ({ state }) => (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-md ${state === 'active' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>
        {state === 'active' ? 'Activo' : 'Inactivo'}
    </span>
);

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        // Asegura que sea un objeto Date si viene como string
        const date = dateString instanceof Date ? dateString : new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric', month: 'numeric', day: 'numeric'
        });
    } catch (e) {
        return '-';
    }
};

// Componente Fila de Maestro (TeacherRow) 
const TeacherRow = ({ teacher, toggleTeacherState, onEdit, onDelete }) => {
    const isInactive = teacher.status === 'inactive';
    const ActionIcon = isInactive ? UserCheck : UserX;
    const actionColor = isInactive ? 'text-green-400' : 'text-red-600';
    const buttonBase = "p-2 rounded-md bg-slate-500/80 hover:bg-slate-600/90";

    return (
        <tr className="border-b border-gray-400/50 hover:bg-slate-400/50">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-sm text-white">
                        {teacher.firstName?.slice(0, 1).toUpperCase()}{teacher.lastName?.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{`${teacher.firstName} ${teacher.lastName}`}</p>
                        <p className="text-xs text-gray-600">{teacher.institutionalEmail}</p>
                    </div>
                </div>
            </td>
            <td className="p-4 text-gray-800 font-mono text-sm">{teacher.teacherCode}</td>
            <td className="p-4 text-gray-800 text-sm">{teacher.dni}</td>
            <td className="p-4 text-gray-800 text-sm">{teacher.specialty}</td>
            <td className="p-4 text-gray-800 text-sm">{teacher.academicDegree}</td>
            <td className="p-4 text-sm text-gray-700">{formatDate(teacher.hireDate)}</td>
            <td className="p-4"><StateChip state={teacher.status} /></td>
            <td className="p-4">
                <div className="flex space-x-2">
                    <button className={`${buttonBase} text-blue-600`} onClick={() => onEdit(teacher)} title="Editar">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        className={`${buttonBase} ${actionColor}`}
                        onClick={() => toggleTeacherState(teacher.teacherId, isInactive)}
                        title={isInactive ? "Activar" : "Desactivar"}>
                        <ActionIcon className="w-4 h-4" />
                    </button>
                    <button
                        className={`${buttonBase} text-red-600`}
                        onClick={() => onDelete(teacher.teacherId)}
                        title="Eliminar permanentemente">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

// --- Modal Formulario de Maestro (TeacherFormModal) ---
const TeacherFormModal = ({ teacherData, onClose, onSave }) => {
    const [form, setForm] = useState(teacherData || {
        userId: '',
        teacherCode: '',
        firstName: '',
        lastName: '',
        dni: '',
        phone: '',
        institutionalEmail: '',
        specialty: '',
        academicDegree: '',
        hireDate: new Date().toISOString().substring(0, 10),
        status: 'active'
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSave = {
            ...form,
            hireDate: form.hireDate
        };
        await onSave(dataToSave);
        onClose();
    };

    const isEdit = !!teacherData;
    const commonInputClasses = "w-full p-2 border rounded-md focus:ring focus:ring-purple-400 text-gray-900 bg-white";

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                    {isEdit ? 'Editar Maestro' : 'Crear Maestro'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-4">
                    {/* Primera Columna */}
                    <div>
                        <label className="block text-sm font-medium mb-1">ID de Usuario (Existente)</label>
                        <input type="number" name="userId" value={form.userId} onChange={handleChange} required={!isEdit} disabled={isEdit}
                            className={`${commonInputClasses} ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`} placeholder="Ej: 62" />
                        {!isEdit && <p className="text-xs text-gray-500 mt-1">Debe ser un ID de Usuario existente con rol 'teacher'.</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Código de Docente</label>
                        <input type="text" name="teacherCode" value={form.teacherCode} onChange={handleChange} required
                            className={commonInputClasses} placeholder="Ej: T-00101" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombres</label>
                        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required
                            className={commonInputClasses} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Apellidos</label>
                        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required
                            className={commonInputClasses} />
                    </div>

                    {/* Segunda Columna */}
                    <div>
                        <label className="block text-sm font-medium mb-1">DNI</label>
                        <input type="text" name="dni" value={form.dni} onChange={handleChange} required
                            className={commonInputClasses} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Teléfono</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                            className={commonInputClasses} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Institucional</label>
                        <input type="email" name="institutionalEmail" value={form.institutionalEmail} onChange={handleChange} required
                            className={commonInputClasses} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Especialidad</label>
                        <input type="text" name="specialty" value={form.specialty} onChange={handleChange} required
                            className={commonInputClasses} />
                    </div>

                    {/* Tercera Fila - Span 2 Col */}
                    <div className='col-span-2 grid grid-cols-3 gap-4'>
                        <div>
                            <label className="block text-sm font-medium mb-1">Grado Académico</label>
                            <input type="text" name="academicDegree" value={form.academicDegree} onChange={handleChange}
                                className={commonInputClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Fecha Contratación</label>
                            <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange} required
                                className={commonInputClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Estado</label>
                            <select name="status" value={form.status} onChange={handleChange}
                                className={commonInputClasses}>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    {/* Botón de Guardar */}
                    <div className="col-span-2 pt-4">
                        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors">
                            {isEdit ? 'Actualizar Maestro' : 'Crear Maestro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Componente Principal (TeacherManagementPage) ---
const TeacherManagementPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [stats, setStats] = useState(initialTeacherStats);
    const [searchTerm, setSearchTerm] = useState('');
    const [stateFilter, setStateFilter] = useState('Todos');
    const [showForm, setShowForm] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // Recalcula estadísticas locales
    const fetchStats = useCallback(() => {
        const activeCount = teachers.filter(t => t.status === 'active').length;
        const inactiveCount = teachers.filter(t => t.status === 'inactive').length;
        const totalCount = teachers.length;

        setStats(prevStats => ({
            ...prevStats,
            total: { ...prevStats.total, count: totalCount },
            active: { ...prevStats.active, count: activeCount },
            inactive: { ...prevStats.inactive, count: inactiveCount },
        }));
    }, [teachers]);

    // Obtiene la lista de maestros desde la API
    const fetchTeachers = useCallback(async () => {
        try {
            const params = stateFilter !== 'Todos' ? { status: stateFilter } : {};
            const data = await teacherService.getTeachers(params);
            setTeachers(data);
        } catch (e) {
            console.error("Error al obtener maestros:", e);
            Swal.fire({
                icon: "error",
                title: "Error al cargar maestros",
                text: "No se pudieron obtener los datos de los maestros.",
                confirmButtonColor: "#7c3aed",
            });
        }
    }, [stateFilter]);

    // Actualiza estadísticas cuando cambia la lista
    useEffect(() => {
        if (teachers.length > 0 || stateFilter === 'Todos') fetchStats();
    }, [teachers, fetchStats, stateFilter]);

    // Carga inicial
    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    // Cambiar estado (activar/desactivar)
    const toggleTeacherState = async (id, isInactive) => {
        try {
            if (isInactive) {
                await teacherService.restoreTeacher(id);
                Swal.fire({
                    icon: "success",
                    title: "Maestro restaurado",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                await teacherService.deactivateTeacher(id);
                Swal.fire({
                    icon: "info",
                    title: "Maestro desactivado",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
            await fetchTeachers();
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Error al cambiar estado",
                text: e.message || "No se pudo cambiar el estado del maestro.",
                confirmButtonColor: "#7c3aed",
            });
        }
    };

    // Crear o actualizar maestro
    const handleSaveTeacher = async (form) => {
        try {
            if (form.teacherId) {
                await teacherService.updateTeacher(form.teacherId, form);
                Swal.fire({
                    icon: "success",
                    title: "Maestro actualizado correctamente",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                await teacherService.createTeacher(form);
                Swal.fire({
                    icon: "success",
                    title: "Maestro creado correctamente",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
            await fetchTeachers();
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Error al guardar maestro",
                text: e.message || JSON.stringify(e),
                confirmButtonColor: "#7c3aed",
            });
        }
    };

    // Eliminar físicamente
    const handleDeleteTeacher = async (teacherId) => {
        const result = await Swal.fire({
            title: "¿Eliminar maestro?",
            text: "Esta acción eliminará al maestro de forma permanente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (!result.isConfirmed) return;

        try {
            await teacherService.deleteTeacher(teacherId);
            Swal.fire({
                icon: "success",
                title: "Maestro eliminado permanentemente",
                showConfirmButton: false,
                timer: 1500,
            });
            await fetchTeachers();
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Error al eliminar maestro",
                text: e.message || JSON.stringify(e),
                confirmButtonColor: "#7c3aed",
            });
        }
    };
    // Opciones de estado
    const getStateOptions = () => ["Todos", "active", "inactive"];

    // Filtro de búsqueda
    const finalFiltered = teachers.filter(t =>
        t.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.teacherCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.dni?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Estilos reutilizados
    const inputClasses = "pl-10 pr-3 py-2 w-full rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:ring-1 focus:ring-purple-500";
    const selectClasses = "appearance-none w-full p-2 border rounded-md bg-gray-800 text-gray-200 border-gray-700 focus:ring-1 focus:ring-purple-500";

    // Renderizado principal
    return (
        <div className="min-h-screen bg-gray-800 p-4 sm:p-8 font-inter">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Maestros</h1>
                <p className="text-gray-400 mt-1">Administra los docentes del sistema y su información detallada.</p>
            </header>

            {/* Tarjetas de Estadística */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {Object.values(stats).map(s => <StatCard key={s.title} {...s} />)}
            </div>

            {/* Filtros y Búsqueda */}
            <div className="bg-slate-300 p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtros y Búsqueda</h2>
                <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-semibold text-gray-800 mb-1">Buscar</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Nombre, código o DNI..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    <div className="relative w-full md:w-48">
                        <label className="block text-sm font-semibold text-gray-800 mb-1">Estado</label>
                        <select
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            className={selectClasses}
                        >
                            {getStateOptions().map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 mt-2.5 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    <div className="w-full md:w-auto mt-7 md:mt-0">
                        <button
                            onClick={() => { setSelectedTeacher(null); setShowForm(true); }}
                            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-md shadow-lg shadow-purple-500/30 transition-colors w-full md:w-auto"
                        >
                            <Plus className="w-4 h-4" /> Crear Nuevo Maestro
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de Maestros */}
            <div className="bg-slate-300 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Lista de Maestros</h2>
                    <p className="text-sm text-gray-700">{finalFiltered.length} maestros encontrados</p>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-400">
                    <table className="min-w-full table-auto">
                        <thead className="bg-slate-400 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold min-w-[250px]">Nombre / Email</th>
                                <th className="px-4 py-3 text-left font-semibold min-w-[100px]">Código</th>
                                <th className="px-4 py-3 text-left font-semibold min-w-[100px]">DNI</th>
                                <th className="px-4 py-3 text-left font-semibold min-w-[150px]">Especialidad</th>
                                <th className="px-4 py-3 text-left font-semibold min-w-[150px]">Grado Académico</th>
                                <th className="px-4 py-3 text-left font-semibold min-w-[120px]">F. Contratación</th>
                                <th className="px-4 py-3 text-left font-semibold min-w-[100px]">Estado</th>
                                <th className="px-4 py-3 text-left font-semibold min-w-[120px]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalFiltered.length > 0 ? finalFiltered.map(t => (
                                <TeacherRow
                                    key={t.teacherId}
                                    teacher={t}
                                    toggleTeacherState={toggleTeacherState}
                                    onEdit={(tch) => { setSelectedTeacher(tch); setShowForm(true); }}
                                    onDelete={handleDeleteTeacher}
                                />
                            )) : (
                                <tr><td colSpan="8" className="p-6 text-center text-gray-600">No se encontraron maestros.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de formulario */}
            {showForm && (
                <TeacherFormModal
                    teacherData={selectedTeacher}
                    onClose={() => setShowForm(false)}
                    onSave={handleSaveTeacher}
                />
            )}
        </div>
    );
};

export default TeacherManagementPage;