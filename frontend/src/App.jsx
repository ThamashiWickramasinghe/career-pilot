import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import JobSeekerDashboard from './pages/jobseeker/Dashboard'
import InstructorDashboard from './pages/instructor/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-indigo-600 text-xl font-semibold">Loading...</div>
    </div>
  )
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/instructor/dashboard" element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App