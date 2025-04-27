import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoutes from "./utils/ProtectedRoutes";

// Pages
import MainPage from "./pages/MainPage";
import TasksPage from "./pages/TasksPage";
import ProjectsPage from "./pages/ProjectsPage";
import InvitationsPage from "./pages/InvitationsPage";
import CalendarPage from "./pages/CalendarPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ProjectCardPage from "./pages/ProjectCardPage";
import TaskPage from "./pages/TaskPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthPage />} path="/login"></Route>
        <Route element={<RegisterPage />} path="/register"></Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Navigate to="/main?user_id=1" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:taskId" element={<TaskPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectCardPage />} />
          <Route path="/invitations" element={<InvitationsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/participants" element={<ParticipantsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/logout" element={<Navigate to="/login" replace />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
