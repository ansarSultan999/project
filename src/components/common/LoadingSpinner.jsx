function LoadingSpinner({ size = 'medium' }) {
  const sizeClass = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }
  
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizeClass[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
    </div>
  )
}

export default LoadingSpinner