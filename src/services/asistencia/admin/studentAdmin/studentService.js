// src/services/asistencia/admin/studentAdmin/studentService.js
import api from '../../../api';

const BASE_URL = '/api/v1/students';

// 📊 Obtener estadísticas de estudiantes
export const getStudentStats = async () => {
  try {
    const response = await api.get(`${BASE_URL}`);
    const students = response.data;
    
    return {
      total: students.length,
      active: students.filter(s => s.academicStatus === 'active').length,
      inactive: students.filter(s => s.academicStatus === 'inactive').length,
      graduated: students.filter(s => s.academicStatus === 'graduated').length,
      withdrawn: students.filter(s => s.academicStatus === 'withdrawn').length
    };
  } catch (error) {
    console.error('❌ Error fetching student stats:', error);
    throw error;
  }
};

// 📋 Listar estudiantes con filtros
export const getStudents = async (filters = {}) => {
  try {
    const params = {
      skip: filters.skip || 0,
      limit: filters.limit || 100,
      ...(filters.careerId && { careerId: filters.careerId }),
      ...(filters.semester && { semester: filters.semester }),
      ...(filters.status && { status: filters.status })
    };

    const response = await api.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching students:', error);
    throw error;
  }
};

// 🔍 Obtener estudiante por ID
export const getStudentById = async (studentId) => {
  try {
    const response = await api.get(`${BASE_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching student ${studentId}:`, error);
    throw error;
  }
};

// ➕ Crear nuevo estudiante
export const createStudent = async (studentData) => {
  try {
    const response = await api.post(BASE_URL, studentData);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating student:', error);
    throw error;
  }
};

// ✏️ Actualizar estudiante
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await api.put(`${BASE_URL}/${studentId}`, studentData);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating student ${studentId}:`, error);
    throw error;
  }
};

// 🗑️ Eliminación lógica (desactivar)
export const deactivateStudent = async (studentId) => {
  try {
    const response = await api.patch(`${BASE_URL}/${studentId}/delete`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error deactivating student ${studentId}:`, error);
    throw error;
  }
};

// 🔄 Restaurar estudiante
export const restoreStudent = async (studentId) => {
  try {
    const response = await api.patch(`${BASE_URL}/${studentId}/restore`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error restoring student ${studentId}:`, error);
    throw error;
  }
};

// 🎓 Obtener carreras (para el dropdown)
export const getCareers = async () => {
  try {
    const response = await api.get('/api/v1/careers');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching careers:', error);
    throw error;
  }
};