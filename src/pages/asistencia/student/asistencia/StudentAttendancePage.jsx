// src/pages/asistencia/student/asistencia/StudentAttendancePage.jsx

import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { 
    fetchAttendanceRecords, 
    getSemesterSummary, 
    getStudentHeaderInfo,
    getStudentCourses
} from '../../../../services/asistencia/student/asistencia/attendanceService'; 
import { 
    HeaderGreeting, 
    AttendanceAlerts, 
    AttendanceFilters, 
    AttendanceTable, 
    AttendanceSummary, 
    LegendBlocks 
} from '../../../../components/asistencia/student/asistencia/StudentAttendanceComponents';
import AttendanceHistoryModal from '../../../../components/asistencia/student/asistencia/AttendanceHistoryModal';
import '../../../../styles/asistencia/student/asistencia/attendanceStyles.css';

const StudentAttendancePage = () => {
    // State management
    const [headerInfo, setHeaderInfo] = useState({});
    const [attendanceData, setAttendanceData] = useState([]);
    const [summaryData, setSummaryData] = useState({});
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [filters, setFilters] = useState({ 
        semester: '', 
        course: 'Todos los cursos',
        courseId: 'all',
        period: '2025-I'
    });

    // Load data effect
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                console.log('📄 Loading data with filters:', filters);
                
                // Fetch all data concurrently
                const [info, records, summary, courses] = await Promise.all([
                    getStudentHeaderInfo(filters.period),
                    fetchAttendanceRecords(filters),
                    getSemesterSummary(filters.period),
                    getStudentCourses(filters.period)
                ]);
                
                setHeaderInfo(info);
                setAttendanceData(records);
                setSummaryData(summary);
                setAvailableCourses(courses);
                
                // Actualizar el nombre del semestre dinámicamente
                if (info.currentSemester) {
                    const semesterNames = {
                        1: '1er Semestre',
                        2: '2do Semestre',
                        3: '3er Semestre',
                        4: '4to Semestre',
                        5: '5to Semestre',
                        6: '6to Semestre'
                    };
                    setFilters(prev => ({ 
                        ...prev, 
                        semester: semesterNames[info.currentSemester] || `${info.currentSemester}° Semestre`
                    }));
                }
                
                console.log('📊 Data loaded successfully:', {
                    headerInfo: info,
                    recordsCount: records.length,
                    summary,
                    coursesCount: courses.length
                });
                
            } catch (err) {
                console.error('❌ Error loading data:', err);
                setError('Error al cargar los datos de asistencia. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [filters.period, filters.courseId]); // Re-fetch when period or courseId change

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        console.log('🔄 Filters changed:', newFilters);
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Loading state
    if (loading) {
        return (
            <div className="attendance-dashboard">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Cargando datos de asistencia...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="attendance-dashboard">
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <h2>Error al cargar datos</h2>
                    <p>{error}</p>
                    <button 
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="attendance-dashboard">
            {/* Top Header Section */}
            <HeaderGreeting info={headerInfo} />
            
            {/* Alert Status and Justification Info */}
            <AttendanceAlerts overallStatus={headerInfo.overallStatus} />

            {/* Attendance Filters + History Button */}
            <div className="flex justify-between items-start gap-4 mb-6">
                <div className="flex-1">
                    <AttendanceFilters 
                        currentFilters={filters} 
                        onFilterChange={handleFilterChange}
                        availableCourses={availableCourses}
                        semesterName={filters.semester}
                    />
                </div>
                
                {/* History Button */}
                <button
                    onClick={() => setShowHistoryModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center space-x-2 transition duration-200 mt-14"
                    style={{ minWidth: '180px' }}
                >
                    <ClockIcon className="w-5 h-5" />
                    <span>Ver Historial</span>
                </button>
            </div>
            
            {/* Attendance Detail Section */}
            <div className="attendance-detail-section">
                <h2>Registro de Asistencias - {headerInfo.name}</h2>
                
                {attendanceData.length === 0 ? (
                    <div className="no-data-message">
                        <p>No hay registros de asistencia para mostrar.</p>
                        <p className="text-sm mt-2">Asegúrate de estar matriculado en cursos de tu semestre actual.</p>
                    </div>
                ) : (
                    <AttendanceTable data={attendanceData} />
                )}
            </div>
            
            {/* Legend and Summary */}
            <LegendBlocks />
            <AttendanceSummary 
                data={summaryData} 
                semesterName={filters.semester}
            />
            
            {/* Connection Status Indicator */}
            <div className="connection-status">
                <span className="status-dot online"></span>
                <span className="status-text">Conectado al servidor</span>
            </div>

            {/* History Modal */}
            <AttendanceHistoryModal
                isOpen={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                studentId={6} 
            />
        </div>
    );
};

export default StudentAttendancePage;