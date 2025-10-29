// src/components/asistencia/student/justificacion/NewJustificationForm.jsx

import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import JustificacionService from '../../../../services/asistencia/student/justificacion/JustificacionService';
import { getUnjustifiedAbsences } from '../../../../services/asistencia/student/asistencia/attendanceService';

const NewJustificationSection = ({ isVisible, onClose, onSuccess }) => {

  const [formData, setFormData] = useState({
    attendanceId: '',
    motivo: '',
    descripcion: '',
    archivo: null
  });

  const [fileName, setFileName] = useState('Sin archivos seleccionados');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [availableAbsences, setAvailableAbsences] = useState([]);
  const [loadingAbsences, setLoadingAbsences] = useState(false);


  useEffect(() => {
    if (isVisible) {
      fetchAvailableAbsences();
    }
  }, [isVisible]);

  const fetchAvailableAbsences = async () => {
    setLoadingAbsences(true);
    setError(null);
    try {
      const studentId = 6; 
      
      console.log('🔍 Fetching absences for student:', studentId); 
      
      const absences = await getUnjustifiedAbsences(studentId);
      
      console.log('📦 Absences received:', absences); 
      console.log('📊 Total absences:', absences.length); 
      
      setAvailableAbsences(absences);
      
      if (absences.length === 0) {
        setError('No tienes faltas pendientes de justificar');
      }
    } catch (err) {
      console.error('❌ Error loading absences:', err);
      console.error('❌ Full error:', JSON.stringify(err, null, 2)); 
      setError('Error al cargar las faltas disponibles');
    } finally {
      setLoadingAbsences(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
   
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo no debe superar los 5MB');
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        setError('Formato de archivo no permitido. Use PDF, JPG, PNG, DOC o DOCX');
        return;
      }

      setFileName(file.name);
      setFormData(prev => ({
        ...prev,
        archivo: file,
        attachmentFileName: file.name
      }));
      setError(null);
    } else {
      handleRemoveFile();
    }
  };

  const handleRemoveFile = () => {
    setFileName('Sin archivos seleccionados');
    setFormData(prev => ({
      ...prev,
      archivo: null,
      attachmentFileName: null
    }));
    document.getElementById('file-upload').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {

      if (!formData.attendanceId) {
        throw new Error('Debes seleccionar una falta para justificar');
      }

      if (!formData.motivo.trim()) {
        throw new Error('El motivo es obligatorio');
      }

      if (formData.motivo.length > 500) {
        throw new Error('El motivo no debe superar los 500 caracteres');
      }


      const justificationData = JustificacionService.formatJustificationForBackend(formData);

      console.log('📤 Enviando justificación:', justificationData);

      const response = await JustificacionService.createJustification(justificationData);
      
      console.log('✅ Justificación creada:', response);
      setSuccess(true);

      setFormData({
        attendanceId: '',
        motivo: '',
        descripcion: '',
        archivo: null,
        attachmentFileName: null
      });
      setFileName('Sin archivos seleccionados');
      document.getElementById('file-upload').value = '';


      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (err) {
      setError(err.message || 'Error al enviar la justificación');
      console.error('❌ Error submitting justification:', err);
    } finally {
      setLoading(false);
    }
  };


  if (!isVisible) return null;

  return (
    <div className="mb-6">
      
      {/* ALERTA DE PLAZO - Paleta actualizada */}
      <div 
        className="p-4 mb-6 rounded-lg shadow-md flex items-start text-sm"
        style={{
          backgroundColor: '#ca8a04',
          color: '#fff',
          border: '2px solid #a16207'
        }}
      >
        <ExclamationTriangleIcon className="w-5 h-5 mr-3 mt-0.5 min-w-5" style={{ color: '#fff' }} />
        <p style={{ fontWeight: 600 }}>
          <strong style={{ fontWeight: 800 }}>Importante:</strong> Las justificaciones deben enviarse dentro de las 48 horas posteriores a la falta. 
          Después de este plazo, no serán consideradas válidas.
        </p>
      </div>

      {/* MENSAJES DE ERROR - Paleta actualizada */}
      {error && (
        <div 
          className="px-4 py-3 rounded-lg mb-4 flex items-start"
          style={{
            backgroundColor: '#dc2626',
            border: '2px solid #ef4444',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
          }}
        >
          <XMarkIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <p style={{ fontWeight: 700 }}>{error}</p>
        </div>
      )}

      {/* MENSAJES DE ÉXITO - Paleta actualizada */}
      {success && (
        <div 
          className="px-4 py-3 rounded-lg mb-4"
          style={{
            backgroundColor: '#16a34a',
            border: '2px solid #15803d',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.4)'
          }}
        >
          <p style={{ fontWeight: 700 }}>✓ Justificación enviada exitosamente</p>
        </div>
      )}

      {/* FORMULARIO - Paleta actualizada */}
      <div 
        className="p-6 rounded-lg shadow-xl"
        style={{
          backgroundColor: '#cbd5e1',
          border: '2px solid #94a3b8'
        }}
      >
        
        <h2 
          className="text-xl mb-1"
          style={{
            fontWeight: 800,
            color: '#0f172a',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
            letterSpacing: '-0.01em'
          }}
        >
          Nueva Justificación
        </h2>
        <p 
          className="text-sm mb-6 pb-4"
          style={{
            color: '#334155',
            fontWeight: 600,
            borderBottom: '2px solid #94a3b8'
          }}
        >
          Completa todos los campos obligatorios (*)
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* Seleccionar Falta */}
          <div className="mb-6">
            <label 
              className="block text-sm mb-2"
              style={{
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Seleccionar Falta a Justificar *
            </label>
            
            {loadingAbsences ? (
              <div 
                className="rounded-lg p-3"
                style={{
                  backgroundColor: '#fff',
                  color: '#334155',
                  border: '2px solid #94a3b8',
                  fontWeight: 600
                }}
              >
                Cargando faltas disponibles...
              </div>
            ) : availableAbsences.length === 0 ? (
              <div 
                className="rounded-lg p-3"
                style={{
                  backgroundColor: '#fff',
                  color: '#334155',
                  border: '2px solid #94a3b8',
                  fontWeight: 600
                }}
              >
                {error || 'No tienes faltas pendientes de justificar'}
              </div>
            ) : (
              <select
                name="attendanceId"
                value={formData.attendanceId}
                onChange={handleChange}
                required
                className="w-full rounded-lg p-3 cursor-pointer transition"
                style={{
                  backgroundColor: '#fff',
                  color: '#0f172a',
                  border: '2px solid #94a3b8',
                  fontWeight: 600
                }}
              >
                <option value="">-- Selecciona la falta --</option>
                {availableAbsences.map(absence => (
                  <option key={absence.attendanceId} value={absence.attendanceId}>
                    {absence.courseName} - {JustificacionService.formatDate(absence.classDate)} 
                    {absence.classTime && ` (${new Date(absence.classTime).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })})`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Motivo */}
          <div className="mb-6">
            <label 
              className="block text-sm mb-2"
              style={{
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Motivo de la Justificación *
            </label>
            <input
              type="text"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              required
              maxLength={500}
              placeholder="Ej: Cita médica, emergencia familiar..."
              className="w-full rounded-lg p-3 transition"
              style={{
                backgroundColor: '#fff',
                color: '#0f172a',
                border: '2px solid #94a3b8',
                fontWeight: 600
              }}
            />
            <p 
              className="text-xs mt-1"
              style={{
                color: '#64748b',
                fontWeight: 600
              }}
            >
              {formData.motivo.length}/500 caracteres
            </p>
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <label 
              className="block text-sm mb-2"
              style={{
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Descripción Detallada (Opcional)
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder="Describe detalladamente el motivo de tu falta..."
              className="w-full rounded-lg p-3 resize-none transition"
              style={{
                backgroundColor: '#fff',
                color: '#0f172a',
                border: '2px solid #94a3b8',
                fontWeight: 600
              }}
            ></textarea>
          </div>

          {/* Archivo */}
          <div className="mb-8">
            <label 
              className="block text-sm mb-2"
              style={{
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Evidencia (Opcional)
            </label>
            
            <div className="flex items-center space-x-3">
              <label
                htmlFor="file-upload"
                className="font-semibold py-2 px-4 rounded-lg cursor-pointer transition duration-200 flex items-center"
                style={{
                  backgroundColor: '#64748b',
                  color: '#fff',
                  fontWeight: 800,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
              >
                <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                Seleccionar archivo
              </label>
              
              {formData.archivo && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 rounded-lg transition duration-200"
                  title="Eliminar archivo"
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#fff',
                    border: '2px solid #b91c1c',
                    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}

              <input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="mt-2 flex items-center space-x-2">
              <span 
                className="text-sm italic"
                style={{
                  color: formData.archivo ? '#16a34a' : '#64748b',
                  fontWeight: 600
                }}
              >
                {fileName}
              </span>
            </div>

            <p 
              className="text-xs mt-2"
              style={{
                color: '#64748b',
                fontWeight: 600
              }}
            >
              Formatos permitidos: PDF, JPG, PNG, DOC, DOCX (máx. 5MB)
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-start space-x-4">
            <button
              type="submit"
              disabled={loading || availableAbsences.length === 0 || loadingAbsences}
              className="font-semibold py-2 px-6 rounded-lg shadow-md flex items-center transition duration-200"
              style={{
                backgroundColor: loading || availableAbsences.length === 0 || loadingAbsences ? '#94a3b8' : '#16a34a',
                color: '#fff',
                fontWeight: 800,
                border: loading || availableAbsences.length === 0 || loadingAbsences ? '2px solid #64748b' : '2px solid #15803d',
                cursor: loading || availableAbsences.length === 0 || loadingAbsences ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="w-5 h-5 mr-1" />
                  Enviar Justificación
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="font-semibold py-2 px-6 rounded-lg transition duration-200"
              style={{
                backgroundColor: 'transparent',
                color: '#0f172a',
                fontWeight: 800,
                border: '2px solid #94a3b8',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewJustificationSection;