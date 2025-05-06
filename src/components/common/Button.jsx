import { twMerge } from 'tailwind-merge'

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  className,
  fullWidth = false,
  type = 'button',
  ...props 
}) {
  const baseStyles = 'font-medium rounded-lg transition duration-200 ease-in-out focus:outline-none'
  
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50',
    secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50',
    accent: 'bg-accent-600 hover:bg-accent-700 text-white focus:ring-2 focus:ring-accent-500 focus:ring-opacity-50',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-500 focus:ring-opacity-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500 focus:ring-opacity-50',
    link: 'bg-transparent hover:underline text-primary-600 hover:text-primary-700'
  }
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  }
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:-translate-y-0.5'
  const widthStyles = fullWidth ? 'w-full' : ''
  
  const buttonStyles = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabledStyles,
    widthStyles,
    className
  )
  
  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button