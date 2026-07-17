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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark">Categories</h1>
          <p className="text-gray-500 text-sm font-semibold mt-0.5">{categories.length} item categories configured</p>
        </div>
        <button 
          onClick={openAdd} 
          className="btn-primary py-3 px-6 text-sm font-bold self-start sm:self-auto shadow-md shadow-brand-red/10"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Categories Cards Layout */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-brand-border/40 shadow-sm">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-brand-border/60">
          <div className="w-16 h-16 rounded-full bg-brand-red/5 flex items-center justify-center mx-auto mb-4 text-brand-red">
            <Tag size={32} className="stroke-[1.25]" />
          </div>
          <p className="text-gray-600 font-bold">No categories found</p>
          <p className="text-sm text-gray-400 mt-1">Add categories to organize your pizza and beverage items.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div 
              key={cat._id} 
              className="bg-white rounded-3xl border border-brand-border/30 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red flex-shrink-0">
                    <Tag size={18} className="stroke-[2px]" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-brand-dark truncate">{cat.name}</h3>
                </div>
                {cat.description ? (
                  <p className="text-gray-500 text-sm font-light leading-relaxed mt-3 pl-1 line-clamp-3">
                    {cat.description}
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs italic leading-relaxed mt-3 pl-1">
                    No description added for this category.
                  </p>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-brand-border/30">
                <button 
                  onClick={() => openEdit(cat)} 
                  className="p-2.5 rounded-xl text-gray-500 hover:text-brand-red border border-gray-200 hover:bg-red-50 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  aria-label="Edit category"
                >
                  <Pencil size={15} />
                </button>
                <button 
                  onClick={() => handleDelete(cat._id)} 
                  className="p-2.5 rounded-xl text-gray-500 hover:text-white border border-gray-200 hover:bg-brand-red transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  aria-label="Delete category"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-brand-border/40 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border/30">
              <h2 className="font-display text-xl font-extrabold text-brand-dark">
                {editId ? 'Edit Category' : 'Add New Category'}
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
                <label className="label">Category Name *</label>
                <input 
                  className="input" 
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  placeholder="e.g. Pizzas, Beverages, Sides" 
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="label">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea 
                  className="input resize-none" 
                  rows={3} 
                  value={form.description} 
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                  placeholder="Describe what kind of items belong to this category..." 
                />
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
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
