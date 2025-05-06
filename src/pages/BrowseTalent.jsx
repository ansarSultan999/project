import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiSearch, FiX } from 'react-icons/fi'
import { getAllProfiles, getProfilesBySkill, getProfilesByLocation } from '../utils/firebaseHelpers'
import { SKILLS, LOCATIONS } from '../utils/constants'
import ProviderCard from '../components/common/ProviderCard'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'

function BrowseTalent() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [profiles, setProfiles] = useState([])
  const [filteredProfiles, setFilteredProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [skillFilter, setSkillFilter] = useState(searchParams.get('skill') || '')
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Fetch all profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true)
        let fetchedProfiles = []
        
        // If both skill and location are provided
        if (skillFilter && locationFilter) {
          // This is a simplified approach - in a real app, you'd use a compound query
          const skillProfiles = await getProfilesBySkill(skillFilter)
          fetchedProfiles = skillProfiles.filter(
            profile => profile.location?.toLowerCase().includes(locationFilter.toLowerCase())
          )
        } 
        // If only skill is provided
        else if (skillFilter) {
          fetchedProfiles = await getProfilesBySkill(skillFilter)
        } 
        // If only location is provided
        else if (locationFilter) {
          fetchedProfiles = await getProfilesByLocation(locationFilter)
        } 
        // If no filters are provided
        else {
          fetchedProfiles = await getAllProfiles()
        }
        
        setProfiles(fetchedProfiles)
        setFilteredProfiles(fetchedProfiles)
      } catch (error) {
        console.error('Error fetching profiles:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfiles()
  }, [skillFilter, locationFilter])
  
  // Handle search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProfiles(profiles)
      return
    }
    
    const lowercasedQuery = searchQuery.toLowerCase()
    const filtered = profiles.filter(profile => 
      profile.name?.toLowerCase().includes(lowercasedQuery) ||
      profile.skill?.toLowerCase().includes(lowercasedQuery) ||
      profile.location?.toLowerCase().includes(lowercasedQuery) ||
      profile.skillDescription?.toLowerCase().includes(lowercasedQuery)
    )
    
    setFilteredProfiles(filtered)
  }, [searchQuery, profiles])
  
  // Apply filters
  const applyFilters = () => {
    // Update URL params
    const params = new URLSearchParams()
    if (skillFilter) params.set('skill', skillFilter)
    if (locationFilter) params.set('location', locationFilter)
    setSearchParams(params)
    
    // Close mobile filter panel
    setShowFilters(false)
  }
  
  // Clear filters
  const clearFilters = () => {
    setSkillFilter('')
    setLocationFilter('')
    setSearchQuery('')
    setSearchParams({})
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Page header */}
      <div className="bg-primary-600 text-white">
        <div className="container-custom py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Find Service Providers</h1>
          <p className="text-primary-100 max-w-2xl">
            Browse our talented service providers and find the perfect match for your needs.
          </p>
        </div>
      </div>
      
      <div className="container-custom pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            <div className="space-y-6">
              {/* Skill filter */}
              <div>
                <label htmlFor="skill-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Skill
                </label>
                <select
                  id="skill-filter"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="select-field"
                >
                  <option value="">All Skills</option>
                  {SKILLS.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              
              {/* Location filter */}
              <div>
                <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location-filter"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="select-field"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={applyFilters}
                  className="w-full"
                >
                  Apply Filters
                </Button>
                <Button 
                  onClick={clearFilters}
                  variant="secondary"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {/* Search and filter button - Mobile & Desktop */}
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, skill, or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              {/* Filter button - Mobile only */}
              <Button 
                onClick={() => setShowFilters(true)}
                variant="secondary"
                className="md:hidden w-full sm:w-auto"
              >
                <FiFilter className="mr-2" />
                Filters
              </Button>
            </div>
            
            {/* Active filters display */}
            {(skillFilter || locationFilter) && (
              <div className="flex flex-wrap items-center gap-2 mb-4 animate-fade-in">
                <span className="text-sm text-gray-600">Active filters:</span>
                
                {skillFilter && (
                  <div className="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full flex items-center">
                    <span>Skill: {skillFilter}</span>
                    <button 
                      onClick={() => setSkillFilter('')}
                      className="ml-2 text-primary-500 hover:text-primary-700"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                
                {locationFilter && (
                  <div className="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full flex items-center">
                    <span>Location: {locationFilter}</span>
                    <button 
                      onClick={() => setLocationFilter('')}
                      className="ml-2 text-primary-500 hover:text-primary-700"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}
            
            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {loading ? 'Searching...' : `${filteredProfiles.length} providers found`}
              </p>
            </div>
            
            {/* Results grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <img 
                  src="https://images.pexels.com/photos/4439444/pexels-photo-4439444.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="No results found"
                  className="w-52 h-52 object-cover mx-auto mb-6 rounded-lg opacity-75"
                />
                <h3 className="text-xl font-semibold mb-2">No providers found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any providers matching your search criteria.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile filters drawer */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end animate-fade-in">
          <div className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto animate-slide-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Skill filter */}
                <div>
                  <label htmlFor="mobile-skill-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Skill
                  </label>
                  <select
                    id="mobile-skill-filter"
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="select-field"
                  >
                    <option value="">All Skills</option>
                    {SKILLS.map((skill) => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
                
                {/* Location filter */}
                <div>
                  <label htmlFor="mobile-location-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    id="mobile-location-filter"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="select-field"
                  >
                    <option value="">All Locations</option>
                    {LOCATIONS.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={applyFilters}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                  <Button 
                    onClick={clearFilters}
                    variant="secondary"
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrowseTalent