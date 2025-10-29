// src/services/asistencia/student/justificacion/JustificationBatchService.js

import api from '../../../api';

const API_BASE_URL = '/api/v1/justification-batches';

class JustificationBatchService {
  
  // ========================================
  // GET: Listar todos los batches
  // ========================================
  static async getAllBatches(params = {}) {
    try {
      const response = await api.get(API_BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching batches:', error);
      throw this.handleError(error);
    }
  }

  // ========================================
  // GET: Batches por estudiante
  // ========================================
  static async getBatchesByStudent(studentId) {
    try {
      const response = await api.get(`${API_BASE_URL}/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching batches for student ${studentId}:`, error);
      throw this.handleError(error);
    }
  }

  // ========================================
  // GET: Obtener detalles de un batch
  // ========================================
  static async getBatchDetails(batchId) {
    try {
      const response = await api.get(`${API_BASE_URL}/${batchId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching batch ${batchId}:`, error);
      throw this.handleError(error);
    }
  }

  // ========================================
  // POST: Crear nuevo batch (TRANSACCIÓN)
  // ========================================
  static async createBatch(batchData) {
    try {
      const response = await api.post(API_BASE_URL, batchData);
      return response.data;
    } catch (error) {
      console.error('Error creating batch:', error);
      throw this.handleError(error);
    }
  }

  // ========================================
  // PUT: Revisar batch completo
  // ========================================
  static async reviewBatch(batchId, reviewData) {
    try {
      const response = await api.put(`${API_BASE_URL}/${batchId}/review`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Error reviewing batch ${batchId}:`, error);
      throw this.handleError(error);
    }
  }

  // ========================================
  // PATCH: Cancelar batch
  // ========================================
  static async cancelBatch(batchId) {
    try {
      const response = await api.patch(`${API_BASE_URL}/${batchId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling batch ${batchId}:`, error);
      throw this.handleError(error);
    }
  }

  // ========================================
  // GET: Batches pendientes
  // ========================================
  static async getPendingBatches() {
    try {
      const response = await api.get(`${API_BASE_URL}/pending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending batches:', error);
      throw this.handleError(error);
    }
  }

  // ========================================
  // GET: Estadísticas de batches
  // ========================================
  static async getBatchStatistics(period = null) {
    try {
      const params = period ? { period } : {};
      const response = await api.get(`${API_BASE_URL}/stats`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching batch statistics:', error);
      throw this.handleError(error);
    }
  }

  // ========================================
  // Transformar batch del backend al frontend
  // ========================================
  static formatBatchForDisplay(batch) {
    const statusMap = {
      'pending': 'Pendiente',
      'approved': 'Aprobado',
      'partial': 'Parcial',
      'rejected': 'Rechazado'
    };

    const categoryMap = {
      'medical': 'Médica',
      'personal': 'Personal',
      'family': 'Familiar',
      'academic': 'Académica',
      'emergency': 'Emergencia'
    };

    return {
      id: batch.batchId,
      studentId: batch.studentId,
      studentName: batch.studentName,
      studentCode: batch.studentCode,
      fechaEnvio: this.formatDateTime(batch.submissionDate),
      categoria: categoryMap[batch.reasonCategory] || batch.reasonCategory,
      categoriaRaw: batch.reasonCategory,
      descripcionGeneral: batch.generalDescription,
      tipoDocumento: batch.documentType,
      archivoAdjunto: batch.attachmentPath,
      totalFaltas: batch.totalAbsences,
      estado: statusMap[batch.approvalStatus] || batch.approvalStatus,
      estadoRaw: batch.approvalStatus,
      dentroPlazo: batch.within48Hours === 'Y',
      revisadoPor: batch.reviewedBy,
      revisorEmail: batch.reviewerEmail,
      fechaRevision: batch.reviewDate ? this.formatDateTime(batch.reviewDate) : null,
      comentariosRevision: batch.reviewComments,
      fechaCreacion: this.formatDateTime(batch.createdAt)
    };
  }

  // ========================================
  // Transformar datos del formulario al backend
  // ========================================
  static formatBatchForBackend(formData) {
    return {
      studentId: parseInt(formData.studentId),
      reasonCategory: formData.categoria,
      generalDescription: formData.descripcion,
      attendanceIds: formData.faltasSeleccionadas.map(id => parseInt(id)),
      documentType: formData.tipoDocumento || null,
      attachmentPath: formData.archivoNombre || null
    };
  }

  // ========================================
  // Utilidades
  // ========================================
  static formatDate(isoDate) {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static formatDateTime(isoDateTime) {
    if (!isoDateTime) return 'N/A';
    const date = new Date(isoDateTime);
    return date.toLocaleString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  static handleError(error) {
    if (error.response) {
      const message = error.response.data?.error || 
                     error.response.data?.detail || 
                     error.response.data?.message || 
                     'Error en el servidor';
      return new Error(message);
    } else if (error.request) {
      return new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    } else {
      return new Error(error.message || 'Error desconocido');
    }
  }

  static getBatchStats(batches) {
    const total = batches.length;
    const pendientes = batches.filter(b => b.estadoRaw === 'pending').length;
    const aprobados = batches.filter(b => b.estadoRaw === 'approved').length;
    const parciales = batches.filter(b => b.estadoRaw === 'partial').length;
    const rechazados = batches.filter(b => b.estadoRaw === 'rejected').length;
    const dentroPlazo = batches.filter(b => b.dentroPlazo).length;

    return {
      total,
      pendientes,
      aprobados,
      parciales,
      rechazados,
      dentroPlazo,
      fueraPlazo: total - dentroPlazo,
      tasaAprobacion: total > 0 ? ((aprobados / total) * 100).toFixed(1) : 0,
      promFaltasPorBatch: total > 0 ? (batches.reduce((sum, b) => sum + b.totalFaltas, 0) / total).toFixed(1) : 0
    };
  }

  // ========================================
  // Validaciones
  // ========================================
  static validateBatchData(formData) {
    const errors = [];

    if (!formData.studentId) {
      errors.push('El ID del estudiante es requerido');
    }

    if (!formData.categoria) {
      errors.push('La categoría es requerida');
    }

    if (!formData.descripcion || formData.descripcion.trim().length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (!formData.faltasSeleccionadas || formData.faltasSeleccionadas.length === 0) {
      errors.push('Debes seleccionar al menos una falta');
    }

    if (formData.faltasSeleccionadas && formData.faltasSeleccionadas.length > 10) {
      errors.push('No puedes justificar más de 10 faltas a la vez');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ========================================
  // Obtener icono según categoría
  // ========================================
  static getCategoryIcon(category) {
    const icons = {
      'medical': '🏥',
      'personal': '👤',
      'family': '👨‍👩‍👧‍👦',
      'academic': '📚',
      'emergency': '🚨'
    };
    return icons[category] || '📋';
  }

  // ========================================
  // Obtener color según estado
  // ========================================
  static getStatusColor(status) {
    const colors = {
      'pending': 'yellow',
      'approved': 'green',
      'partial': 'blue',
      'rejected': 'red'
    };
    return colors[status] || 'gray';
  }
}

export default JustificationBatchService;