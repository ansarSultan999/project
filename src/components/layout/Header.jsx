import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { currentUser, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to logout', error)
    }
  }
  
  // Active link style
  const activeStyle = "text-primary-600 font-medium"
  const inactiveStyle = "text-gray-600 hover:text-primary-600 transition-colors"
  
  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || location.pathname !== '/' 
          ? 'bg-white shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/favicon.svg" alt="SkillConnect Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-primary-600">SkillConnect</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
            >
              Home
            </NavLink>
            <NavLink 
              to="/browse" 
              className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
            >
              Browse Talent
            </NavLink>
            
            {/* Conditional rendering based on auth state */}
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <FiUser className="text-primary-600" />
                  <span>{currentUser.displayName || 'User'}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  {isAdmin ? (
                    <Link 
                      to="/admin-dashboard" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Dashboard
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink 
                  to="/login" 
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="btn-primary"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-primary-600"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `block py-2 ${isActive ? activeStyle : inactiveStyle}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/browse" 
              className={({ isActive }) => 
                `block py-2 ${isActive ? activeStyle : inactiveStyle}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Talent
            </NavLink>
            
            {currentUser ? (
              <>
                {isAdmin ? (
                  <NavLink 
                    to="/admin-dashboard" 
                    className="block py-2 text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </NavLink>
                ) : (
                  <NavLink 
                    to="/dashboard" 
                    className="block py-2 text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Dashboard
                  </NavLink>
                )}
                
                <button 
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center py-2 text-gray-600 hover:text-primary-600"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <NavLink 
                  to="/login" 
                  className="py-2 text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header