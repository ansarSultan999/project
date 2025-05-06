import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiArrowRight, FiUsers, FiStar, FiMapPin, FiClock } from 'react-icons/fi'
import { getAllProfiles } from '../utils/firebaseHelpers'
import { SKILLS } from '../utils/constants'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'

function Home() {
  const [searchSkill, setSearchSkill] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [featuredProviders, setFeaturedProviders] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Fetch featured providers
  useEffect(() => {
    const fetchFeaturedProviders = async () => {
      try {
        const profiles = await getAllProfiles()
        // Get random 3 providers
        const randomProfiles = profiles
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
        
        setFeaturedProviders(randomProfiles)
      } catch (error) {
        console.error('Error fetching featured providers:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchFeaturedProviders()
  }, [])
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    
    // Build query params
    const params = new URLSearchParams()
    if (searchSkill) params.append('skill', searchSkill)
    if (searchLocation) params.append('location', searchLocation)
    
    // Navigate to browse page with filters
    window.location.href = `/browse?${params.toString()}`
  }
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Find Skilled Service Providers Near You
            </h1>
            <p className="text-xl mb-8 text-primary-100 animate-fade-in">
              Connect with trusted professionals for your everyday needs - from teaching and cooking to beauty services and more.
            </p>
            
            {/* Search Form */}
            <form 
              onSubmit={handleSearch}
              className="bg-white p-2 rounded-lg shadow-lg flex flex-col md:flex-row animate-fade-in"
            >
              <div className="flex-1 p-2">
                <label htmlFor="skill" className="block text-gray-700 text-sm font-medium mb-1">
                  What service do you need?
                </label>
                <select
                  id="skill"
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  className="select-field"
                >
                  <option value="">Select a skill</option>
                  {SKILLS.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1 p-2">
                <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-1">
                  Where do you need it?
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Enter your location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div className="p-2 flex items-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="large"
                  className="w-full md:w-auto flex items-center justify-center"
                >
                  <FiSearch className="mr-2" />
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 100"
            fill="#FFFFFF"
          >
            <path d="M0,96L80,90.7C160,85,320,75,480,69.3C640,64,800,64,960,69.3C1120,75,1280,85,1360,90.7L1440,96L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z" />
          </svg>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">
              Browse through our wide range of services offered by skilled professionals in your area.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {SKILLS.map((skill) => (
              <Link 
                key={skill}
                to={`/browse?skill=${encodeURIComponent(skill)}`}
                className="group"
              >
                <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden text-center p-6 transition-all duration-200 hover:shadow-md hover:border-primary-200 hover:bg-primary-50">
                  <div className="mb-4 text-primary-600">
                    {/* Simple icon representation - in a real app, use different icons for each skill */}
                    {skill === 'Mehndi Design' && <span className="text-4xl">💅</span>}
                    {skill === 'Teaching' && <span className="text-4xl">📚</span>}
                    {skill === 'Cleaning' && <span className="text-4xl">🧹</span>}
                    {skill === 'Cooking' && <span className="text-4xl">🍳</span>}
                    {skill === 'Beautician' && <span className="text-4xl">💇‍♀️</span>}
                    {skill === 'Sewing' && <span className="text-4xl">🧵</span>}
                    {skill === 'Babysitting' && <span className="text-4xl">👶</span>}
                    {skill === 'Quran Teaching' && <span className="text-4xl">📖</span>}
                    {skill === 'Handicrafts' && <span className="text-4xl">🧶</span>}
                    {skill === 'Online Tutoring' && <span className="text-4xl">💻</span>}
                  </div>
                  <h3 className="font-medium text-gray-900">{skill}</h3>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/browse" className="btn-primary inline-flex items-center">
              Browse All Services <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Providers Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Service Providers</h2>
            <p className="text-lg text-gray-600">
              Meet some of our top-rated professionals ready to help you with their expertise.
            </p>
          </div>
          
          {loading ? (
            <LoadingSpinner size="large" />
          ) : featuredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProviders.map((provider) => (
                <div key={provider.id} className="card hover:translate-y-[-5px] transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={provider.profileImage || "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800"}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{provider.name}</h3>
                    <div className="flex items-center text-yellow-500 mb-2">
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <span className="ml-2 text-gray-600">5.0</span>
                    </div>
                    <p className="text-primary-600 font-medium mb-3">{provider.skill}</p>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FiMapPin className="mr-2" />
                      <span>{provider.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <FiClock className="mr-2" />
                      <span>{provider.availability || 'Flexible hours'}</span>
                    </div>
                    <Link 
                      to={`/profile/${provider.id}`}
                      className="btn-primary w-full text-center"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>No featured providers available at the moment.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              SkillConnect makes it easy to find and connect with service providers in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiSearch size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">
                Search for service providers based on your specific needs and location.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiUsers size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Browse profiles, reviews, and availability to find the perfect match.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiStar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hire</h3>
              <p className="text-gray-600">
                Contact and hire professionals with confidence through our secure platform.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-600 to-secondary-800 text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Share Your Skills?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join our community of service providers and reach new customers in your area.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="btn-primary bg-white text-secondary-700 hover:bg-gray-100">
                Sign Up as Provider
              </Link>
              <Link to="/browse" className="btn-secondary bg-transparent text-white border-white hover:bg-secondary-700">
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home