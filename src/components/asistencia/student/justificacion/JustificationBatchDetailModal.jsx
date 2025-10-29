// src/components/asistencia/student/justificacion/JustificationBatchDetailModal.jsx

import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import JustificationBatchService from '../../../../services/asistencia/student/justificacion/JustificationBatchService';

const JustificationBatchDetailModal = ({ isOpen, onClose, batchId }) => {
  const [batchDetails, setBatchDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && batchId) {
      fetchBatchDetails();
    }
  }, [isOpen, batchId]);

  const fetchBatchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await JustificationBatchService.getBatchDetails(batchId);
      setBatchDetails(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading batch details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-[#16a34a]" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-[#dc2626]" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-[#ca8a04]" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-[#334155]" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-[#dcfce7] text-[#15803d] border-[#16a34a]';
      case 'rejected':
        return 'bg-[#fee2e2] text-[#7f1d1d] border-[#dc2626]';
      case 'pending':
        return 'bg-[#fef3c7] text-[#a16207] border-[#ca8a04]';
      default:
        return 'bg-[#e2e8f0] text-[#334155] border-[#94a3b8]';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'medical': '🏥',
      'personal': '👤',
      'family': '👨‍👩‍👧‍👦',
      'academic': '📚',
      'emergency': '🚨'
    };
    return icons[category] || '📋';
  };

  const getStatusText = (status) => {
    const texts = {
      'approved': 'Aprobado',
      'rejected': 'Rechazado',
      'pending': 'Pendiente'
    };
    return texts[status] || status;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-[#cbd5e1] rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#94a3b8]">
          
          <div className="sticky top-0 bg-gradient-to-r from-[#16a34a] to-[#15803d] px-6 py-4 border-b-2 border-[#16a34a] flex justify-between items-center z-10 rounded-t-lg">
            <div>
              <h2 className="text-2xl font-black text-white">
                Detalles de Solicitud Agrupada
              </h2>
              <p className="text-sm text-[#e2e8f0] font-semibold">
                ID: #{batchId}
              </p>
            </div>
            <button onClick={onClose} className="text-white hover:text-[#e2e8f0] transition">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-6">
            
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#94a3b8] border-t-[#16a34a]"></div>
                <p className="text-[#334155] mt-4 font-semibold">Cargando detalles...</p>
              </div>
            )}

            {error && !loading && (
              <div className="bg-[#fee2e2] border-2 border-[#dc2626] text-[#7f1d1d] px-4 py-3 rounded-lg">
                <p className="font-extrabold">{error}</p>
                <button onClick={fetchBatchDetails} className="mt-2 text-sm underline hover:text-[#991b1b] font-semibold">
                  Reintentar
                </button>
              </div>
            )}

            {batchDetails && !loading && !error && (
              <div className="space-y-6">
                
                <div className="bg-white p-5 rounded-lg border-2 border-[#94a3b8]">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{getCategoryIcon(batchDetails.reasonCategory)}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-[#0f172a]">Información General</h3>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-extrabold border-2 ${getStatusBadgeClass(batchDetails.approvalStatus)} shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}>
                      {getStatusIcon(batchDetails.approvalStatus)}
                      <span className="ml-2">{getStatusText(batchDetails.approvalStatus).toUpperCase()}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#e2e8f0] p-3 rounded-md border-2 border-[#cbd5e1]">
                      <p className="text-xs text-[#334155] mb-1 font-semibold">Estudiante</p>
                      <p className="text-[#0f172a] font-extrabold">{batchDetails.studentName}</p>
                      <p className="text-[#334155] text-sm font-semibold">Código: {batchDetails.studentCode}</p>
                    </div>

                    <div className="bg-[#e2e8f0] p-3 rounded-md border-2 border-[#cbd5e1]">
                      <p className="text-xs text-[#334155] mb-1 font-semibold">Categoría</p>
                      <p className="text-[#0f172a] font-extrabold capitalize">{batchDetails.reasonCategory}</p>
                    </div>

                    <div className="bg-[#e2e8f0] p-3 rounded-md border-2 border-[#cbd5e1]">
                      <p className="text-xs text-[#334155] mb-1 font-semibold">Fecha de Envío</p>
                      <p className="text-[#0f172a] font-extrabold">
                        {JustificationBatchService.formatDateTime(batchDetails.submissionDate)}
                      </p>
                    </div>

                    <div className="bg-[#e2e8f0] p-3 rounded-md border-2 border-[#cbd5e1]">
                      <p className="text-xs text-[#334155] mb-1 font-semibold">Total de Faltas</p>
                      <p className="text-[#0f172a] text-2xl font-black">{batchDetails.totalAbsences}</p>
                    </div>

                    <div className="bg-[#e2e8f0] p-3 rounded-md border-2 border-[#cbd5e1]">
                      <p className="text-xs text-[#334155] mb-1 font-semibold">Plazo de Envío</p>
                      <p className={`font-extrabold ${batchDetails.within48Hours === 'Y' ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                        {batchDetails.within48Hours === 'Y' ? '✓ Dentro de 48 horas' : '✗ Fuera de plazo'}
                      </p>
                    </div>

                    {batchDetails.documentType && (
                      <div className="bg-[#e2e8f0] p-3 rounded-md border-2 border-[#cbd5e1]">
                        <p className="text-xs text-[#334155] mb-1 font-semibold">Tipo de Documento</p>
                        <p className="text-[#0f172a] font-extrabold capitalize">
                          {batchDetails.documentType.replace('_', ' ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 bg-[#e2e8f0] p-4 rounded-md border-2 border-[#cbd5e1]">
                    <p className="text-xs text-[#334155] mb-2 font-semibold">Descripción General:</p>
                    <p className="text-[#1e293b] text-sm leading-relaxed font-semibold">
                      {batchDetails.generalDescription}
                    </p>
                  </div>

                  {batchDetails.attachmentPath && (
                    <div className="mt-4 flex items-center space-x-2 text-[#2563eb] hover:text-[#1d4ed8]">
                      <DocumentTextIcon className="w-5 h-5" />
                      <a href={batchDetails.attachmentPath} target="_blank" rel="noopener noreferrer" className="text-sm underline font-semibold">
                        Ver documento adjunto
                      </a>
                    </div>
                  )}
                </div>

                {batchDetails.reviewDate && (
                  <div className="bg-white p-5 rounded-lg border-2 border-[#94a3b8]">
                    <h3 className="text-xl font-black text-[#0f172a] mb-4">Información de Revisión</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#e2e8f0] p-3 rounded-md border-2 border-[#cbd5e1]">
                        <p className="text-xs text-[#334155] mb-1 font-semibold">Fecha de Revisión</p>
                        <p className="text-[#0f172a] font-extrabold">
                          {JustificationBatchService.formatDateTime(batchDetails.reviewDate)}
                        </p>
                      </div>
                      {batchDetails.reviewerEmail && (
                        <div className="bg-[#e2e8f0] p-3 rounded-md border-2 border-[#cbd5e1]">
                          <p className="text-xs text-[#334155] mb-1 font-semibold">Revisado por</p>
                          <p className="text-[#0f172a] font-extrabold">{batchDetails.reviewerEmail}</p>
                        </div>
                      )}
                    </div>
                    {batchDetails.reviewComments && (
                      <div className="mt-4 bg-[#e2e8f0] p-4 rounded-md border-l-4 border-[#2563eb]">
                        <p className="text-xs text-[#334155] mb-2 font-semibold">Comentarios del Revisor:</p>
                        <p className="text-[#1e293b] text-sm leading-relaxed font-semibold">
                          {batchDetails.reviewComments}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-white p-5 rounded-lg border-2 border-[#94a3b8]">
                  <h3 className="text-xl font-black text-[#0f172a] mb-4">
                    Detalle de Justificaciones ({batchDetails.justifications?.length || 0})
                  </h3>
                  {batchDetails.justifications && batchDetails.justifications.length > 0 ? (
                    <div className="space-y-3">
                      {batchDetails.justifications.map((just) => (
                        <div key={just.justificationId} className="bg-[#e2e8f0] p-4 rounded-md border-2 border-[#cbd5e1] hover:border-[#94a3b8] transition">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <AcademicCapIcon className="w-5 h-5 text-[#2563eb]" />
                              <div>
                                <p className="text-[#0f172a] font-extrabold">{just.courseName || 'Sin nombre'}</p>
                                <p className="text-[#334155] text-xs font-semibold">Código: {just.courseCode || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(just.justificationStatus)}
                              <span className={`px-2 py-1 rounded text-xs font-extrabold border-2 ${getStatusBadgeClass(just.justificationStatus)}`}>
                                {getStatusText(just.justificationStatus)}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <CalendarIcon className="w-4 h-4 text-[#334155]" />
                              <span className="text-[#1e293b] font-semibold">
                                {JustificationBatchService.formatDate(just.classDate)}
                              </span>
                            </div>
                            <div className="text-sm text-[#334155] font-semibold">ID: #{just.justificationId}</div>
                          </div>
                          {just.reviewComments && (
                            <div className="mt-3 p-2 bg-white rounded text-xs text-[#334155] border border-[#cbd5e1]">
                              <span className="font-extrabold text-[#0f172a]">Observaciones:</span> {just.reviewComments}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#334155] text-center py-4 font-semibold">No hay justificaciones en este lote</p>
                  )}
                </div>

                {batchDetails.approvalStatus === 'partial' && (
                  <div className="bg-[#dbeafe] border-2 border-[#2563eb] p-4 rounded-lg flex items-start">
                    <InformationCircleIcon className="w-5 h-5 text-[#2563eb] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#1e40af] text-sm font-semibold">
                      <strong>Revisión Parcial:</strong> Algunas justificaciones fueron aprobadas y otras rechazadas.
                    </p>
                  </div>
                )}

                {batchDetails.approvalStatus === 'pending' && (
                  <div className="bg-[#fef3c7] border-2 border-[#ca8a04] p-4 rounded-lg flex items-start">
                    <ClockIcon className="w-5 h-5 text-[#ca8a04] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#a16207] text-sm font-semibold">
                      <strong>En Revisión:</strong> Tu solicitud está siendo procesada.
                    </p>
                  </div>
                )}

                {batchDetails.within48Hours === 'N' && (
                  <div className="bg-[#fee2e2] border-2 border-[#dc2626] p-4 rounded-lg flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-[#dc2626] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#7f1d1d] text-sm font-semibold">
                      <strong>Fuera de Plazo:</strong> Esta solicitud fue enviada después de las 48 horas reglamentarias.
                    </p>
                  </div>
                )}

              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-gradient-to-r from-[#16a34a] to-[#15803d] px-6 py-4 border-t-2 border-[#16a34a] flex justify-end rounded-b-lg">
            <button onClick={onClose} className="bg-white hover:bg-[#e2e8f0] text-[#16a34a] font-black py-2 px-6 rounded-lg transition duration-200 border-2 border-white shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JustificationBatchDetailModal;