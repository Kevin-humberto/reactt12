// src/components/asistencia/student/justificacion/NewJustificationBatchForm.jsx

import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  ArrowUpTrayIcon, 
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import JustificationBatchService from '../../../../services/asistencia/student/justificacion/JustificationBatchService';
import { getUnjustifiedAbsences } from '../../../../services/asistencia/student/asistencia/attendanceService';

const NewJustificationBatchForm = ({ isVisible, onClose, onSuccess }) => {

  const [formData, setFormData] = useState({
    studentId: 6,
    categoria: '',
    descripcion: '',
    tipoDocumento: '',
    archivo: null,
    archivoNombre: null,
    faltasSeleccionadas: []
  });

  const [fileName, setFileName] = useState('Sin archivos seleccionados');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [availableAbsences, setAvailableAbsences] = useState([]);
  const [loadingAbsences, setLoadingAbsences] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (isVisible) {
      fetchAvailableAbsences();
      resetForm();
    }
  }, [isVisible]);

  const fetchAvailableAbsences = async () => {
    setLoadingAbsences(true);
    setError(null);
    try {
      const studentId = 6; 
      const absences = await getUnjustifiedAbsences(studentId);
      setAvailableAbsences(absences);
      
      if (absences.length === 0) {
        setError('No tienes faltas pendientes de justificar');
      }
    } catch (err) {
      console.error('Error loading absences:', err);
      setError('Error al cargar las faltas disponibles');
    } finally {
      setLoadingAbsences(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: 6,
      categoria: '',
      descripcion: '',
      tipoDocumento: '',
      archivo: null,
      archivoNombre: null,
      faltasSeleccionadas: []
    });
    setFileName('Sin archivos seleccionados');
    setSelectAll(false);
    setError(null);
    setSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleAbsenceToggle = (attendanceId) => {
    setFormData(prev => {
      const isSelected = prev.faltasSeleccionadas.includes(attendanceId);
      const newSelection = isSelected
        ? prev.faltasSeleccionadas.filter(id => id !== attendanceId)
        : [...prev.faltasSeleccionadas, attendanceId];
      
      return {
        ...prev,
        faltasSeleccionadas: newSelection
      };
    });
    setError(null);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setFormData(prev => ({ ...prev, faltasSeleccionadas: [] }));
    } else {
      const allIds = availableAbsences.map(abs => abs.attendanceId);
      setFormData(prev => ({ ...prev, faltasSeleccionadas: allIds }));
    }
    setSelectAll(!selectAll);
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
        archivoNombre: file.name
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
      archivoNombre: null
    }));
    document.getElementById('file-upload-batch').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const validation = JustificationBatchService.validateBatchData(formData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const batchData = JustificationBatchService.formatBatchForBackend(formData);

      console.log('📤 Enviando batch:', batchData);

      const response = await JustificationBatchService.createBatch(batchData);
      
      console.log('✅ Batch creado:', response);
      setSuccess(true);

      resetForm();
      if (document.getElementById('file-upload-batch')) {
        document.getElementById('file-upload-batch').value = '';
      }

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (err) {
      setError(err.message || 'Error al crear la solicitud agrupada');
      console.error('❌ Error submitting batch:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mb-6">
      
      {/* ALERTA DE INFORMACIÓN - Paleta actualizada */}
      <div 
        className="p-4 mb-6 rounded-lg shadow-md flex items-start text-sm"
        style={{
          backgroundColor: '#1e40af',
          color: '#fff',
          border: '2px solid #1e3a8a',
          boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)'
        }}
      >
        <ExclamationTriangleIcon className="w-5 h-5 mr-3 mt-0.5 min-w-5" />
        <div>
          <p style={{ fontWeight: 800, marginBottom: '0.25rem' }}>💡 Justificación Agrupada</p>
          <p style={{ fontWeight: 600 }}>
            Con esta opción puedes justificar <strong>múltiples faltas a la vez</strong> con un solo documento.
            Ideal para ausencias por enfermedad prolongada, emergencias familiares, o viajes.
          </p>
        </div>
      </div>

      {/* ALERTA DE PLAZO - Paleta actualizada */}
      <div 
        className="p-4 mb-6 rounded-lg shadow-md flex items-start text-sm"
        style={{
          backgroundColor: '#ca8a04',
          color: '#fff',
          border: '2px solid #a16207',
          boxShadow: '0 4px 12px rgba(202, 138, 4, 0.3)'
        }}
      >
        <ExclamationTriangleIcon className="w-5 h-5 mr-3 mt-0.5 min-w-5" />
        <p style={{ fontWeight: 600 }}>
          <strong style={{ fontWeight: 800 }}>Importante:</strong> Las justificaciones deben enviarse dentro de las 48 horas posteriores a la falta más antigua.
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
          className="px-4 py-3 rounded-lg mb-4 flex items-start"
          style={{
            backgroundColor: '#16a34a',
            border: '2px solid #15803d',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.4)'
          }}
        >
          <CheckCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <p style={{ fontWeight: 700 }}>✓ Solicitud agrupada enviada exitosamente</p>
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
          Nueva Justificación Agrupada
        </h2>
        <p 
          className="text-sm mb-6 pb-4"
          style={{
            color: '#334155',
            fontWeight: 600,
            borderBottom: '2px solid #94a3b8'
          }}
        >
          Justifica múltiples faltas con una sola solicitud
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* Seleccionar Faltas */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label 
                className="block text-sm"
                style={{
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              >
                Seleccionar Faltas a Justificar * ({formData.faltasSeleccionadas.length} seleccionadas)
              </label>
              {availableAbsences.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs px-3 py-1 rounded-md transition"
                  style={{
                    backgroundColor: '#1e40af',
                    color: '#fff',
                    fontWeight: 800,
                    border: '2px solid #1e3a8a',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {selectAll ? 'Deseleccionar todas' : 'Seleccionar todas'}
                </button>
              )}
            </div>
            
            {loadingAbsences ? (
              <div 
                className="rounded-lg p-4 text-center"
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
                className="rounded-lg p-4 text-center"
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
              <div 
                className="max-h-60 overflow-y-auto rounded-lg"
                style={{
                  backgroundColor: '#fff',
                  border: '2px solid #94a3b8'
                }}
              >
                {availableAbsences.map(absence => (
                  <label
                    key={absence.attendanceId}
                    className={`flex items-center p-3 cursor-pointer transition border-b last:border-b-0`}
                    style={{
                      borderColor: '#94a3b8',
                      backgroundColor: formData.faltasSeleccionadas.includes(absence.attendanceId) ? '#dbeafe' : 'transparent'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.faltasSeleccionadas.includes(absence.attendanceId)}
                      onChange={() => handleAbsenceToggle(absence.attendanceId)}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{
                        accentColor: '#1e40af'
                      }}
                    />
                    <div className="ml-3 flex-1">
                      <p 
                        className="text-sm"
                        style={{
                          fontWeight: 700,
                          color: '#0f172a'
                        }}
                      >
                        {absence.courseName}
                      </p>
                      <p 
                        className="text-xs"
                        style={{
                          color: '#64748b',
                          fontWeight: 600
                        }}
                      >
                        {JustificationBatchService.formatDate(absence.classDate)}
                        {absence.classTime && ` - ${new Date(absence.classTime).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <p 
              className="text-xs mt-2"
              style={{
                color: '#64748b',
                fontWeight: 600
              }}
            >
              💡 Selecciona todas las faltas relacionadas al mismo motivo
            </p>
          </div>

          {/* Categoría */}
          <div className="mb-6">
            <label 
              className="block text-sm mb-2"
              style={{
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Categoría del Motivo *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
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
              <option value="">-- Selecciona una categoría --</option>
              <option value="medical">🏥 Médica (enfermedad, cita médica)</option>
              <option value="family">👨‍👩‍👧‍👦 Familiar (emergencia, fallecimiento)</option>
              <option value="personal">👤 Personal (trámites, gestiones)</option>
              <option value="academic">📚 Académica (eventos, representación)</option>
              <option value="emergency">🚨 Emergencia (situación imprevista)</option>
            </select>
          </div>

          {/* Descripción General */}
          <div className="mb-6">
            <label 
              className="block text-sm mb-2"
              style={{
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Descripción General *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="4"
              minLength={10}
              placeholder="Explica el motivo general de todas las faltas seleccionadas..."
              className="w-full rounded-lg p-3 resize-none transition"
              style={{
                backgroundColor: '#fff',
                color: '#0f172a',
                border: '2px solid #94a3b8',
                fontWeight: 600
              }}
            ></textarea>
            <p 
              className="text-xs mt-1"
              style={{
                color: '#64748b',
                fontWeight: 600
              }}
            >
              {formData.descripcion.length} caracteres (mínimo 10)
            </p>
          </div>

          {/* Tipo de Documento */}
          <div className="mb-6">
            <label 
              className="block text-sm mb-2"
              style={{
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Tipo de Documento (Opcional)
            </label>
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="w-full rounded-lg p-3 cursor-pointer transition"
              style={{
                backgroundColor: '#fff',
                color: '#0f172a',
                border: '2px solid #94a3b8',
                fontWeight: 600
              }}
            >
              <option value="">-- Ninguno --</option>
              <option value="medical_certificate">Certificado Médico</option>
              <option value="death_certificate">Acta de Defunción</option>
              <option value="travel_document">Documento de Viaje</option>
              <option value="court_order">Orden Judicial</option>
              <option value="institutional_letter">Carta Institucional</option>
              <option value="other">Otro</option>
            </select>
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
              Documento de Evidencia (Opcional)
            </label>
            
            <div className="flex items-center space-x-3">
              <label
                htmlFor="file-upload-batch"
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
                id="file-upload-batch"
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

          {/* Resumen */}
          {formData.faltasSeleccionadas.length > 0 && (
            <div 
              className="mb-6 p-4 rounded-lg"
              style={{
                backgroundColor: '#dbeafe',
                border: '2px solid #3b82f6'
              }}
            >
              <p 
                className="text-sm mb-2"
                style={{
                  fontWeight: 700,
                  color: '#1e40af'
                }}
              >
                📋 Resumen de tu solicitud:
              </p>
              <ul 
                className="text-sm space-y-1"
                style={{
                  color: '#0f172a',
                  fontWeight: 600
                }}
              >
                <li>• <strong style={{ fontWeight: 800 }}>{formData.faltasSeleccionadas.length}</strong> falta(s) seleccionada(s)</li>
                <li>• Categoría: <strong style={{ fontWeight: 800 }}>{formData.categoria || 'No seleccionada'}</strong></li>
                <li>• Documento: <strong style={{ fontWeight: 800 }}>{formData.archivo ? '✓ Adjunto' : '✗ Sin adjuntar'}</strong></li>
              </ul>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-start space-x-4">
            <button
              type="submit"
              disabled={loading || availableAbsences.length === 0 || loadingAbsences || formData.faltasSeleccionadas.length === 0}
              className="font-semibold py-2 px-6 rounded-lg shadow-md flex items-center transition duration-200"
              style={{
                backgroundColor: loading || availableAbsences.length === 0 || loadingAbsences || formData.faltasSeleccionadas.length === 0 ? '#94a3b8' : '#16a34a',
                color: '#fff',
                fontWeight: 800,
                border: loading || availableAbsences.length === 0 || loadingAbsences || formData.faltasSeleccionadas.length === 0 ? '2px solid #64748b' : '2px solid #15803d',
                cursor: loading || availableAbsences.length === 0 || loadingAbsences || formData.faltasSeleccionadas.length === 0 ? 'not-allowed' : 'pointer',
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
                  Enviar Solicitud Agrupada
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

export default NewJustificationBatchForm;