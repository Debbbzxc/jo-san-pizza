import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, User, ArrowLeft } from 'lucide-react'
import logo from '../assets/logo.png'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  if (user) return <Navigate to="/admin/menu" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return toast.error('Please fill in all fields.')
    setLoading(true)
    try {
      await login(username.trim(), password.trim())
      toast.success('Welcome back!')
      navigate('/admin/menu')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-red/10 blur-[120px] opacity-80" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-orange/10 blur-[120px] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back Link */}
        <div className="flex justify-start">
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold transition-colors duration-200"
          >
            <ArrowLeft size={16} /> Back to Website
          </button>
        </div>

        {/* Portal Header */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <img 
              src={logo} 
              alt="Jo San Pizza Logo" 
              className="w-24 h-24 rounded-full object-cover shadow-2xl ring-4 ring-brand-yellow/10" 
            />
            <div className="absolute inset-0 rounded-full ring-2 ring-brand-yellow/30 animate-pulse" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wide">
            Staff Portal
          </h1>
          <p className="text-white/60 text-sm mt-2 font-light">
            Authorized Personnel Access Only
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-bold tracking-wide">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 transition-all duration-200 text-base"
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-bold tracking-wide">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock size={18} />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl pl-11 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 transition-all duration-200 text-base"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base font-bold shadow-lg shadow-brand-red/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
            >
              <Lock size={18} />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer Notice */}
        <p className="text-center text-white/30 text-xxs sm:text-xs tracking-wider uppercase font-semibold leading-relaxed max-w-xs mx-auto">
          Unauthorized attempts will be logged and monitored.
        </p>
      </div>
    </div>
  )
}
