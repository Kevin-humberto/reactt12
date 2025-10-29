// src/services/asistencia/student/dashboard/dashboardService.js

export const fetchStudentData = () => ({
  studentName: 'Vicente',
  studentId: '71911503',
  semester: 'Quinta Semestre',
  career: 'Análisis de Sistemas',
  isCriticalAlert: true,
  alertMessage: 'Tienes 1 curso en estado crítico. Revisa tus asistencias para evitar la desaprobación.',
  attendanceSummaryData: [
    { title: 'OK', count: 6, subtitle: '< 10% faltas', color: 'green' },
    { title: 'ALERTA', count: 2, subtitle: '10% - 29% faltas', color: 'yellow' },
    { title: 'CRÍTICO', count: 1, subtitle: '≥ 30% faltas', color: 'red' },
  ],
  recentAttendanceData: [
    { courseCode: 'IND', date: '2025-01-19', status: 'Fallo', buttonText: 'Fallo', colorClass: 'bg-red-500' },
    { courseCode: 'CDI', date: '2025-01-18', status: 'Asistió', buttonText: 'Asistió', colorClass: 'bg-green-500' },
    { courseCode: 'FAH', date: '2025-01-17', status: 'Asistió', buttonText: 'Asistió', colorClass: 'bg-green-500' },
    { courseCode: 'TP2', date: '2025-01-16', status: 'Asistió', buttonText: 'Asistió', colorClass: 'bg-green-500' },
    { courseCode: 'TRI', date: '2025-01-15', status: 'Asistió', buttonText: 'Asistió', colorClass: 'bg-green-500' },
  ],
  pendingJustificationData: [
    { courseCode: 'IND', date: '2025-01-19', reason: 'Cita médica', status: 'Pendiente' },
  ],
});

export const quickActionsData = [
  { text: 'Ver Todas las Asistencias', colorClass: 'bg-blue-600 hover:bg-blue-700', icon: '📋' },
  { text: 'Enviar Justificación', colorClass: 'bg-green-600 hover:bg-green-700', icon: '✉️' },
  { text: 'Ver Alertas', colorClass: 'bg-orange-500 hover:bg-orange-600', icon: '⚠️' },
];