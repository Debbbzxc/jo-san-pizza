import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../config'
import { Plus, Pencil, Trash2, Star, StarOff, X, ImagePlus, PlusCircle, Minus, Tag, ShieldCheck, Check, AlertCircle } from 'lucide-react'

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '',
  isBestSeller: false, isAvailable: true,
  variations: [], // [{ label, price }]
  photo: null,
}

const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET) are missing.');
  }

  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: fd,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Cloudinary upload failed.');
  }

  const data = await response.json();
  return data.secure_url;
};


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
    } catch { toast.error('Failed to load menu data.') }
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
      photo: item.photo,
    })
    setPhotoPreview(item.photo ? getImageUrl(item.photo) : null)
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
    let uploadedPhotoUrl = form.photo;

    if (photoFile) {
      const uploadToastId = toast.loading('Uploading image to Cloudinary...');
      try {
        uploadedPhotoUrl = await uploadToCloudinary(photoFile);
        toast.success('Image uploaded successfully!', { id: uploadToastId });
      } catch (err) {
        toast.error(err.message || 'Cloudinary upload failed.', { id: uploadToastId });
        setSaving(false);
        return;
      }
    }

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        isBestSeller: form.isBestSeller,
        isAvailable: form.isAvailable,
        variations: form.variations.map(v => ({ label: v.label.trim(), price: Number(v.price) })),
        price: form.variations.length === 0 ? Number(form.price) : null,
        photo: uploadedPhotoUrl,
      }

      if (editId) {
        await axios.put(`/api/menu/${editId}`, payload)
        toast.success('Menu item updated!')
      } else {
        await axios.post('/api/menu', payload)
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
      const payload = {
        name: item.name,
        description: item.description || '',
        category: item.category?._id || item.category,
        isBestSeller: !item.isBestSeller,
        isAvailable: item.isAvailable,
        variations: item.variations || [],
        price: item.variations?.length === 0 ? item.price : null,
        photo: item.photo,
      }
      await axios.put(`/api/menu/${item._id}`, payload)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark">Menu Items</h1>
          <p className="text-gray-500 text-sm font-semibold mt-0.5">{items.length} items total in store</p>
        </div>
        <button 
          onClick={openAdd} 
          className="btn-primary py-3 px-6 text-sm font-bold self-start sm:self-auto shadow-md shadow-brand-red/10"
        >
          <Plus size={18} /> Add Menu Item
        </button>
      </div>

      {/* Content list / Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-brand-border/40 shadow-sm">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Loading menu list...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-brand-border/60">
          <div className="w-16 h-16 rounded-full bg-brand-red/5 flex items-center justify-center mx-auto mb-4 text-brand-red">
            <Plus size={32} />
          </div>
          <p className="text-gray-600 font-bold">No menu items found</p>
          <p className="text-sm text-gray-400 mt-1">Get started by creating your very first menu item.</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Render list of cards (hidden on desktops) */}
          <div className="block md:hidden space-y-4">
            {items.map(item => (
              <div key={item._id} className="bg-white rounded-2xl p-5 border border-brand-border/30 shadow-sm space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-cream border border-brand-border/40 flex-shrink-0">
                    {item.photo ? (
                      <img src={getImageUrl(item.photo)} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🍕</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg text-brand-dark truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{item.category?.name || 'Uncategorized'}</p>
                    <p className="text-brand-red font-bold text-base mt-1">{formatPrice(item)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-brand-border/30">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => toggleBestSeller(item)}
                      className={`p-2.5 rounded-xl border transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        item.isBestSeller 
                          ? 'text-brand-yellow bg-yellow-50 border-brand-yellow/30 shadow-sm' 
                          : 'text-gray-400 border-gray-200 bg-white'
                      }`}
                      aria-label="Toggle best seller"
                    >
                      <Star size={18} fill={item.isBestSeller ? "currentColor" : "none"} />
                    </button>
                    
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full ${
                      item.isAvailable 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-gray-50 text-gray-400 border border-gray-200'
                    }`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEdit(item)} 
                      className="p-2.5 rounded-xl text-gray-500 hover:text-brand-red border border-gray-200 hover:bg-red-50 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Edit item"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="p-2.5 rounded-xl text-gray-500 hover:text-white border border-gray-200 hover:bg-brand-red transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Delete item"
                    >
                      <Trash2 size={16} />
                    </button>
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
                    <th className="px-6 py-4 text-left">Item Name</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-center">Best Seller</th>
                    <th className="px-6 py-4 text-center">Available</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/30">
                  {items.map(item => (
                    <tr key={item._id} className="hover:bg-brand-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-brand-cream border border-brand-border/40 flex-shrink-0 shadow-sm">
                            {item.photo ? (
                              <img src={getImageUrl(item.photo)} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">🍕</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-brand-dark text-base truncate">{item.name}</p>
                            <p className="text-gray-400 text-xs truncate max-w-[280px] mt-0.5">{item.description || 'No description provided.'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-brand-red/10 text-brand-red text-xs px-2.5 py-1 rounded-full font-bold">
                          {item.category?.name || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-dark text-base">{formatPrice(item)}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleBestSeller(item)}
                          className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                            item.isBestSeller 
                              ? 'text-brand-yellow bg-yellow-50 hover:bg-yellow-100 shadow-sm border border-brand-yellow/20' 
                              : 'text-gray-300 hover:text-brand-yellow hover:bg-yellow-50 border border-transparent'
                          }`}
                        >
                          <Star size={18} fill={item.isBestSeller ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold ${
                          item.isAvailable 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-gray-50 text-gray-400 border border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {item.isAvailable ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openEdit(item)} 
                            className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            aria-label="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id)} 
                            className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            aria-label="Delete"
                          >
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
        </>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-brand-border/40">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border/30">
              <h2 className="font-display text-xl font-extrabold text-brand-dark">
                {editId ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-brand-muted transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Photo Upload area */}
              <div className="space-y-1.5">
                <label className="label">Photo Upload</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="cursor-pointer border-2 border-dashed border-gray-200 bg-brand-cream/10 rounded-2xl h-44 flex items-center justify-center hover:border-brand-red hover:bg-brand-cream/30 transition-all overflow-hidden relative group"
                >
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                        Click to change photo
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-400 space-y-1">
                      <ImagePlus size={32} className="mx-auto text-gray-300" />
                      <p className="text-sm font-semibold text-gray-600">Select Image File</p>
                      <p className="text-xxs text-gray-400">JPG, PNG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileRef} accept="image/*" onChange={handlePhoto} className="hidden" />
              </div>

              {/* Item Name */}
              <div className="space-y-1.5">
                <label className="label">Item Name *</label>
                <input 
                  className="input" 
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  placeholder="e.g., Pepperoni Supreme" 
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="label">Description</label>
                <textarea 
                  className="input resize-none" 
                  rows={3} 
                  value={form.description} 
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                  placeholder="Tell customers about the toppings, crust, sauce..." 
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="label">Category *</label>
                <select 
                  className="input cursor-pointer" 
                  value={form.category} 
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              {/* Pricing & Variations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="label mb-0">Pricing & Sizes</label>
                  <button 
                    type="button" 
                    onClick={addVariation}
                    className="text-xs text-brand-red hover:text-red-700 flex items-center gap-1 font-bold min-h-[44px] px-2 cursor-pointer"
                  >
                    <PlusCircle size={14} /> Add Size Variation
                  </button>
                </div>

                {form.variations.length === 0 ? (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₱</span>
                      <input
                        type="number" 
                        min="0" 
                        className="input pl-8"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="Flat price (e.g. 299)"
                      />
                    </div>
                    <p className="text-xxs text-gray-400 font-medium">Or create specific variations (e.g. Solo, Family size) by clicking the button above.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {form.variations.map((v, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input 
                          className="input flex-1" 
                          placeholder="Label (e.g. Solo 9&quot;)" 
                          value={v.label} 
                          onChange={e => updateVariation(i, 'label', e.target.value)} 
                          required
                        />
                        <div className="relative w-28">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₱</span>
                          <input 
                            className="input pl-7" 
                            type="number" 
                            min="0" 
                            placeholder="Price" 
                            value={v.price} 
                            onChange={e => updateVariation(i, 'price', e.target.value)} 
                            required
                          />
                        </div>
                        <button 
                          onClick={() => removeVariation(i)} 
                          className="text-gray-400 hover:text-brand-red p-2.5 rounded-xl border border-gray-100 hover:bg-red-50 min-h-[44px] flex items-center justify-center cursor-pointer"
                          aria-label="Remove variation"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggle Switches */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="accent-brand-red w-5 h-5 rounded-lg cursor-pointer"
                    checked={form.isBestSeller}
                    onChange={e => setForm(f => ({ ...f, isBestSeller: e.target.checked }))} 
                  />
                  <div>
                    <span className="text-sm font-bold text-brand-dark flex items-center gap-1">
                      Best Seller <Star size={14} className="text-brand-yellow fill-brand-yellow" />
                    </span>
                    <p className="text-xxs text-gray-400">Featured in landing page (max 4)</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="accent-brand-red w-5 h-5 rounded-lg cursor-pointer"
                    checked={form.isAvailable}
                    onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))} 
                  />
                  <div>
                    <span className="text-sm font-bold text-brand-dark">Available to Order</span>
                    <p className="text-xxs text-gray-400">Show/hide from public menu listing</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex gap-3 p-6 border-t border-brand-border/30 bg-brand-cream/10">
              <button 
                onClick={closeModal} 
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex-1 btn-primary py-3 font-bold shadow-md shadow-brand-red/10 cursor-pointer min-h-[44px]"
              >
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
