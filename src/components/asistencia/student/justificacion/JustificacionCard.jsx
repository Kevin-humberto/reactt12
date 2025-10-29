// src/components/asistencia/student/justificacion/JustificacionCard.jsx

import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon 
} from '@heroicons/react/24/solid';

const getStatusDetails = (estado) => {
  switch (estado) {
    case 'Aprobado':
      return { 
        icon: <CheckCircleIcon className="w-5 h-5 text-[#16a34a] mr-2" />, 
        badgeClass: 'badge-aprobado', 
        color: 'text-[#16a34a]' 
      };
    case 'Rechazada':
      return { 
        icon: <XCircleIcon className="w-5 h-5 text-[#dc2626] mr-2" />, 
        badgeClass: 'badge-rechazada', 
        color: 'text-[#dc2626]' 
      };
    case 'Pendiente':
      return { 
        icon: <ClockIcon className="w-5 h-5 text-[#ca8a04] mr-2" />, 
        badgeClass: 'badge-pendiente', 
        color: 'text-[#ca8a04]' 
      };
    default:
      return { 
        icon: null, 
        badgeClass: '', 
        color: 'text-[#334155]' 
      };
  }
};

const JustificacionCard = ({ data, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { icon, badgeClass, color } = getStatusDetails(data.estado);

  return (
    <div className="bg-[#cbd5e1] p-5 mb-5 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-2 border-[#94a3b8] hover:border-[#64748b] transition-all duration-300 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:-translate-y-0.5">
      
      {/* ====== HEADER: Curso y Estado ====== */}
      <div className="flex justify-between items-center mb-4 justificacion-card-header">
        <div className="flex items-center">
          {icon}
          <div>
            <h3 className={`text-lg font-extrabold ${color}`}>
              {data.unidadDidactica}
            </h3>
            <p className="text-sm text-[#334155] font-semibold">
              Código: {data.codigo}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {data.fueraPlazo && (
            <span className="px-3 py-1 text-xs font-extrabold rounded-full badge-fuera-plazo">
              Fuera de plazo
            </span>
          )}
          <span className={`px-3 py-1 text-xs font-extrabold rounded-full ${badgeClass}`}>
            {data.estado.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ====== INFORMACIÓN BÁSICA ====== */}
      <div className="border-b-2 border-[#94a3b8] pb-3 mb-3">
        <p className="text-sm text-[#334155] font-semibold">
          <span className="font-extrabold text-[#0f172a]">Falta del:</span> {data.fechaFalta}
        </p>
        <p className="text-sm text-[#334155] font-semibold">
          <span className="font-extrabold text-[#0f172a]">Enviado:</span> {data.fechaEnvio}
        </p>
        {data.fechaRevision && (
          <p className="text-sm text-[#334155] font-semibold">
            <span className="font-extrabold text-[#0f172a]">Revisado:</span> {data.fechaRevision}
          </p>
        )}
      </div>

      {/* ====== MOTIVO ====== */}
      <div className="mb-3">
        <p className="font-extrabold text-[#0f172a] text-sm mb-1">Motivo:</p>
        <p className="text-[#1e293b] text-sm bg-[#e2e8f0] p-3 rounded-md font-semibold">
          {data.motivo}
        </p>
      </div>

      {/* ====== DESCRIPCIÓN (SI EXISTE) ====== */}
      {data.descripcion && (
        <div className="mb-3">
          <p className="font-extrabold text-[#0f172a] text-sm mb-1">Descripción:</p>
          <p className="text-[#1e293b] text-sm bg-[#e2e8f0] p-3 rounded-md font-semibold">
            {data.descripcion}
          </p>
        </div>
      )}

      {/* ====== ARCHIVO ADJUNTO (SI EXISTE) ====== */}
      {data.attachmentFile && (
        <div className="mb-3">
          <div className="flex items-center space-x-2 text-[#2563eb] hover:text-[#1d4ed8] cursor-pointer transition">
            <DocumentTextIcon className="w-5 h-5" />
            <a 
              href={data.attachmentFile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm underline font-semibold"
            >
              Ver archivo adjunto
            </a>
          </div>
        </div>
      )}

      {/* ====== OBSERVACIONES DEL DOCENTE (SI EXISTEN) ====== */}
      {data.observaciones && (
        <div className="mt-4 p-3 bg-[#e2e8f0] rounded-md border-l-4 border-[#2563eb]">
          <p className="font-extrabold text-[#0f172a] text-sm mb-1">
            Observaciones del docente:
          </p>
          <p className="text-[#1e293b] text-sm font-semibold">{data.observaciones}</p>
        </div>
      )}

      {/* ====== BOTÓN EXPANDIR (PARA INFORMACIÓN ADICIONAL) ====== */}
      {data.estadoRaw !== 'pending' && (
        <div className="mt-4 pt-4 border-t-2 border-[#94a3b8]">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-sm text-[#334155] hover:text-[#0f172a] transition font-semibold"
          >
            <span>
              {isExpanded ? 'Ocultar detalles' : 'Ver más detalles'}
            </span>
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#e2e8f0] p-2 rounded border-2 border-[#cbd5e1]">
                  <p className="text-[#334155] text-xs font-semibold">ID Justificación</p>
                  <p className="text-[#0f172a] font-mono font-extrabold">#{data.id}</p>
                </div>
                <div className="bg-[#e2e8f0] p-2 rounded border-2 border-[#cbd5e1]">
                  <p className="text-[#334155] text-xs font-semibold">ID Asistencia</p>
                  <p className="text-[#0f172a] font-mono font-extrabold">#{data.attendanceId}</p>
                </div>
              </div>

              {data.studentName && (
                <div className="bg-[#e2e8f0] p-2 rounded border-2 border-[#cbd5e1]">
                  <p className="text-[#334155] text-xs font-semibold">Estudiante</p>
                  <p className="text-[#0f172a] font-extrabold">
                    {data.studentName} ({data.studentCode})
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ====== INDICADOR DE PENDIENTE ====== */}
      {data.estadoRaw === 'pending' && (
        <div className="mt-4 pt-4 border-t-2 border-[#94a3b8]">
          <div className="flex items-center space-x-2 text-[#ca8a04]">
            <ClockIcon className="w-4 h-4" />
            <p className="text-sm font-semibold">
              Tu justificación está siendo revisada por el docente
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JustificacionCard;