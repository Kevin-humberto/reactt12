// src/components/asistencia/student/asistencia/AttendanceHistoryModal.jsx

import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon, ChartBarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { getAttendanceHistory } from '../../../../services/asistencia/student/asistencia/attendanceService';

const AttendanceHistoryModal = ({ isOpen, onClose, studentId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [expandedMonths, setExpandedMonths] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, selectedYear]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAttendanceHistory(studentId, '2025-I', selectedYear);
      setHistory(data.months || []);
    } catch (err) {
      setError('Error al cargar el historial de asistencias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMonth = (monthNumber) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthNumber]: !prev[monthNumber]
    }));
  };

  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPTIMO':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'ALERTA':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'CRÍTICO':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'SIN DATOS':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'SIN MATRÍCULA':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 85) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Historial de Asistencias por Curso</h2>
              <p className="text-sm text-gray-400">Resumen mensual del año {selectedYear}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          
          {/* Year Selector */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <label className="text-gray-300 font-medium">Año:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>

            <button
              onClick={fetchHistory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span>Actualizar</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* No Data */}
          {!loading && !error && history.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No hay datos de asistencia para este año</p>
            </div>
          )}

          {/* Monthly History Accordion */}
          {!loading && !error && history.length > 0 && (
            <div className="space-y-4">
              {history.map((month) => (
                <div
                  key={month.monthNumber}
                  className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden"
                >
                  {/* Month Header - Clickeable */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-650 transition-colors"
                    onClick={() => toggleMonth(month.monthNumber)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold text-white">{month.month}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(month.status)}`}>
                          {month.status}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {month.courses.length} cursos
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{month.percentage.toFixed(2)}%</div>
                          <div className="text-xs text-gray-400">
                            {month.effectiveAttendance} de {month.totalClasses} clases
                          </div>
                        </div>
                        {expandedMonths[month.monthNumber] ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressBarColor(month.percentage)}`}
                        style={{ width: `${Math.min(month.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Course Details - Expandible */}
                  {expandedMonths[month.monthNumber] && (
                    <div className="border-t border-gray-600 p-4 bg-gray-750">
                      <h4 className="text-white font-semibold mb-3">Detalle por Curso:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {month.courses.map((course) => (
                          <div
                            key={course.courseId}
                            className="bg-gray-800 rounded-lg p-3 border border-gray-600"
                          >
                            {/* Course Header */}
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="text-white font-bold text-sm">{course.courseCode}</h5>
                                <p className="text-gray-400 text-xs">{course.courseName}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(course.status)}`}>
                                {course.status}
                              </span>
                            </div>

                            {/* Course Stats */}
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total:</span>
                                <span className="text-white font-bold">{course.totalClasses}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Presentes:</span>
                                <span className="text-green-400 font-bold">{course.present}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Faltas:</span>
                                <span className="text-red-400 font-bold">{course.absent}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Tardanzas:</span>
                                <span className="text-yellow-400 font-bold">{course.late}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Justificadas:</span>
                                <span className="text-blue-400 font-bold">{course.justified}</span>
                              </div>
                            </div>

                            {/* Course Progress */}
                            <div className="mt-2 pt-2 border-t border-gray-700">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-400">Asist. Efectivas:</span>
                                <span className="text-cyan-400 font-bold text-sm">{course.effectiveAttendance}</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${getProgressBarColor(course.percentage)}`}
                                  style={{ width: `${Math.min(course.percentage, 100)}%` }}
                                ></div>
                              </div>
                              <div className="text-center mt-1">
                                <span className="text-white font-bold text-sm">{course.percentage.toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          {!loading && !error && history.length > 0 && (
            <div className="mt-6 bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-bold mb-3">Información importante:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong className="text-cyan-400">Asistencias Efectivas</strong> = Presentes + (Tardanzas ÷ 3) + (Justificadas ÷ 3)</li>
                <li>• <strong className="text-green-400">ÓPTIMO</strong>: ≥ 85% de asistencia</li>
                <li>• <strong className="text-yellow-400">ALERTA</strong>: 70% - 84% de asistencia</li>
                <li>• <strong className="text-red-400">CRÍTICO</strong>: &lt; 70% de asistencia (Desaprobado)</li>
                <li>• Haz clic en cada mes para ver el detalle por curso</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryModal;