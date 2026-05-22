import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Pizza, Users, Tag, LogOut, Menu, X, Home } from 'lucide-react'
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
      ? [{ to: '/admin/users', icon: Users, label: 'Users' }]
      : []),
  ]

  const Sidebar = ({ mobile }) => (
    <aside className={`${mobile ? 'fixed inset-0 z-50 flex' : 'hidden md:flex'} flex-col bg-brand-dark text-white ${mobile ? 'w-64' : 'w-64'} min-h-screen`}>
      {mobile && (
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X size={24} />
        </button>
      )}
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Jo San Pizza" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-display font-bold text-sm">Jo San Pizza</p>
            <p className="text-white/40 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-white/10">
        <p className="text-sm font-semibold">{user?.name}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user?.role === 'admin' ? 'bg-brand-yellow/20 text-brand-yellow' : 'bg-brand-green/20 text-green-400'}`}>
          {user?.role}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <NavLink to="/" target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all">
          <Home size={18} /> View Website
        </NavLink>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
          <Sidebar mobile />
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between md:justify-end">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-500 hover:text-gray-800">
            <Menu size={22} />
          </button>
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
