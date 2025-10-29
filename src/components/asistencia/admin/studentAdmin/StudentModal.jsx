// src/components/asistencia/admin/studentAdmin/StudentModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../styles/asistencia/admin/studentAdmin/studentManagement.css';

const StudentModal = ({ isOpen, onClose, onSubmit, student, careers }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    address: '',
    birthDate: '',
    careerId: '',
    currentSemester: 1,
    academicStatus: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      // Modo edición - cargar datos existentes
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        dni: student.dni || '',
        phone: student.phone || '',
        address: student.address || '',
        birthDate: student.birthDate || '',
        careerId: student.careerId || '',
        currentSemester: student.currentSemester || 1,
        academicStatus: student.academicStatus || 'active'
      });
    } else {
      // Modo creación - resetear formulario
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        dni: '',
        phone: '',
        address: '',
        birthDate: '',
        careerId: '',
        currentSemester: 1,
        academicStatus: 'active'
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!student) {
      // Solo validar email en modo creación
      if (!formData.email?.trim()) {
        newErrors.email = 'Email es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    }

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Nombre es requerido';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Apellido es requerido';
    }

    if (!formData.dni?.trim()) {
      newErrors.dni = 'DNI es requerido';
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = 'DNI debe tener 8 dígitos';
    }

    if (!formData.careerId) {
      newErrors.careerId = 'Carrera es requerida';
    }

    if (!formData.currentSemester || formData.currentSemester < 1 || formData.currentSemester > 6) {
      newErrors.currentSemester = 'Semestre debe estar entre 1 y 6';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Si es creación, agregar el DNI como contraseña
      const dataToSubmit = student ? formData : {
        ...formData,
        password: formData.dni  // 🔥 La contraseña será el DNI
      };
      
      onSubmit(dataToSubmit);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{student ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          {/* Solo mostrar email en modo creación */}
          {!student && (
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="estudiante@ejemplo.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
        
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>DNI <span className="required">*</span></label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="12345678"
                maxLength="8"
                disabled={student} // No se puede editar en modo edición
                className={errors.dni ? 'error' : ''}
              />
              {errors.dni && <span className="error-message">{errors.dni}</span>}
              
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="999888777"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nombre <span className="required">*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Juan"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label>Apellido <span className="required">*</span></label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Pérez"
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Carrera <span className="required">*</span></label>
              <select
                name="careerId"
                value={formData.careerId}
                onChange={handleChange}
                className={errors.careerId ? 'error' : ''}
              >
                <option value="">Seleccionar carrera</option>
                {careers.map(career => (
                  <option key={career.careerId} value={career.careerId}>
                    {career.name}
                  </option>
                ))}
              </select>
              {errors.careerId && <span className="error-message">{errors.careerId}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Av. Principal 123"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Semestre Actual <span className="required">*</span></label>
              <select
                name="currentSemester"
                value={formData.currentSemester}
                onChange={handleChange}
                className={errors.currentSemester ? 'error' : ''}
              >
                {[1, 2, 3, 4, 5, 6].map(sem => (
                  <option key={sem} value={sem}>{sem}° Semestre</option>
                ))}
              </select>
              {errors.currentSemester && <span className="error-message">{errors.currentSemester}</span>}
            </div>

            <div className="form-group">
              <label>Estado Académico</label>
              <select
                name="academicStatus"
                value={formData.academicStatus}
                onChange={handleChange}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="graduated">Graduado</option>
                <option value="withdrawn">Retirado</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {student ? 'Guardar Cambios' : 'Crear Estudiante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;