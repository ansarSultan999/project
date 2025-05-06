import { Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiTag } from 'react-icons/fi'

function ProviderCard({ provider }) {
  const { id, name, profileImage, skill, location, availability, pricing } = provider
  
  // Default profile image if none provided
  const defaultImage = "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800"
  
  return (
    <div className="card group animate-fade-in">
      {/* Card image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={profileImage || defaultImage} 
          alt={`${name} - ${skill}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 bg-primary-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
          {skill}
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <FiMapPin className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-gray-600">{location}</span>
          </div>
          
          {availability && (
            <div className="flex items-start">
              <FiClock className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{availability}</span>
            </div>
          )}
          
          {pricing && (
            <div className="flex items-start">
              <FiTag className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{pricing}</span>
            </div>
          )}
        </div>
        
        <Link 
          to={`/profile/${id}`}
          className="block w-full text-center bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium py-2 rounded-lg transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}

export default ProviderCard