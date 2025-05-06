import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center py-16 px-4">
      <img 
        src="https://images.pexels.com/photos/4439445/pexels-photo-4439445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Page not found"
        className="w-64 h-64 object-cover rounded-full mb-8 shadow-lg"
      />
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700">Page Not Found</h2>
      <p className="text-center text-gray-600 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
        <Link to="/browse">
          <Button variant="secondary">Browse Talent</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound