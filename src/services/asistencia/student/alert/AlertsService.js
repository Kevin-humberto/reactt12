// src/services/asistencia/student/alert/AlertsService.js

import api from '../../../api';

const API_BASE_URL = '/api/v1/students';
const STUDENT_ID = 6; // Ana Martínez - Reemplazar con auth context

/**
 * 🚨 Obtiene las alertas académicas del estudiante
 * Trae cursos CRÍTICOS y de ALERTA desde el backend
 */
export const getStudentAlerts = async (studentId = STUDENT_ID, period = '2025-I') => {
    try {
        console.log(`📊 Fetching alerts for student ${studentId}...`);
        
        // Obtener dashboard completo con todos los cursos
        const response = await api.get(`${API_BASE_URL}/${studentId}/dashboard`, {
            params: { period }
        });
        
        const dashboard = response.data;
        console.log('✅ Dashboard data received:', dashboard);
        
        // Filtrar cursos por estado
        const allCourses = dashboard.courses;
        const criticalCourses = allCourses.filter(c => c.estado === 'CRÍTICO');
        const warningCourses = allCourses.filter(c => c.estado === 'ALERTA');
        const optimalCourses = allCourses.filter(c => c.estado === 'ÓPTIMO');
        
        // Métricas para las tarjetas superiores
        const metricData = {
            criticas: { 
                count: criticalCourses.length, 
                description: "Cursos en riesgo de desaprobación" 
            },
            advertencias: { 
                count: warningCourses.length, 
                description: "Cursos que requieren atención" 
            },
            notificaciones: { 
                count: criticalCourses.length + warningCourses.length, 
                description: "Alertas enviadas por correo" 
            }
        };
        
        // Formatear alertas críticas
        const criticalAlerts = criticalCourses.map(course => ({
            unidadDidactica: course.courseName,
            codigo: course.ud,
            porcentajeInasistencia: `${(100 - course.percent).toFixed(1)}%`,
            message: `Has superado el 30% de inasistencias. Estás en riesgo de desaprobar el curso por faltas.`,
            totalClases: course.plan,
            totalFaltas: course.f,
            porcentaje: parseFloat(course.percent.replace('%', '')),
            fechaRevision: new Date().toLocaleString('es-PE'),
            courseId: course.courseId,
            // Datos adicionales del curso
            asistencias: course.a,
            tardanzas: course.t,
            justificadas: course.j,
            asistenciasEfectivas: course.asistencias
        }));
        
        // Formatear alertas de advertencia
        const warningAlerts = warningCourses.map(course => ({
            unidadDidactica: course.courseName,
            codigo: course.ud,
            porcentajeInasistencia: `${(100 - parseFloat(course.percent.replace('%', ''))).toFixed(1)}%`,
            message: `Tienes entre 15% y 29.99% de inasistencias. Mantente atento a tu asistencia.`,
            totalClases: course.plan,
            totalFaltas: course.f,
            porcentaje: parseFloat(course.percent.replace('%', '')),
            fechaRevision: new Date().toLocaleString('es-PE'),
            courseId: course.courseId,
            // Datos adicionales
            asistencias: course.a,
            tardanzas: course.t,
            justificadas: course.j,
            asistenciasEfectivas: course.asistencias
        }));
        
        console.log(`🔴 Critical courses: ${criticalCourses.length}`);
        console.log(`🟡 Warning courses: ${warningCourses.length}`);
        console.log(`🟢 Optimal courses: ${optimalCourses.length}`);
        
        return {
            metricData,
            criticalAlerts,
            warningAlerts,
            studentInfo: dashboard.studentInfo,
            allCourses: allCourses // Todos los cursos del semestre
        };
        
    } catch (error) {
        console.error('❌ Error fetching student alerts:', error);
        
        // Retornar estructura vacía en caso de error
        return {
            metricData: {
                criticas: { count: 0, description: "Cursos en riesgo de desaprobación" },
                advertencias: { count: 0, description: "Cursos que requieren atención" },
                notificaciones: { count: 0, description: "Alertas enviadas por correo" }
            },
            criticalAlerts: [],
            warningAlerts: [],
            allCourses: [],
            error: error.message
        };
    }
};

/**
 * 📋 Obtiene solo las alertas críticas (para notificaciones rápidas)
 */
export const getCriticalAlerts = async (studentId = STUDENT_ID, period = '2025-I') => {
    try {
        const data = await getStudentAlerts(studentId, period);
        return data.criticalAlerts;
    } catch (error) {
        console.error('❌ Error fetching critical alerts:', error);
        return [];
    }
};

/**
 * 📊 Obtiene estadísticas de alertas por semestre
 */
export const getAlertStatistics = async (studentId = STUDENT_ID) => {
    try {
        const response = await api.get(`${API_BASE_URL}/${studentId}/alert-statistics`);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching alert statistics:', error);
        return {
            totalAlerts: 0,
            resolvedAlerts: 0,
            activeAlerts: 0
        };
    }
};

export default {
    getStudentAlerts,
    getCriticalAlerts,
    getAlertStatistics
};