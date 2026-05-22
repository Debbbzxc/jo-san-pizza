import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editId, setEditId]         = useState(null)
  const [form, setForm]             = useState({ name: '', description: '' })
  const [saving, setSaving]         = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/categories')
      setCategories(res.data)
    } catch { toast.error('Failed to load categories.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCategories() }, [])

  const openAdd = () => {
    setEditId(null)
    setForm({ name: '', description: '' })
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditId(cat._id)
    setForm({ name: cat.name, description: cat.description || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Category name is required.')
    setSaving(true)
    try {
      if (editId) {
        await axios.put(`/api/categories/${editId}`, form)
        toast.success('Category updated!')
      } else {
        await axios.post('/api/categories', form)
        toast.success('Category added!')
      }
      setShowModal(false)
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Make sure no menu items are using it.')) return
    try {
      await axios.delete(`/api/categories/${id}`)
      toast.success('Category deleted.')
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 py-2.5 px-5">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Tag size={48} className="mx-auto mb-4 opacity-30" />
          <p>No categories yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className="bg-white rounded-2xl shadow-sm p-5 flex items-start justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-brand-red/10 rounded-lg flex items-center justify-center">
                    <Tag size={16} className="text-brand-red" />
                  </div>
                  <h3 className="font-bold text-gray-800">{cat.name}</h3>
                </div>
                {cat.description && (
                  <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
                )}
              </div>
              <div className="flex gap-1 ml-4 flex-shrink-0">
                <button onClick={() => openEdit(cat)} className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold">{editId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Category Name *</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Pizzas, Beverages, Sides..." />
              </div>
              <div>
                <label className="label">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary py-2.5 disabled:opacity-60">
                {saving ? 'Saving...' : editId ? 'Update' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
