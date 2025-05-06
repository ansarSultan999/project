import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layout
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'

// Lazy-loaded pages for better performance
const Home = lazy(() => import('./pages/Home'))
const BrowseTalent = lazy(() => import('./pages/BrowseTalent'))
const ProviderProfile = lazy(() => import('./pages/ProviderProfile'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const { currentUser, isAdmin } = useAuth()

  // Protected route wrapper to redirect non-authenticated users
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  // Admin route wrapper to redirect non-admin users
  const AdminRoute = ({ children }) => {
    if (!isAdmin) {
      return <Navigate to="/" replace />
    }
    return children
  }

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseTalent />} />
          <Route path="/profile/:id" element={<ProviderProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App