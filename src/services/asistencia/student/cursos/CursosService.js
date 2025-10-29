// src/services/asistencia/student/cursos/CursosService.js

import api from '../../../api';

const API_BASE_URL = '/api/v1/students';

// 🔥 ID del estudiante (en producción vendrá del contexto de autenticación)
const STUDENT_ID = 6; // Ana Martínez - 3er Semestre

/**
 * 📊 Obtiene el dashboard completo de cursos del estudiante
 * TRAE TODOS LOS CURSOS MATRICULADOS CON ESTADÍSTICAS REALES DE LA BD
 */
export const getStudentCoursesData = async (studentId = STUDENT_ID, period = '2025-I') => {
    try {
        console.log(`🔄 Fetching courses dashboard for student ${studentId}...`);
        
        const response = await api.get(`${API_BASE_URL}/${studentId}/courses-dashboard`, {
            params: { period }
        });
        
        console.log('✅ Courses dashboard data received:', response.data);
        
        // Transformar datos del backend al formato del frontend
        const backendData = response.data;
        
        // Formatear métricas
        const metricData = {
            'Total Cursos': backendData.metricData.totalCursos,
            'Total Créditos': backendData.metricData.totalCreditos,
            'Asistencia Promedio': backendData.metricData.asistenciaPromedio,
            'Cursos Críticos': backendData.metricData.cursosCriticos
        };
        
        // Formatear cursos
        const courses = backendData.courses.map(course => ({
            id: course.courseId,
            title: course.title,
            codigo: course.codigo,
            docente: course.docente,
            aula: course.aula,
            horario: course.horario,
            creditos: course.creditos,
            asistencia: {
                totalClases: course.asistencia.totalClases,
                asistencias: course.asistencia.asistencias,
                faltas: course.asistencia.faltas,
                tardanzas: course.asistencia.tardanzas,
                justificadas: course.asistencia.justificadas,
                porcentaje: course.asistencia.porcentaje
            },
            proximaClase: course.proximaClase,
            estado: course.estado
        }));
        
        console.log(`📊 Processed ${courses.length} courses`);
        console.log(`📈 Metrics:`, metricData);
        
        return {
            metricData,
            courses,
            studentInfo: backendData.studentInfo
        };
        
    } catch (error) {
        console.error('❌ Error fetching courses dashboard:', error);
        
        // Si hay error, retornar datos vacíos en lugar de romper la app
        return {
            metricData: {
                'Total Cursos': 0,
                'Total Créditos': 0,
                'Asistencia Promedio': '0.0%',
                'Cursos Críticos': 0
            },
            courses: [],
            studentInfo: {
                name: 'Estudiante',
                studentCode: 'N/A',
                career: 'N/A',
                currentSemester: 0
            },
            error: error.message
        };
    }
};

/**
 * 📚 Obtiene solo la lista de cursos matriculados (sin estadísticas)
 * Útil para filtros y dropdowns
 */
export const getEnrolledCourses = async (studentId = STUDENT_ID, period = '2025-I') => {
    try {
        console.log(`🔄 Fetching enrolled courses for student ${studentId}...`);
        
        const response = await api.get(`${API_BASE_URL}/${studentId}/enrolled-courses`, {
            params: { period }
        });
        
        console.log('✅ Enrolled courses received:', response.data);
        
        return response.data;
        
    } catch (error) {
        console.error('❌ Error fetching enrolled courses:', error);
        return [];
    }
};

/**
 * 🔧 Configuración exportada
 */
export const config = {
    API_BASE_URL,
    STUDENT_ID,
    DEFAULT_PERIOD: '2025-I'
};

/**
 * 🎨 Función helper para formatear fechas
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const options = { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    
    return date.toLocaleDateString('es-PE', options).toLowerCase();
};

/**
 * 📊 Función helper para calcular estadísticas adicionales
 */
export const calculateCourseStats = (course) => {
    const { totalClases, asistencias, tardanzas, justificadas } = course.asistencia;
    
    if (totalClases === 0) {
        return {
            inasistenciasPorcentaje: 0,
            riesgoDesaprobacion: false
        };
    }
    
    // Calcular asistencias efectivas (igual que el backend)
    const tardanzasAsAttendance = Math.floor(tardanzas / 3);
    const justificadasAsAttendance = Math.floor(justificadas / 3);
    const asistenciasEfectivas = asistencias + tardanzasAsAttendance + justificadasAsAttendance;
    
    const porcentajeAsistencia = (asistenciasEfectivas / totalClases) * 100;
    const inasistenciasPorcentaje = 100 - porcentajeAsistencia;
    const riesgoDesaprobacion = porcentajeAsistencia < 70;
    
    return {
        inasistenciasPorcentaje: inasistenciasPorcentaje.toFixed(1),
        riesgoDesaprobacion,
        asistenciasEfectivas
    };
};

// Export default
export default {
    getStudentCoursesData,
    getEnrolledCourses,
    calculateCourseStats,
    formatDate,
    config
};
                