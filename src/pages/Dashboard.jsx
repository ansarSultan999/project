import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiUser, FiTag, FiMapPin, FiClock, FiPhone, FiMessageSquare, FiEdit, FiImage, FiSave } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { createProfile, getUserProfile, updateProfile, uploadProfileImage, getProfileById } from '../utils/firebaseHelpers'
import { SKILLS, TIME_SLOTS, LOCATIONS } from '../utils/constants'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

function Dashboard() {
  const { currentUser, userData } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (userData?.role === 'user') {
      navigate('/browse-talent');
    }
  }, [userData, navigate]);

  // Form data
  const [profile, setProfile] = useState({
    name: '',
    skill: '',
    skillDescription: '',
    location: '',
    availability: '',
    pricing: '',
    whatsappNumber: '',
    phoneNumber: '',
    profileImage: ''
  })
  
  // UI states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [profileExists, setProfileExists] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [profileId, setProfileId] = useState('')
  
  // Custom availability
  const [customAvailability, setCustomAvailability] = useState(false)
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return
      
      try {
        setLoading(true)
        
        // Check if editing an existing profile
        const editProfileId = searchParams.get('edit')
        if (editProfileId) {
          const profileData = await getProfileById(editProfileId)
          if (profileData) {
            setProfile(profileData)
            setProfileExists(true)
            setEditMode(true)
            setProfileId(editProfileId)
            
            // Check if using custom availability
            if (profileData.availability && !TIME_SLOTS.includes(profileData.availability)) {
              setCustomAvailability(true)
            }
            
            return
          }
        }
        
        // Check if user already has a profile
        const userProfile = await getUserProfile(currentUser.uid)
        if (userProfile) {
          setProfile(userProfile)
          setProfileExists(true)
          setProfileId(userProfile.id)
          
          // Check if using custom availability
          if (userProfile.availability && !TIME_SLOTS.includes(userProfile.availability)) {
            setCustomAvailability(true)
          }
        } else {
          // No profile exists, set name from user data
          setProfile(prev => ({
            ...prev,
            name: currentUser.displayName || ''
          }))
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [currentUser, searchParams])
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    
    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!profile.name || !profile.skill) {
      toast.error('Name and skill are required')
      return
    }
    
    try {
      setSaving(true)
      
      // Upload image if selected
      let imageUrl = profile.profileImage
      if (imageFile) {
        imageUrl = await uploadProfileImage(imageFile, currentUser.uid)
      }
      
      const profileData = {
        ...profile,
        profileImage: imageUrl,
        userId: currentUser.uid
      }
      
      if (profileExists || editMode) {
        // Update existing profile
        await updateProfile(profileId, profileData)
        toast.success('Profile updated successfully')
      } else {
        // Create new profile
        await createProfile(currentUser.uid, profileData)
        toast.success('Profile created successfully')
        setProfileExists(true)
      }
      
      // Reset form state
      setImageFile(null)
      setImagePreview('')
      
      // Redirect if editing someone else's profile (admin)
      if (editMode) {
        navigate(`/profile/${profileId}`)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Page header */}
      <div className="bg-primary-600 text-white">
        <div className="container-custom py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {profileExists ? 'Manage Your Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-primary-100 max-w-2xl">
            {profileExists 
              ? 'Update your information to attract more clients and showcase your skills.'
              : 'Complete your profile to start connecting with potential clients in your area.'}
          </p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {/* Profile image section */}
            <div className="bg-gray-50 p-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                <img
                  src={imagePreview || profile.profileImage || "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800"}
                  alt={profile.name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label 
                  htmlFor="profileImage"
                  className="btn-secondary inline-flex items-center cursor-pointer"
                >
                  <FiImage className="mr-2" />
                  {profile.profileImage ? 'Change Photo' : 'Upload Photo'}
                </label>
              </div>
            </div>
            
            {/* Profile form */}
            <div className="p-6 space-y-6">
              {/* Basic information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiUser className="mr-2 text-primary-600" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
                      Skill *
                    </label>
                    <select
                      id="skill"
                      name="skill"
                      value={profile.skill}
                      onChange={handleChange}
                      className="select-field"
                      required
                    >
                      <option value="">Select a skill</option>
                      {SKILLS.map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Skill description */}
              <div>
                <label htmlFor="skillDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Description
                </label>
                <textarea
                  id="skillDescription"
                  name="skillDescription"
                  value={profile.skillDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your skills, experience, and what services you provide..."
                  className="input-field"
                />
              </div>
              
              {/* Location */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiMapPin className="mr-2 text-primary-600" />
                  Location
                </h2>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="">Select your location</option>
                    {LOCATIONS.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Service details */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiTag className="mr-2 text-primary-600" />
                  Service Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </label>
                    <div className="mb-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={customAvailability}
                          onChange={() => setCustomAvailability(!customAvailability)}
                          className="form-checkbox h-4 w-4 text-primary-600"
                        />
                        <span className="ml-2 text-sm text-gray-600">Custom availability</span>
                      </label>
                    </div>
                    
                    {customAvailability ? (
                      <input
                        type="text"
                        id="availability"
                        name="availability"
                        value={profile.availability}
                        onChange={handleChange}
                        placeholder="E.g., Weekdays 2pm-6pm"
                        className="input-field"
                      />
                    ) : (
                      <select
                        id="availability"
                        name="availability"
                        value={profile.availability}
                        onChange={handleChange}
                        className="select-field"
                      >
                        <option value="">Select availability</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="pricing" className="block text-sm font-medium text-gray-700 mb-1">
                      Pricing (Optional)
                    </label>
                    <input
                      type="text"
                      id="pricing"
                      name="pricing"
                      value={profile.pricing}
                      onChange={handleChange}
                      placeholder="E.g., $20/hour or Starting from $50"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
              
              {/* Contact information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiPhone className="mr-2 text-primary-600" />
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleChange}
                      placeholder="E.g., +1 (123) 456-7890"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={profile.whatsappNumber}
                      onChange={handleChange}
                      placeholder="E.g., +1 (123) 456-7890"
                      className="input-field"
                    />
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-gray-500">
                  Your contact information will only be visible to logged-in users.
                </p>
              </div>
            </div>
            
            {/* Form actions */}
            <div className="bg-gray-50 p-6 flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="flex items-center"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    {profileExists ? 'Update Profile' : 'Create Profile'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Dashboard