import { useNavigate } from 'react-router-dom'
import { BiErrorCircle } from 'react-icons/bi' // Using a nice error icon (install with `npm install react-icons`)
import { ArrowLeft } from 'lucide-react'

function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col justify-center items-center h-[80vh] text-center px-6">
      <BiErrorCircle className="text-red-500 text-6xl mb-4" />

      <h1 className="text-3xl font-semibold text-gray-800 mb-2">Oops! Something went wrong.</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        We couldn't find the page you were looking for, or an unexpected error occurred. Please try again or go back.
      </p>

      <button
        onClick={() => navigate(-1)} // Go to previous page
        className="px-5 py-2 border-2 flex gap-2 text-red-500 border-red-500  rounded hover:bg-red-700 hover:text-white transition duration-200"
      >
        <ArrowLeft/> Go Back
      </button>
    </div>
  )
}

export default ErrorPage
