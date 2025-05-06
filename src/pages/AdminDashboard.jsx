import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiEdit, FiTrash2, FiSearch, FiFilter, FiUsers, FiRefreshCw } from 'react-icons/fi'
import { getAllProfiles, deleteProfile } from '../utils/firebaseHelpers'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

function AdminDashboard() {
  const [profiles, setProfiles] = useState([])
  const [filteredProfiles, setFilteredProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  
  // Load all profiles
  useEffect(() => {
    fetchProfiles()
  }, [])
  
  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const allProfiles = await getAllProfiles()
      setProfiles(allProfiles)
      setFilteredProfiles(allProfiles)
    } catch (error) {
      console.error('Error fetching profiles:', error)
      toast.error('Failed to load profiles')
    } finally {
      setLoading(false)
    }
  }
  
  // Apply filters
  useEffect(() => {
    let result = [...profiles]
    
    // Apply skill filter
    if (skillFilter) {
      result = result.filter(profile => profile.skill === skillFilter)
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(profile => 
        profile.name?.toLowerCase().includes(query) ||
        profile.location?.toLowerCase().includes(query) ||
        profile.skill?.toLowerCase().includes(query)
      )
    }
    
    setFilteredProfiles(result)
  }, [searchQuery, skillFilter, profiles])
  
  // Handle profile deletion
  const handleDeleteProfile = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}'s profile? This action cannot be undone.`)) {
      try {
        await deleteProfile(id)
        setProfiles(profiles.filter(profile => profile.id !== id))
        toast.success('Profile deleted successfully')
      } catch (error) {
        console.error('Error deleting profile:', error)
        toast.error('Failed to delete profile')
      }
    }
  }
  
  // Get unique skills from profiles
  const uniqueSkills = [...new Set(profiles.map(profile => profile.skill))].filter(Boolean)
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container-custom py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white p-6">
            <h1 className="text-2xl font-bold flex items-center">
              <FiUsers className="mr-2" />
              Admin Dashboard
            </h1>
            <p className="text-primary-100">
              Manage all service provider profiles from this dashboard.
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, skill, or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <div className="w-full md:w-64">
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="select-field"
                >
                  <option value="">All Skills</option>
                  {uniqueSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              
              <Button 
                variant="secondary"
                onClick={() => {
                  setSearchQuery('')
                  setSkillFilter('')
                }}
                className="w-full md:w-auto"
              >
                <FiFilter className="mr-2" />
                Clear Filters
              </Button>
              
              <Button 
                variant="primary"
                onClick={fetchProfiles}
                className="w-full md:w-auto"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Profiles list */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : filteredProfiles.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skill
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-full object-cover"
                              src={profile.profileImage || "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800"}
                              alt={profile.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                            <div className="text-sm text-gray-500">Created: {new Date(profile.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {profile.skill || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {profile.location || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {profile.phoneNumber || profile.whatsappNumber ? (
                          <div>
                            {profile.phoneNumber && <div>Phone: {profile.phoneNumber}</div>}
                            {profile.whatsappNumber && <div>WhatsApp: {profile.whatsappNumber}</div>}
                          </div>
                        ) : (
                          'No contact info'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Link
                            to={`/profile/${profile.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          <Link
                            to={`/dashboard?edit=${profile.id}`}
                            className="text-yellow-600 hover:text-yellow-900 flex items-center"
                          >
                            <FiEdit className="mr-1" size={14} />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteProfile(profile.id, profile.name)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <FiTrash2 className="mr-1" size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">No Profiles Found</h2>
                <p className="text-gray-600 mb-6">
                  {searchQuery || skillFilter 
                    ? 'No profiles match your search criteria' 
                    : 'There are no service provider profiles in the system yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard