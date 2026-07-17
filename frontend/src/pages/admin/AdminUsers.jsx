import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Users, Shield, User, Key, Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const EMPTY_FORM = { name: '', username: '', password: '', role: 'staff' }

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]   = useState(null)
  const [form, setForm]       = useState(EMPTY_FORM)
  const [saving, setSaving]   = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/users')
      setUsers(res.data)
    } catch { toast.error('Failed to load user accounts.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const openAdd = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (user) => {
    setEditId(user._id)
    setForm({ name: user.name, username: user.username, password: '', role: user.role })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.username.trim()) return toast.error('Name and username are required.')
    if (!editId && !form.password.trim()) return toast.error('Password is required for new users.')
    setSaving(true)
    try {
      const payload = { name: form.name.trim(), username: form.username.trim(), role: form.role }
      if (form.password) payload.password = form.password
      if (editId) {
        await axios.put(`/api/users/${editId}`, payload)
        toast.success('User updated!')
      } else {
        await axios.post('/api/users', { ...payload, password: form.password })
        toast.success('User created!')
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? They will lose all access.')) return
    try {
      await axios.delete(`/api/users/${id}`)
      toast.success('User deleted.')
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark">Staff Accounts</h1>
          <p className="text-gray-500 text-sm font-semibold mt-0.5">{users.length} registered accounts</p>
        </div>
        <button 
          onClick={openAdd} 
          className="btn-primary py-3 px-6 text-sm font-bold self-start sm:self-auto shadow-md shadow-brand-red/10"
        >
          <Plus size={18} /> Add Staff Account
        </button>
      </div>

      {/* Content list / Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-brand-border/40 shadow-sm">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Loading staff list...</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Render list of cards (hidden on desktops) */}
          <div className="block md:hidden space-y-4">
            {users.map(user => (
              <div key={user._id} className="bg-white rounded-2xl p-5 border border-brand-border/30 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                    user.role === 'admin' ? 'bg-brand-red' : 'bg-brand-orange'
                  }`}>
                    {user.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-brand-dark text-base truncate">{user.name}</p>
                      {user._id === currentUser?.id && (
                        <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-1.5 py-0.5 rounded-md">(You)</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs font-mono mt-0.5">@{user.username}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-brand-border/30 gap-2">
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-50 text-brand-red border border-red-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {user.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                      {user.role}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEdit(user)} 
                      className="p-2.5 rounded-xl text-gray-500 hover:text-brand-red border border-gray-200 hover:bg-red-50 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      aria-label="Edit user"
                    >
                      <Pencil size={15} />
                    </button>
                    {user._id !== currentUser?.id && (
                      <button 
                        onClick={() => handleDelete(user._id)} 
                        className="p-2.5 rounded-xl text-gray-500 hover:text-white border border-gray-200 hover:bg-brand-red transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                        aria-label="Delete user"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Render table (hidden on mobile) */}
          <div className="hidden md:block bg-white rounded-3xl border border-brand-border/40 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#090b0e]/5 text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left">Staff Member</th>
                    <th className="px-6 py-4 text-left">Username</th>
                    <th className="px-6 py-4 text-left">Access Role</th>
                    <th className="px-6 py-4 text-left">Registered Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/30">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-brand-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                            user.role === 'admin' ? 'bg-brand-red' : 'bg-brand-orange'
                          }`}>
                            {user.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-brand-dark text-base">{user.name}</p>
                              {user._id === currentUser?.id && (
                                <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-1.5 py-0.5 rounded-md">You</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">@{user.username}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold ${
                          user.role === 'admin' 
                            ? 'bg-red-50 text-brand-red border border-red-200' 
                            : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openEdit(user)} 
                            className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            aria-label="Edit staff member"
                          >
                            <Pencil size={15} />
                          </button>
                          {user._id !== currentUser?.id && (
                            <button 
                              onClick={() => handleDelete(user._id)} 
                              className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                              aria-label="Delete staff member"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-brand-border/40 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border/30">
              <h2 className="font-display text-xl font-extrabold text-brand-dark">
                {editId ? 'Edit Account' : 'Add New Account'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-brand-muted transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="label">Full Name *</label>
                <input 
                  className="input" 
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  placeholder="e.g. Juan dela Cruz" 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="label">Username *</label>
                <input 
                  className="input" 
                  value={form.username} 
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))} 
                  placeholder="e.g. juandelacruz" 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="label">
                  Password {editId && <span className="text-gray-400 font-normal text-xs">(leave blank to keep current)</span>}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Key size={16} />
                  </span>
                  <input 
                    type="password" 
                    className="input pl-10" 
                    value={form.password} 
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
                    placeholder={editId ? '••••••••' : 'Set account password'} 
                    required={!editId}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="label">Access Role</label>
                <select 
                  className="input cursor-pointer" 
                  value={form.role} 
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xxs text-gray-400 font-medium pl-1">
                  Admins can manage staff accounts, categories, and menu items. Staff can manage categories and menu items.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t border-brand-border/30 bg-brand-cream/10">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex-1 btn-primary py-3 font-bold shadow-md shadow-brand-red/10 cursor-pointer min-h-[44px]"
              >
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
