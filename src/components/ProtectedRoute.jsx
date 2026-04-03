import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAppContext()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in but wrong role, redirect to their home
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'student') return <Navigate to="/student/home" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
