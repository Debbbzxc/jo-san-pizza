import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Pizza, Users, Tag, LogOut, Menu, X, Home, Shield, User } from 'lucide-react'
import { useState } from 'react'
import logo from '../../assets/logo.png'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navItems = [
    { to: '/admin/menu',       icon: Pizza,  label: 'Menu Items'  },
    { to: '/admin/categories', icon: Tag,    label: 'Categories'  },
    ...(user?.role === 'admin'
      ? [{ to: '/admin/users', icon: Users, label: 'Staff Accounts' }]
      : []),
  ]

  const Sidebar = ({ mobile, onCloseSidebar }) => (
    <aside className={`flex flex-col bg-brand-dark text-white w-64 min-h-screen ${mobile ? 'h-full' : ''}`}>
      {/* Sidebar Header / Logo */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Jo San Pizza Logo" className="w-10 h-10 rounded-full object-cover border border-white/10" />
          <div>
            <p className="font-display font-bold text-sm tracking-wide text-white">Jo San Pizza</p>
            <p className="text-white/40 text-xxs tracking-wider uppercase font-semibold">Admin Panel</p>
          </div>
        </div>
        {mobile && (
          <button 
            onClick={onCloseSidebar} 
            className="text-white/60 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-6 py-5 border-b border-white/5 bg-[#090b0e]/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-red flex items-center justify-center font-bold text-sm text-white shadow-md">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-1 ${
              user?.role === 'admin' 
                ? 'bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/10' 
                : 'bg-brand-green/15 text-brand-green border border-brand-green/10'
            }`}>
              {user?.role === 'admin' ? <Shield size={8} /> : <User size={8} />}
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => mobile && onCloseSidebar()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={18} className="stroke-[2px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 bg-[#090b0e]/20 space-y-2">
        <NavLink 
          to="/" 
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 min-h-[44px]"
        >
          <Home size={18} /> View Website
        </NavLink>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 min-h-[44px] cursor-pointer"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-brand-cream overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block shadow-2xl z-30">
        <Sidebar mobile={false} />
      </div>

      {/* Mobile sidebar drawer */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
        sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}>
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
        {/* Sidebar Container */}
        <div className={`absolute top-0 bottom-0 left-0 w-64 shadow-2xl transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar mobile={true} onCloseSidebar={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main content body */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Top bar */}
        <header className="bg-white border-b border-brand-border/40 px-6 py-4 flex items-center justify-between md:justify-end shadow-sm z-10">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="md:hidden p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-brand-muted transition-colors focus:ring-2 focus:ring-brand-red/30 focus:outline-none"
            aria-label="Open menu drawer"
          >
            <Menu size={22} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-brand-dark">{user?.name}</p>
              <p className="text-xs text-gray-400 font-medium capitalize">{user?.role} Account</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-red/10 border border-brand-red/20 flex items-center justify-center font-bold text-sm text-brand-red">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Dashboard Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-brand-cream/30">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
