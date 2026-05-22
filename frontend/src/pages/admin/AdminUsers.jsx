import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Users, Shield, User } from 'lucide-react'
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
    } catch { toast.error('Failed to load users.') }
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
      const payload = { name: form.name, username: form.username, role: form.role }
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 text-sm">{users.length} staff accounts</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 py-2.5 px-5">
          <Plus size={18} /> Add User
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Username</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Created</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.role === 'admin' ? 'bg-brand-red' : 'bg-brand-green'}`}>
                        {user.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        {user._id === currentUser?.id && (
                          <span className="text-xs text-gray-400">(you)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-mono text-xs">{user.username}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${user.role === 'admin' ? 'bg-red-100 text-brand-red' : 'bg-green-100 text-green-700'}`}>
                      {user.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(user)} className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors">
                        <Pencil size={16} />
                      </button>
                      {user._id !== currentUser?.id && (
                        <button onClick={() => handleDelete(user._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold">{editId ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Maria Santos" />
              </div>
              <div>
                <label className="label">Username *</label>
                <input className="input" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="e.g. mariasantos" />
              </div>
              <div>
                <label className="label">
                  Password {editId && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                </label>
                <input type="password" className="input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder={editId ? '••••••••' : 'Set a password'} />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Admins can manage users. Staff can manage menu and categories.</p>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary py-2.5 disabled:opacity-60">
                {saving ? 'Saving...' : editId ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
