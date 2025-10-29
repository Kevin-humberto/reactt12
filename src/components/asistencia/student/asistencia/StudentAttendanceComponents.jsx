// src/components/asistencia/student/asistencia/StudentAttendanceComponents.jsx

import React, { useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

// --- 1. Header Greeting ---
export const HeaderGreeting = ({ info }) => (
    <div className="header-greeting-box">
        <h1>¡Hola {info.name || 'ESTUDIANTE'}!</h1>
        <p>Recuerda que una buena <strong>asistencia</strong> es clave para tu rendimiento académico. Si tienes dudas, no dudes en contactarnos.</p>
        <p className="update-message">
            Este reporte muestra tus asistencias actualizadas al <strong>{info.lastUpdated || 'hoy'}</strong>. 
            Si tienes menos del <span className="text-desaprobado">70% de asistencia</span> en una unidad didáctica, estarás en situación crítica.
        </p>
        <div className="calculation-info">
            <p className="text-sm text-gray-400 mt-2">
                <strong>Nota importante:</strong> 3 tardanzas (T) = 1 asistencia | 3 justificadas (J) = 1 asistencia
            </p>
        </div>
    </div>
);

// --- 2. Attendance Alerts (OPTIMO/ALERTA/CRÍTICO) ---
const AlertBox = ({ status, title, range, isActive }) => (
    <div className={`alert-box ${status.toLowerCase()} ${isActive ? 'active' : ''}`}>
        <span className="alert-icon">●</span>
        <p className="alert-title">{title}</p>
        <p className="alert-range">{range}</p>
    </div>
);

export const AttendanceAlerts = ({ overallStatus }) => (
    <>
        <div className="alerts-container">
            <AlertBox 
                status="OPTIMO" 
                title="ÓPTIMO" 
                range="≥ 85% de asistencia" 
                isActive={overallStatus === 'OPTIMO'} 
            />
            <AlertBox 
                status="ALERTA" 
                title="ALERTA" 
                range="70% - 84% de asistencia" 
                isActive={overallStatus === 'ALERTA'} 
            />
            <AlertBox 
                status="CRITICO" 
                title="CRÍTICO" 
                range="< 70% (Desaprobado)" 
                isActive={overallStatus === 'CRÍTICO'} 
            />
        </div>
        
        {overallStatus === 'OPTIMO' && (
            <div className="status-message optimo">
                <span className="message-icon">✓</span>
                <p>¡Excelente Trabajo! Tu asistencia está en estado óptimo. ¡Sigue así para mantener tu buen rendimiento académico!</p>
            </div>
        )}
        
        {overallStatus === 'ALERTA' && (
            <div className="status-message alerta" style={{background: '#fbbf24'}}>
                <span className="message-icon">⚠</span>
                <p>Atención: Tu asistencia está en estado de alerta. Necesitas mejorar para mantener un buen rendimiento y evitar desaprobar.</p>
            </div>
        )}
        
        {overallStatus === 'CRÍTICO' && (
            <div className="status-message desaprobado" style={{background: '#f87171'}}>
                <span className="message-icon">✖</span>
                <p>Alerta Crítica: Tu asistencia está por debajo del mínimo requerido (70%). Estás en riesgo de desaprobar por inasistencias. Contacta a tu tutor inmediatamente.</p>
            </div>
        )}

        <div className="justification-reminder">
            <span className="reminder-icon">ℹ</span>
            <p>Importante: Justifica las inasistencias dentro de las 48 horas. Recuerda: 3 tardanzas = 1 asistencia | 3 justificadas = 1 asistencia.</p>
        </div>
    </>
);

// --- 3. Attendance Filters con Dropdown DINÁMICO ---
export const AttendanceFilters = ({ currentFilters, onFilterChange, availableCourses = [], semesterName = '' }) => {
    const [showCourseMenu, setShowCourseMenu] = useState(false);
    
    const handleCourseSelect = (course) => {
        onFilterChange({ 
            course: course.label,
            courseId: course.courseId 
        });
        setShowCourseMenu(false);
    };
    
    return (
        <div className="filters-container">
            <h3 className="filter-title">Filtros de Asistencia</h3>
            <div className="filter-controls">
                <div className="filter-group">
                    <label>Semestre</label>
                    <button 
                        className="filter-button" 
                        style={{ cursor: 'default', opacity: 0.9 }}
                    >
                        {semesterName || currentFilters.semester}
                    </button>
                </div>
                
                <div className="filter-group" style={{position: 'relative'}}>
                    <label>Curso</label>
                    <button 
                        className="filter-button" 
                        onClick={() => setShowCourseMenu(!showCourseMenu)}
                    >
                        {currentFilters.course}
                    </button>
                    
                    {showCourseMenu && (
                        <div className="course-dropdown" style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            backgroundColor: '#374151',
                            border: '1px solid rgba(148, 163, 184, 0.12)',
                            borderRadius: '0.5rem',
                            marginTop: '0.5rem',
                            minWidth: '250px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            zIndex: 1000,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}>
                            {availableCourses.map((course, index) => (
                                <div
                                    key={course.courseId || index}
                                    onClick={() => handleCourseSelect(course)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        cursor: 'pointer',
                                        borderBottom: index < availableCourses.length - 1 ? '1px solid rgba(148, 163, 184, 0.12)' : 'none',
                                        transition: 'background-color 0.2s',
                                        color: '#f8fafc'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    {course.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 4. Attendance Table ---
const TableRow = ({ ud, courseName, semester, a, f, t, j, asistencias, plan, percent, estado }) => {
    const statusClass = estado.toLowerCase().replace(/\s+/g, '-');
    
    return (
        <tr>
            <td>
                {ud} <br/>
                <span className="course-name-small">{courseName}</span><br/>
                <span className="semester-tag">{semester}</span>
            </td>
            <td className="text-green-400 font-bold">{a}</td>
            <td className={f > 0 ? 'text-red-400 font-bold' : ''}>{f}</td>
            <td className={t > 0 ? 'text-yellow-400 font-bold' : ''}>{t}</td>
            <td className="text-blue-400 font-bold">{j}</td>
            <td className="text-cyan-400 font-bold">{asistencias}</td>
            <td>{plan}</td>
            <td className="font-bold">{percent}</td>
            <td className={`status-badge ${statusClass}`}>{estado}</td>
        </tr>
    );
};

export const AttendanceTable = ({ data }) => (
    <div className="attendance-table-wrapper">
        <table className="attendance-table">
            <thead>
                <tr>
                    <th>UD / Curso</th>
                    <th>A</th>
                    <th>F</th>
                    <th>T</th>
                    <th>J</th>
                    <th>Asist.</th>
                    <th>Plan</th>
                    <th>%</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <TableRow key={row.courseId || index} {...row} />
                ))}
            </tbody>
        </table>
    </div>
);

// --- 5. Legends (Column & Status) ---
export const LegendBlocks = () => (
    <div className="legends-container">
        <div className="legend-block column-legend">
            <h3>Leyenda de Columnas:</h3>
            <ul>
                <li><span className="legend-key">A</span>: Asistencias (Presente)</li>
                <li><span className="legend-key">F</span>: Faltas</li>
                <li><span className="legend-key">T</span>: Tardanzas (3T = 1 asistencia)</li>
                <li><span className="legend-key">J</span>: Justificadas (3J = 1 asistencia)</li>
                <li><span className="legend-key">Asist.</span>: Total asistencias efectivas</li>
            </ul>
        </div>
        
        <div className="legend-block status-legend">
            <h3>Estados de Asistencia:</h3>
            <ul>
                <li className="status-optimokey"><span>ÓPTIMO</span>: ≥ 85% asistencia</li>
                <li className="status-alertakey"><span>ALERTA</span>: 70% - 84% asistencia</li>
                <li className="status-criticokey"><span>CRÍTICO</span>: &lt; 70% (Desaprobado)</li>
            </ul>
        </div>
    </div>
);

// --- 6. Summary ---
const SummaryCard = ({ title, value, isHighlighted }) => (
    <div className={`summary-card ${isHighlighted ? 'highlight' : ''}`}>
        <span className="summary-value">{value}</span>
        <span className="summary-title">{title}</span>
    </div>
);

export const AttendanceSummary = ({ data, semesterName }) => (
    <div className="summary-section">
        <h3>Resumen {semesterName || '3° Semestre'}</h3>
        <p className="summary-subtitle">Estadísticas de tu semestre actual</p>
        <div className="summary-cards-container">
            <SummaryCard title="Cursos Matriculados" value={data.enrolledCourses || 0} />
            <SummaryCard title="Clases Programadas" value={data.scheduledClasses || 0} />
            <SummaryCard 
                title="Asistencia General" 
                value={`${data.generalAttendance || '0.00'}%`} 
                isHighlighted={true} 
            />
        </div>
    </div>
);