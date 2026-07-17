import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UPLOADS_URL } from '../config'
import { Search, ArrowLeft, Pizza, Star, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-brand-cream flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="bg-brand-dark text-white py-12 px-6 relative overflow-hidden">
          {/* Subtle background blurs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10 space-y-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-white/60 hover:text-brand-yellow text-sm font-semibold transition-colors duration-200"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img 
                  src={logo} 
                  alt="Jo San Pizza Logo" 
                  className="w-16 h-16 rounded-full object-cover border border-white/10 shadow-lg" 
                />
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-wide">
                    Our Full Menu
                  </h1>
                  <p className="text-white/60 text-xs sm:text-sm font-light mt-1 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-brand-yellow" />
                    Bambang, Nueva Vizcaya · Fresh & Hot
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:max-w-xs md:max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 transition-all duration-200 text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Category tabs */}
        <div className="sticky top-0 z-20 bg-white border-b border-brand-border/40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 min-h-[44px] flex items-center justify-center cursor-pointer ${
                activeCategory === 'all' 
                  ? 'bg-brand-red text-white shadow-md shadow-brand-red/10' 
                  : 'bg-brand-muted text-gray-600 hover:bg-gray-150'
              }`}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 min-h-[44px] flex items-center justify-center cursor-pointer ${
                  activeCategory === cat._id 
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/10' 
                    : 'bg-brand-muted text-gray-600 hover:bg-gray-100'
                }`}
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
                <div key={i} className="bg-white rounded-3xl border border-brand-border/30 overflow-hidden shadow-sm animate-pulse">
                  <div className="bg-gray-150 h-48" />
                  <div className="p-6 space-y-4">
                    <div className="h-5 bg-gray-150 rounded-lg w-3/4" />
                    <div className="space-y-2">
                      <div className="h-3.5 bg-gray-150 rounded-md w-full" />
                      <div className="h-3.5 bg-gray-150 rounded-md w-5/6" />
                    </div>
                    <div className="h-6 bg-gray-150 rounded-lg w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-brand-border/60 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-brand-red/5 flex items-center justify-center mx-auto mb-4 text-brand-red">
                <Pizza size={32} className="stroke-[1.25]" />
              </div>
              <p className="text-gray-600 font-bold text-lg">No menu items found</p>
              <p className="text-gray-400 text-sm mt-1">Try searching another query or different category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(item => (
                <div key={item._id} className="card-premium group flex flex-col h-full bg-white">
                  <div className="relative h-48 overflow-hidden bg-brand-muted">
                    {item.photo ? (
                      <img 
                        src={`${UPLOADS_URL}/${item.photo}`} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-brand-red bg-brand-cream">
                        <Pizza size={40} className="stroke-[1.25]" />
                        <span className="text-xs text-gray-400 font-medium mt-1">Tasty Pizza</span>
                      </div>
                    )}
                    {item.isBestSeller && (
                      <span className="absolute top-3 right-3 bg-brand-yellow text-brand-dark text-xxs font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Star size={10} fill="currentColor" className="stroke-none" /> Best Seller
                      </span>
                    )}
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="font-display font-bold text-lg text-brand-dark truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm font-light line-clamp-2 leading-relaxed">
                        {item.description || 'Made fresh to order with premium local flavors.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-brand-border/30 flex flex-col gap-3">
                      {item.variations && item.variations.length > 0 ? (
                        <div className="space-y-1">
                          {item.variations.map(v => (
                            <div key={v._id} className="flex justify-between text-xs font-semibold">
                              <span className="text-gray-400">{v.label}</span>
                              <span className="text-brand-red">₱{v.price}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400 font-bold uppercase tracking-wider">Price</span>
                          <span className="font-extrabold text-brand-red text-base">{formatPrice(item)}</span>
                        </div>
                      )}
                      
                      {item.category?.name && (
                        <div className="flex justify-end">
                          <span className="bg-brand-red/10 text-brand-red text-xxs font-extrabold px-2 py-0.5 rounded-full">
                            {item.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="text-center py-10 text-gray-400 text-xs sm:text-sm border-t border-brand-border/40 bg-white">
        © {new Date().getFullYear()} Jo San Pizza · Bambang, Nueva Vizcaya
      </footer>
    </div>
  )
}
