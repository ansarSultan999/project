import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiLock, FiShield } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { adminLogin } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error('Please enter both username and password')
      return
    }
    
    try {
      setLoading(true)
      await adminLogin(username, password)
      toast.success('Admin login successful')
      navigate('/admin-dashboard')
    } catch (error) {
      console.error('Admin login error:', error)
      toast.error('Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">
              Access the admin dashboard to manage service providers.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field pl-10"
                    placeholder="admin"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiShield className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Default admin credentials:<br />
                      Username: <strong>admin</strong><br />
                      Password: <strong>admin</strong>
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  fullWidth
                  className="flex justify-center items-center"
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <FiShield className="mr-2" />
                      Admin Login
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Not an admin?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Regular Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin