import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//ADMINISTRADOR
import InitialPage from "./pages/administrador/initialPage";
import UserList from "./pages/administrador/usuarios";
import ControlAsistencias from "./pages/administrador/controAsistencias";
import TeacherManagementPage from "./pages/administrador/manageTeacher";
import AdministradorLayout from "./components/teacher/Navbar";

// PROFESOR
import TeacherLayout from "./components/teacher/Layout";
import InicialPage from "./pages/teacher/inicialPage";
import AttendancePage from "./pages/teacher/attendancePage";
import JustificationPage from "./pages/teacher/justificationsPage";
import ReportsPage from "./pages/teacher/reportsPage";

// ESTUDIANTE
import StudentLayout from "./components/asistencia/student/layout/StudentLayout";
import StudentDashboardPage from "./pages/asistencia/student/dashboard/StudentDashboardPage";
import StudentAttendancePage from "./pages/asistencia/student/asistencia/StudentAttendancePage";
import JustificacionPage from "./pages/asistencia/student/justificacion/JustificacionPage";
import AlertsPage from "./pages/asistencia/student/alert/AlertsPage";
import CursosPage from "./pages/asistencia/student/cursos/CursosPage";
import JustificationBatchPage from "./pages/asistencia/student/justificacion/JustificationBatchPage";

// ADMIN
// import AdminLayout from "./components/asistencia/admin/layout/AdminLayout";
import StudentManagementPage from "./pages/asistencia/admin/studentAdmin/StudentManagementPage";

import "./index.css";

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          {/* ======= PROFESOR /teacher/inicial ======= */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<Navigate to="inicial" replace />} />
            <Route path="inicial" element={<InicialPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="justifications" element={<JustificationPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* ======= ESTUDIANTE ======= */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="cursos" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="cursos" element={<CursosPage />} />
            <Route path="asistencias" element={<StudentAttendancePage />} />
            <Route path="justificaciones" element={<JustificacionPage />} />
            <Route path="alertas" element={<AlertsPage />} />
            <Route
              path="justificaciones/lote"
              element={<JustificationBatchPage />}
            />
          </Route>

          {/* ======= ADMIN ======= */}
          <Route path="/admin" element={<AdministradorLayout />}>
            <Route index element={<Navigate to="initial" replace />} />
            <Route path="initial" element={<InitialPage />} />
            <Route path="usuarios" element={<UserList />} />
            <Route path="contro-asistencias" element={<ControlAsistencias />} />
            <Route path="manage-teacher" element={<TeacherManagementPage/>}/>
            <Route path="estudiantes" element={<StudentManagementPage />} />
          </Route>

          {/* Redirección principal */}
          <Route path="/" element={<Navigate to="/admin/initial" replace />} />

          {/* 404 - Página no encontrada */}
          <Route path="*" element={<Navigate to="/student/cursos" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;