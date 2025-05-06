import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="/favicon.svg" alt="SkillConnect Logo" className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">SkillConnect</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Connecting you with skilled service providers in your local area.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-white transition-colors">
                  Browse Talent
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="text-gray-400 hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse?skill=Mehndi Design" className="text-gray-400 hover:text-white transition-colors">
                  Mehndi Design
                </Link>
              </li>
              <li>
                <Link to="/browse?skill=Teaching" className="text-gray-400 hover:text-white transition-colors">
                  Teaching
                </Link>
              </li>
              <li>
                <Link to="/browse?skill=Cleaning" className="text-gray-400 hover:text-white transition-colors">
                  Cleaning
                </Link>
              </li>
              <li>
                <Link to="/browse?skill=Cooking" className="text-gray-400 hover:text-white transition-colors">
                  Cooking
                </Link>
              </li>
              <li>
                <Link to="/browse?skill=Beautician" className="text-gray-400 hover:text-white transition-colors">
                  Beautician
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="not-italic text-gray-400">
              <p className="mb-2">1234 Service Street</p>
              <p className="mb-2">Skilltown, SK 12345</p>
              <p className="mb-2">Email: info@skillconnect.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-gray-400">
            © {year} SkillConnect. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link to="#" className="text-gray-400 hover:text-white transition-colors mx-2">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors mx-2">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer