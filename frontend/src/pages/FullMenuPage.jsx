import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Search, ArrowLeft } from 'lucide-react'
import logo from '../assets/logo.png'

export default function FullMenuPage() {
  const [items, setItems]           = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/menu'),
      axios.get('/api/categories'),
    ]).then(([menuRes, catRes]) => {
      setItems(menuRes.data)
      setCategories(catRes.data)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'all' || item.category?._id === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                        (item.description || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const formatPrice = (item) => {
    if (item.variations && item.variations.length > 0) {
      const min = Math.min(...item.variations.map(v => v.price))
      return `From ₱${min}`
    }
    return item.price ? `₱${item.price}` : 'Ask us!'
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-brand-dark text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <img src={logo} alt="Jo San Pizza" className="w-14 h-14 rounded-full object-cover" />
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">Our Full Menu</h1>
              <p className="text-white/60 text-sm mt-1">Bambang, Nueva Vizcaya</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-brand-yellow"
            />
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === 'all' ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat._id ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gray-200 h-48" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-7xl mb-4">🍕</div>
            <p className="text-xl font-medium">No items found</p>
            <p className="text-sm mt-2">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(item => (
              <div key={item._id} className="card group">
                <div className="relative h-48 overflow-hidden">
                  {item.photo ? (
                    <img src={`/uploads/${item.photo}`} alt={item.name}
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-orange/20 to-brand-red/20 flex items-center justify-center text-6xl">
                      🍕
                    </div>
                  )}
                  {item.isBestSeller && (
                    <span className="absolute top-3 right-3 bg-brand-yellow text-brand-dark text-xs font-bold px-2 py-1 rounded-full">
                      ⭐ Best Seller
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description || 'Made fresh daily.'}</p>
                  {item.variations && item.variations.length > 0 ? (
                    <div className="space-y-1">
                      {item.variations.map(v => (
                        <div key={v._id} className="flex justify-between text-sm">
                          <span className="text-gray-500">{v.label}</span>
                          <span className="font-bold text-brand-red">₱{v.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-bold text-brand-red text-xl">{formatPrice(item)}</p>
                  )}
                  {item.category?.name && (
                    <span className="inline-block mt-3 bg-brand-red/10 text-brand-red text-xs px-2 py-0.5 rounded-full font-medium">
                      {item.category.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} Jo San Pizza · Bambang, Nueva Vizcaya
      </footer>
    </div>
  )
}
