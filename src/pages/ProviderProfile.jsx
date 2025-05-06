import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiMapPin, FiClock, FiTag, FiPhone, FiMessageSquare, FiEdit, FiTrash2, FiLock } from 'react-icons/fi'
import { getProfileById, deleteProfile } from '../utils/firebaseHelpers'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

function ProviderProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { currentUser, isAdmin } = useAuth()
  const navigate = useNavigate()
  
  // Fetch provider profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfileById(id)
        setProfile(profileData)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [id])
  
  // Handle profile deletion
  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      try {
        setLoading(true)
        await deleteProfile(id)
        toast.success('Profile deleted successfully')
        navigate('/browse')
      } catch (error) {
        console.error('Error deleting profile:', error)
        toast.error('Failed to delete profile')
        setLoading(false)
      }
    }
  }
  
  // Check if current user is the profile owner or admin
  const isProfileOwner = currentUser && profile && currentUser.uid === profile.userId
  const canEdit = isProfileOwner || isAdmin
  
  // Default profile image
  const defaultImage = "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800"
  
  if (loading) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }
  
  if (!profile) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Provider Not Found</h2>
        <p className="text-gray-600 mb-6">
          The provider profile you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/browse" className="btn-primary">
          Browse Other Providers
        </Link>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Profile header */}
      <div className="bg-primary-600 text-white">
        <div className="container-custom py-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Profile image */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                src={profile.profileImage || defaultImage}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Profile header info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.name}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 text-primary-100">
                <div className="flex items-center">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {profile.skill}
                  </span>
                </div>
                
                {profile.location && (
                  <div className="flex items-center">
                    <FiMapPin className="mr-1" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
              
              {/* Admin/Owner controls */}
              {canEdit && (
                <div className="flex gap-3 mt-4">
                  <Link 
                    to={`/dashboard?edit=${id}`}
                    className="bg-white text-primary-700 px-4 py-2 rounded-lg font-medium flex items-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </Link>
                  
                  <Button 
                    onClick={handleDeleteProfile}
                    variant="danger"
                  >
                    <FiTrash2 className="mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main profile content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {profile.skillDescription || 'No description provided.'}
              </p>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              
              {currentUser ? (
                <div className="space-y-4">
                  {profile.phoneNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                      <div className="flex items-center">
                        <FiPhone className="text-primary-600 mr-2" />
                        <a 
                          href={`tel:${profile.phoneNumber}`}
                          className="text-primary-600 font-medium hover:underline"
                        >
                          {profile.phoneNumber}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {profile.whatsappNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">WhatsApp</h3>
                      <a 
                        href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary bg-green-600 hover:bg-green-700 w-full flex items-center justify-center"
                      >
                        <FiMessageSquare className="mr-2" />
                        WhatsApp Message
                      </a>
                    </div>
                  )}
                  
                  {(!profile.phoneNumber && !profile.whatsappNumber) && (
                    <p className="text-gray-600">
                      No contact information provided by this service provider.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="mb-4 text-primary-600">
                    <FiLock size={36} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Login to Contact</h3>
                  <p className="text-gray-600 mb-4">
                    You need to login to see the contact information and connect with this provider.
                  </p>
                  <Link to="/login" className="btn-primary w-full">
                    Login to Continue
                  </Link>
                </div>
              )}
            </div>
            
            {/* Service details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Service Details</h2>
              
              <div className="space-y-4">
                {profile.availability && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Availability</h3>
                    <div className="flex items-start">
                      <FiClock className="text-gray-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{profile.availability}</span>
                    </div>
                  </div>
                )}
                
                {profile.pricing && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Pricing</h3>
                    <div className="flex items-start">
                      <FiTag className="text-gray-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{profile.pricing}</span>
                    </div>
                  </div>
                )}
                
                {!profile.availability && !profile.pricing && (
                  <p className="text-gray-600">
                    No service details provided.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderProfile