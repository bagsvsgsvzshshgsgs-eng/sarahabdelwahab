import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'

// Layouts & Guards
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminLayout } from './components/AdminLayout'
import { StudentLayout } from './components/StudentLayout'

// Pages
import { StudentLogin } from './pages/student/StudentLogin'
import { StudentHome } from './pages/student/StudentHome'
import { QuizPage } from './pages/student/QuizPage'
import { StudentResultPage } from './pages/student/StudentResultPage'
import { StudentSettings } from './pages/student/StudentSettings'

import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { StudentsPage } from './pages/admin/StudentsPage'
import { StudentForm } from './pages/admin/StudentForm'
import { HomeworkPage } from './pages/admin/HomeworkPage'
import { HomeworkForm } from './pages/admin/HomeworkForm'
import { ResultsPage } from './pages/admin/ResultsPage'
import { SettingsPage } from './pages/admin/SettingsPage'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Auth */}
          <Route path="/" element={<Navigate to="/student/login" replace />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Student Area */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/home" element={<StudentHome />} />
              <Route path="/student/result/:resultId" element={<StudentResultPage />} />
              <Route path="/student/settings" element={<StudentSettings />} />
            </Route>
            {/* Standalone full-screen Quiz Page */}
            <Route path="/student/quiz/:homeworkId" element={<QuizPage />} />
          </Route>

          {/* Admin Area */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<StudentsPage />} />
              <Route path="/admin/students/new" element={<StudentForm />} />
              <Route path="/admin/students/:id/edit" element={<StudentForm />} />
              <Route path="/admin/homework" element={<HomeworkPage />} />
              <Route path="/admin/homework/new" element={<HomeworkForm />} />
              <Route path="/admin/homework/:id/edit" element={<HomeworkForm />} />
              <Route path="/admin/results" element={<ResultsPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
