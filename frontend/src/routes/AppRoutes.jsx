import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import StudentPage from '../pages/StudentPage';
import ClassPage from '../pages/ClassPage';
import SubjectPage from '../pages/SubjectPage';
import ScorePage from '../pages/ScorePage';
import StudentDetailPage from '../pages/StudentDetailPage';
import ClassDetailPage from '../pages/ClassDetailPage';
import SubjectDetailPage from '../pages/SubjectDetailPage';
import ScoreDetailPage from '../pages/ScoreDetailPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students/:studentId"
          element={
            <ProtectedRoute>
              <StudentDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/classes"
          element={
            <ProtectedRoute>
              <ClassPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/classes/:classId"
          element={
            <ProtectedRoute>
              <ClassDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <SubjectPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects/:subjectId"
          element={
            <ProtectedRoute>
              <SubjectDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scores"
          element={
            <ProtectedRoute>
              <ScorePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scores/:scoreId"
          element={
            <ProtectedRoute>
              <ScoreDetailPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
