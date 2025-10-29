// src/services/asistencia/student/asistencia/attendanceService.js

import api from '../../../api';

const API_BASE_URL = '/api/v1/students';

// 🔥 ID del estudiante (en producción vendrá del contexto de auth)
const STUDENT_ID = 6; // Ana Martínez - 3er Semestre

/**
 * 📊 Obtiene el dashboard completo del estudiante
 * TRAE TODOS LOS 5 CURSOS DEL SEMESTRE ACTUAL
 */
export const getStudentDashboard = async (period = '2025-I') => {
    try {
        const response = await api.get(`${API_BASE_URL}/${STUDENT_ID}/dashboard`, {
            params: { period }
        });
        
        console.log('✅ Dashboard data:', response.data);
        return response.data;
        
    } catch (error) {
        console.error('❌ Error fetching dashboard:', error);
        throw error;
    }
};

/**
 * 📅 Obtiene el historial mensual de asistencias
 */
export const getAttendanceHistory = async (studentId = STUDENT_ID, period = '2025-I', year = 2025) => {
    try {
        const response = await api.get(`${API_BASE_URL}/${studentId}/attendance-history`, {
            params: { period, year }
        });
        
        console.log('✅ Attendance history:', response.data);
        return response.data;
        
    } catch (error) {
        console.error('❌ Error fetching attendance history:', error);
        throw error;
    }
};

/**
 * 📚 Obtiene los cursos del semestre actual
 * TODOS LOS 5 CURSOS DEL PLAN DE ESTUDIOS
 */
export const getStudentCourses = async (period = '2025-I') => {
    try {
        const response = await api.get(`${API_BASE_URL}/${STUDENT_ID}/courses`, {
            params: { period }
        });
        
        console.log('✅ Courses data:', response.data);
        
        // Agregar opción "Todos los cursos"
        return [
            { courseId: 'all', code: 'ALL', name: 'Todos los cursos', label: 'Todos los cursos' },
            ...response.data
        ];
        
    } catch (error) {
        console.error('❌ Error fetching courses:', error);
        return [{ courseId: 'all', code: 'ALL', name: 'Todos los cursos', label: 'Todos los cursos' }];
    }
};

/**
 * 📋 Obtiene el header info del estudiante
 */
export const getStudentHeaderInfo = async (period = '2025-I') => {
    try {
        const dashboard = await getStudentDashboard(period);
        
        return {
            name: dashboard.studentInfo.name,
            lastUpdated: dashboard.lastUpdated,
            overallStatus: dashboard.summary.overallStatus,
            currentSemester: dashboard.studentInfo.currentSemester
        };
        
    } catch (error) {
        console.error('❌ Error fetching header info:', error);
        return {
            name: 'ESTUDIANTE',
            lastUpdated: new Date().toLocaleDateString('es-PE'),
            overallStatus: 'OPTIMO',
            currentSemester: 3
        };
    }
};

/**
 * 📊 Obtiene los registros de asistencia filtrados
 */
export const fetchAttendanceRecords = async (filters = {}) => {
    try {
        const dashboard = await getStudentDashboard(filters.period || '2025-I');
        
        let courses = dashboard.courses;
        
        // Filtrar por curso si es necesario
        if (filters.courseId && filters.courseId !== 'all') {
            courses = courses.filter(c => c.courseId === parseInt(filters.courseId));
        }
        
        console.log('✅ Filtered attendance records:', courses);
        console.log('📊 Total cursos mostrados:', courses.length);
        
        return courses;
        
    } catch (error) {
        console.error('❌ Error fetching attendance records:', error);
        return [];
    }
};

/**
 * 📈 Obtiene el resumen del semestre
 */
export const getSemesterSummary = async (period = '2025-I') => {
    try {
        const dashboard = await getStudentDashboard(period);
        
        return {
            enrolledCourses: dashboard.summary.enrolledCourses,
            scheduledClasses: dashboard.summary.scheduledClasses,
            generalAttendance: dashboard.summary.generalAttendance
        };
        
    } catch (error) {
        console.error('❌ Error fetching summary:', error);
        return {
            enrolledCourses: 0,
            scheduledClasses: 0,
            generalAttendance: '0.00'
        };
    }
};

/**
 * 📋 Obtiene las faltas sin justificar del estudiante
 */
export const getUnjustifiedAbsences = async (studentId = STUDENT_ID) => {
    try {
        const response = await api.get(`${API_BASE_URL}/${studentId}/unjustified-absences`);
        
        console.log('✅ Unjustified absences:', response.data);
        
        // Formatear datos para el dropdown del formulario
        return response.data.map(absence => ({
            attendanceId: absence.attendanceId,
            courseName: absence.courseName,
            courseCode: absence.courseCode,
            classDate: absence.classDate,
            classTime: absence.classTime,
            label: `${absence.courseName} - ${absence.classDate}`
        }));
        
    } catch (error) {
        console.error('❌ Error fetching unjustified absences:', error);
        throw error;
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