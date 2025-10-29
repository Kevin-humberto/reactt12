// src/components/asistencia/student/dashboard/StudentDashboardComponent.jsx
import React from 'react';
// Asegúrate que la ruta al servicio sea correcta en tu proyecto
import { fetchStudentData, quickActionsData } from '../../../../services/asistencia/student/dashboard/dashboardService';
// Importo estilos del dashboard (ruta desde este archivo hasta src/styles/dashboardStyles.css)
import '../../../../styles/asistencia/student/dashboard/dashboardStyles.css';

const studentData = fetchStudentData();

const AlertBanner = ({ message }) => (
  <div className="alert-banner" role="alert">
    <svg className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
    </svg>
    <div>
      <span className="alert-title">¡Atención!</span> {message}
    </div>
  </div>
);

const AttendanceSummaryCard = ({ title, count, subtitle, color }) => {
  const mod = color === 'green' ? 'attendance-card--green' : color === 'yellow' ? 'attendance-card--yellow' : 'attendance-card--red';
  return (
    <div className={`attendance-card ${mod}`}>
      <div className="count">{count}</div>
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle}</div>
    </div>
  );
};

const AttendanceSummary = ({ data }) => (
  <div className="attendance-summary">
    <p className="summary-desc">Estado actual de tus cursos según el porcentaje de asistencia.</p>
    <div className="attendance-cards">
      {data.map(card => (
        <AttendanceSummaryCard key={card.title} {...card} />
      ))}
    </div>
  </div>
);

const RecentAttendance = ({ data }) => (
  <div className="recent-attendance">
    <h3 className="card-title">Asistencias Recientes</h3>
    <p className="muted-text">Últimos registros de asistencia.</p>
    <div className="mt-3">
      {data.map((item, index) => (
        <div key={index} className="recent-item">
          <div className="flex flex-col">
            <span className="course">{item.courseCode}</span>
            <span className="date">{item.date}</span>
          </div>
          <button className={`recent-btn ${item.colorClass}`}>
            {item.buttonText}
          </button>
        </div>
      ))}
    </div>
  </div>
);

const QuickActions = ({ actions }) => (
  <div className="quick-actions">
    <h3 className="card-title">Acciones Rápidas</h3>
    <div className="space-y-3 mt-2">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`action-btn ${action.colorClass || 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.text}
        </button>
      ))}
    </div>
  </div>
);

const PendingJustifications = ({ data }) => (
  <div className="pending-justifications">
    <h3 className="card-title">Justificaciones Pendientes</h3>
    <div className="mt-2">
      {data.map((item, index) => (
        <div key={index} className="pending-card">
          <div className="flex justify-between items-start mb-1">
            <span className="course">{item.courseCode}</span>
            <span className="status-badge">{item.status}</span>
          </div>
          <p className="date">{item.date}</p>
          <p className="reason">{item.reason}</p>
        </div>
      ))}
    </div>
  </div>
);

const PerformanceTrend = () => (
  <div className="performance-trend">
    <h3 className="card-title">Tendencia de Rendimiento</h3>
    <div className="trend-box mt-2">
      <svg className="trend-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
      </svg>
      <p className="trend-title">Tendencia Descendente</p>
      <p className="trend-desc">Aumentaron las Faltas esta semana.</p>
    </div>
  </div>
);

const StudentDashboardComponent = () => {
  return (
    <div className="student-dashboard-wrapper">
      <h1 className="student-dashboard-title">¡Hola {studentData.studentName}! 👋</h1>
      <p className="student-dashboard-subtitle">{studentData.studentId} - {studentData.semester} - {studentData.career}</p>

      {studentData.isCriticalAlert && <AlertBanner message={studentData.alertMessage} />}

      <div className="dashboard-grid">
        <div className="dashboard-col-main">
          <AttendanceSummary data={studentData.attendanceSummaryData} />
          <RecentAttendance data={studentData.recentAttendanceData} />
        </div>

        <div className="dashboard-col-side">
          <QuickActions actions={quickActionsData} />
          <PendingJustifications data={studentData.pendingJustificationData} />
          <PerformanceTrend />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardComponent;
