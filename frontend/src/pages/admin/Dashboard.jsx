import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Career Pilot</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">👋 {user?.full_name}</span>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Admin</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Admin Dashboard ⚙️
        </h2>
        <p className="text-gray-500 mb-8">Manage the entire platform</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-semibold text-gray-800 mb-1">Manage Users</h3>
            <p className="text-gray-500 text-sm">Approve, activate or remove users</p>
            <span className="inline-block mt-3 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">Coming soon</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-gray-800 mb-1">Content Approval</h3>
            <p className="text-gray-500 text-sm">Approve instructor materials</p>
            <span className="inline-block mt-3 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">Coming soon</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-800 mb-1">Analytics</h3>
            <p className="text-gray-500 text-sm">View platform statistics</p>
            <span className="inline-block mt-3 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">Coming soon</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold text-gray-800 mb-1">Send Reports</h3>
            <p className="text-gray-500 text-sm">Email reports to instructors</p>
            <span className="inline-block mt-3 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">Coming soon</span>
          </div>

        </div>
      </div>
    </div>
  )
}