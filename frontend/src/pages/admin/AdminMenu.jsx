import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { UPLOADS_URL } from '../../config'
import { Plus, Pencil, Trash2, Star, StarOff, X, ImagePlus, PlusCircle, Minus } from 'lucide-react'

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '',
  isBestSeller: false, isAvailable: true,
  variations: [], // [{ label, price }]
}

export default function AdminMenu() {
  const [items, setItems]           = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [editId, setEditId]         = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile]   = useState(null)
  const [saving, setSaving]         = useState(false)
  const fileRef = useRef()

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [menuRes, catRes] = await Promise.all([
        axios.get('/api/menu/all'),
        axios.get('/api/categories'),
      ])
      setItems(menuRes.data)
      setCategories(catRes.data)
    } catch { toast.error('Failed to load data.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const openAdd = () => {
    setEditId(null)
    setForm({ ...EMPTY_FORM, category: categories[0]?._id || '' })
    setPhotoPreview(null)
    setPhotoFile(null)
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditId(item._id)
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price ?? '',
      category: item.category?._id || '',
      isBestSeller: item.isBestSeller,
      isAvailable: item.isAvailable,
      variations: item.variations || [],
    })
    setPhotoPreview(item.photo ? `${UPLOADS_URL}/${item.photo}` : null)
    setPhotoFile(null)
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditId(null) }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  // Variation helpers
  const addVariation = () => setForm(f => ({ ...f, variations: [...f.variations, { label: '', price: '' }] }))
  const removeVariation = (i) => setForm(f => ({ ...f, variations: f.variations.filter((_, idx) => idx !== i) }))
  const updateVariation = (i, key, val) => setForm(f => {
    const v = [...f.variations]
    v[i] = { ...v[i], [key]: val }
    return { ...f, variations: v }
  })

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Item name is required.')
    if (!form.category)    return toast.error('Please select a category.')
    if (form.variations.length === 0 && form.price === '') return toast.error('Provide a price or at least one variation.')
    for (const v of form.variations) {
      if (!v.label.trim() || v.price === '') return toast.error('All variation fields must be filled.')
    }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('description', form.description)
      fd.append('category', form.category)
      fd.append('isBestSeller', form.isBestSeller)
      fd.append('isAvailable', form.isAvailable)
      fd.append('variations', JSON.stringify(
        form.variations.map(v => ({ label: v.label, price: Number(v.price) }))
      ))
      if (form.variations.length === 0) fd.append('price', form.price)
      if (photoFile) fd.append('photo', photoFile)

      if (editId) {
        await axios.put(`/api/menu/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Menu item updated!')
      } else {
        await axios.post('/api/menu', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Menu item added!')
      }
      closeModal()
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this menu item? This cannot be undone.')) return
    try {
      await axios.delete(`/api/menu/${id}`)
      toast.success('Item deleted.')
      fetchAll()
    } catch { toast.error('Failed to delete item.') }
  }

  const toggleBestSeller = async (item) => {
    try {
      const fd = new FormData()
      fd.append('name', item.name)
      fd.append('description', item.description || '')
      fd.append('category', item.category?._id || item.category)
      fd.append('isBestSeller', !item.isBestSeller)
      fd.append('isAvailable', item.isAvailable)
      fd.append('variations', JSON.stringify(item.variations || []))
      if (item.variations?.length === 0 && item.price != null) fd.append('price', item.price)
      await axios.put(`/api/menu/${item._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(item.isBestSeller ? 'Removed from best sellers.' : 'Marked as best seller!')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update.')
    }
  }

  const formatPrice = (item) => {
    if (item.variations?.length > 0) {
      const min = Math.min(...item.variations.map(v => v.price))
      return `From ₱${min}`
    }
    return item.price != null ? `₱${item.price}` : '—'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Menu Items</h1>
          <p className="text-gray-500 text-sm">{items.length} items total</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 py-2.5 px-5">
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading menu items...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🍕</div>
          <p>No menu items yet. Add your first one!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Item</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-left">Price</th>
                  <th className="px-5 py-3 text-center">Best Seller</th>
                  <th className="px-5 py-3 text-center">Available</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.photo ? (
                            <img src={`${UPLOADS_URL}/${item.photo}`} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🍕</div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-gray-400 text-xs truncate max-w-[200px]">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-brand-red/10 text-brand-red text-xs px-2 py-1 rounded-full font-medium">
                        {item.category?.name || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-700">{formatPrice(item)}</td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => toggleBestSeller(item)}
                              className={`p-1.5 rounded-lg transition-colors ${item.isBestSeller ? 'text-brand-yellow bg-yellow-50 hover:bg-yellow-100' : 'text-gray-300 hover:text-brand-yellow hover:bg-yellow-50'}`}>
                        {item.isBestSeller ? <Star size={18} fill="currentColor" /> : <Star size={18} />}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold">{editId ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Photo upload */}
              <div>
                <label className="label">Photo</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl h-40 flex items-center justify-center hover:border-brand-red transition-colors overflow-hidden"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImagePlus size={32} className="mx-auto mb-2" />
                      <p className="text-sm">Click to upload photo</p>
                      <p className="text-xs">JPG, PNG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileRef} accept="image/*" onChange={handlePhoto} className="hidden" />
              </div>

              {/* Name */}
              <div>
                <label className="label">Item Name *</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Hawaiian Pizza" />
              </div>

              {/* Description */}
              <div>
                <label className="label">Description</label>
                <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the item..." />
              </div>

              {/* Category */}
              <div>
                <label className="label">Category *</label>
                <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              {/* Pricing section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Pricing</label>
                  <button type="button" onClick={addVariation}
                          className="text-xs text-brand-red hover:text-red-700 flex items-center gap-1 font-medium">
                    <PlusCircle size={14} /> Add Variation
                  </button>
                </div>

                {form.variations.length === 0 ? (
                  <div>
                    <input
                      type="number" min="0" className="input"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="Flat price (e.g. 299)"
                    />
                    <p className="text-xs text-gray-400 mt-1">Or add variations (e.g. Solo, Party size) using the button above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {form.variations.map((v, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input className="input flex-1" placeholder="Label (e.g. Solo)" value={v.label} onChange={e => updateVariation(i, 'label', e.target.value)} />
                        <input className="input w-28" type="number" min="0" placeholder="Price" value={v.price} onChange={e => updateVariation(i, 'price', e.target.value)} />
                        <button onClick={() => removeVariation(i)} className="text-gray-400 hover:text-red-500 p-1"><Minus size={16} /></button>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400">Will display as "From ₱{Math.min(...form.variations.filter(v=>v.price).map(v=>Number(v.price)), Infinity) || '?'}"</p>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-brand-red w-4 h-4"
                    checked={form.isBestSeller}
                    onChange={e => setForm(f => ({ ...f, isBestSeller: e.target.checked }))} />
                  <span className="text-sm font-medium text-gray-700">Best Seller ⭐ (max 4)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-brand-red w-4 h-4"
                    checked={form.isAvailable}
                    onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))} />
                  <span className="text-sm font-medium text-gray-700">Available</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={closeModal} className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                      className="flex-1 btn-primary py-2.5 disabled:opacity-60">
                {saving ? 'Saving...' : editId ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
