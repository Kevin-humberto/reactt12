import API from '../user/api'; 

const TEACHER_ENDPOINT = '/teachers';

export const getTeachers = async (params = {}) => {
    try {
        const response = await API.get(TEACHER_ENDPOINT, { params });
        return response.data; 
    } catch (error) {
        throw error.response?.data || error;
    }
};

// FUNCIÓN AÑADIDA: Obtiene los conteos totales, activos e inactivos.
export const getTeacherStatusCounts = async () => {
    try {
        const allTeachers = await getTeachers(); 
        
        // 2. Calcular los conteos
        const total = allTeachers.length;
        const active = allTeachers.filter(t => t.status === 'active').length;
        const inactive = allTeachers.filter(t => t.status === 'inactive').length;
        
        return { total, active, inactive };
    } catch (error) {
        console.error("Error en getTeacherStatusCounts:", error);
        return { total: 0, active: 0, inactive: 0 }; 
    }
};


// Obtiene solo la lista de maestros con estado ACTIVO.
export const getActiveTeachersList = async () => {
    const params = { status: 'active' };
    try {
        return await getTeachers(params);
    } catch (error) {
        throw error;
    }
};

// Obtiene un maestro por su ID.
export const getTeacherById = async (teacherId) => {
    try {
        const response = await API.get(`${TEACHER_ENDPOINT}/${teacherId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Crea un nuevo maestro.
export const createTeacher = async (teacherData) => {
    try {
        const response = await API.post(`${TEACHER_ENDPOINT}`, teacherData);
        return response.data;
    } catch (error) {
        console.error("Error en createTeacher:", error);
        throw error.response?.data || error;
    }
};

// Actualiza la información de un maestro existente.
export const updateTeacher = async (teacherId, updateData) => {
    try {
        // Excluir campos no editables antes de enviar
        const { teacherId: _, teacherCode, createdAt, ...allowedData } = updateData;
        const response = await API.put(`${TEACHER_ENDPOINT}/${teacherId}`, allowedData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar maestro:", error);
        throw error.response?.data || error;
    }
};

// Desactiva (eliminación lógica) un maestro.
export const deactivateTeacher = async (teacherId) => {
    try {
        const response = await API.patch(`${TEACHER_ENDPOINT}/${teacherId}/delete`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Restaura un maestro previamente desactivado.
export const restoreTeacher = async (teacherId) => {
    try {
        const response = await API.patch(`${TEACHER_ENDPOINT}/${teacherId}/restore`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Eliminar físicamente un profesor
export const deleteTeacher = async (teacherId) => {
    try {
        const response = await API.delete(`${TEACHER_ENDPOINT}/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error("Error en deleteTeacher:", error);
        throw error.response?.data || error;
    }
};