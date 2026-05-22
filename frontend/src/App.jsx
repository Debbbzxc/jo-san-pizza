import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import LandingPage  from './pages/LandingPage'
import FullMenuPage from './pages/FullMenuPage'
import LoginPage    from './pages/LoginPage'
import AdminLayout  from './pages/admin/AdminLayout'
import AdminMenu    from './pages/admin/AdminMenu'
import AdminUsers   from './pages/admin/AdminUsers'
import AdminCategories from './pages/admin/AdminCategories'

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-brand-red text-xl">Loading...</div>
  if (!user) return <Navigate to="/admin/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/admin/menu" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif' } }} />
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/menu"    element={<FullMenuPage />} />
        <Route path="/admin/login" element={<LoginPage />} />

        <Route path="/admin" element={
          <ProtectedRoute><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/menu" replace />} />
          <Route path="menu"       element={<AdminMenu />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users"      element={
            <ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
