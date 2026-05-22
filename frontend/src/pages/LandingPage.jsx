import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  MapPin, Phone, Clock, Facebook, ChevronDown,
  Pizza, Star, Menu, X, Instagram
} from 'lucide-react'
import logo from '../assets/logo.png'

const API = '/api'

function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#about',       label: 'About'       },
    { href: '#menu',        label: 'Best Sellers' },
    { href: '#location',    label: 'Location'     },
    { href: '#social',      label: 'Social'       },
  ]
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-brand-dark/95 backdrop-blur shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Jo San Pizza" className="w-12 h-12 rounded-full object-cover" />
          <span className="font-display text-white text-xl font-bold hidden sm:block">Jo San Pizza</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-white/80 hover:text-brand-yellow font-medium transition-colors duration-200">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/menu" className="btn-primary py-2 px-5 text-sm">Full Menu</Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-dark/98 px-6 pb-6">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
               className="block text-white/80 hover:text-brand-yellow py-3 border-b border-white/10 font-medium">
              {l.label}
            </a>
          ))}
          <Link to="/menu" onClick={() => setOpen(false)}
                className="block mt-4 btn-primary text-center">
            Full Menu
          </Link>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen hero-clip bg-brand-dark flex items-center justify-center overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-brand-red/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-brand-orange/10 blur-3xl" />
      {/* Floating pizza emoji decorations */}
      <div className="absolute top-32 left-16 text-6xl opacity-10 rotate-12 select-none">🍕</div>
      <div className="absolute bottom-40 right-20 text-8xl opacity-10 -rotate-12 select-none">🍕</div>
      <div className="absolute top-1/2 left-6 text-4xl opacity-5 rotate-45 select-none">🍕</div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Jo San Pizza" className="w-36 h-36 rounded-full object-cover shadow-2xl ring-4 ring-brand-yellow/30 animate-pulse" />
        </div>
        <p className="text-brand-yellow font-semibold tracking-widest uppercase text-sm mb-4">
          早晨 · Bambang, Nueva Vizcaya
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Every Slice Tells<br />
          <span className="text-brand-yellow italic">a Story</span>
        </h1>
        <p className="text-white/70 text-lg md:text-xl mb-10 max-w-xl mx-auto font-light">
          Authentic Filipino-Chinese pizza crafted with love, served fresh from our kitchen to your table.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/menu" className="btn-primary text-lg">
            View Full Menu
          </Link>
          <a href="#about" className="btn-outline border-white text-white hover:bg-white hover:text-brand-dark text-lg">
            Our Story
          </a>
        </div>
        <a href="#about" className="mt-16 inline-flex flex-col items-center text-white/40 hover:text-white/70 transition-colors animate-bounce">
          <span className="text-xs mb-1">Scroll down</span>
          <ChevronDown size={20} />
        </a>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-24 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <p className="text-brand-red font-semibold tracking-widest uppercase text-sm mb-3">Our Story</p>
            <h2 className="section-title mb-6">
              Where Filipino Heart Meets Italian Soul
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Jo San Pizza was born from a simple dream — to bring the warmth of family gatherings 
              to every bite. Named after the Chinese phrase <em>"早晨" (Jo San)</em> meaning 
              <strong> "Good Morning"</strong>, we believe every meal should feel like the start 
              of something wonderful.
            </p>
            <p className="text-gray-600 leading-relaxed mb-5">
              Nestled in the heart of Bambang, Nueva Vizcaya, our pizzas blend classic Italian 
              technique with local Filipino flavors — because good food speaks every language.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From our hand-stretched dough to our house-made sauces, every pizza is crafted 
              fresh to order. Come hungry. Leave happy.
            </p>
          </div>

          {/* Right: stats cards */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: '🍕', value: '20+', label: 'Products' },
              { icon: '⭐', value: '4.9', label: 'Average Rating' },
              { icon: '👨‍🍳', value: '2+', label: 'Years of Craft' },
              { icon: '❤️', value: '1000+', label: 'Happy Customers' },
            ].map(s => (
              <div key={s.label} className="card p-6 text-center bg-white">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="font-display text-3xl font-bold text-brand-red">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function BestSellers() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/menu?bestSeller=true`)
      .then(r => setItems(r.data.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatPrice = (item) => {
    if (item.variations && item.variations.length > 0) {
      const min = Math.min(...item.variations.map(v => v.price))
      return `From ₱${min}`
    }
    return item.price ? `₱${item.price}` : 'Ask us!'
  }

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand-red font-semibold tracking-widest uppercase text-sm mb-3">Crowd Favorites</p>
          <h2 className="section-title mb-4">Best Sellers</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            These are the ones our customers keep coming back for. Once you try them, you'll know why.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gray-200 h-48 w-full" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🍕</div>
            <p>No best sellers featured yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item._id} className="card group">
                <div className="relative overflow-hidden h-48">
                  {item.photo ? (
                    <img src={`/uploads/${item.photo}`} alt={item.name}
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-orange/20 to-brand-red/20 flex items-center justify-center text-6xl">
                      🍕
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-brand-yellow text-brand-dark text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Best Seller
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-lg mb-1 truncate">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description || 'Delicious pizza, made fresh.'}</p>
                  {item.variations && item.variations.length > 0 ? (
                    <div className="space-y-0.5 mb-2">
                      {item.variations.map(v => (
                        <div key={v._id} className="flex justify-between text-sm">
                          <span className="text-gray-500">{v.label}</span>
                          <span className="font-semibold text-brand-red">₱{v.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-bold text-brand-red text-lg">{formatPrice(item)}</p>
                  )}
                  {item.category?.name && (
                    <span className="inline-block mt-2 bg-brand-red/10 text-brand-red text-xs px-2 py-0.5 rounded-full font-medium">
                      {item.category.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/menu" className="btn-primary text-lg">
            View Full Menu →
          </Link>
        </div>
      </div>
    </section>
  )
}

function Location() {
  return (
    <section id="location" className="py-24 bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand-yellow font-semibold tracking-widest uppercase text-sm mb-3">Find Us</p>
          <h2 className="section-title text-white mb-4">Visit Our Branch</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <MapPin size={36} className="text-brand-yellow mb-4" />
            <h3 className="font-bold text-lg mb-2">Address</h3>
            <p className="text-white/70 leading-relaxed">
              Tokyo Building,<br />
              San Fernando Road,<br />
              Calaocan, Bambang,<br />
              Nueva Vizcaya
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <Clock size={36} className="text-brand-yellow mb-4" />
            <h3 className="font-bold text-lg mb-2">Operating Hours</h3>
            <div className="text-white/70 space-y-1">
              <p>Daily</p>
              <p className="font-semibold text-white">9:00 AM – 8:00 PM</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <Phone size={36} className="text-brand-yellow mb-4" />
            <h3 className="font-bold text-lg mb-2">Contact Us</h3>
            <p className="text-white/70 mb-2">For orders & inquiries</p>
            <a href="https://www.facebook.com/JoSanPizzaBambangBranch" target="_blank" rel="noreferrer"
               className="text-brand-yellow hover:underline font-medium">
              Message us on Facebook
            </a>
          </div>
        </div>

        {/* Embedded map placeholder */}
        <div className="mt-10 rounded-2xl overflow-hidden h-72 bg-white/10 flex items-center justify-center">
          <div className="text-center text-white/40">
            <MapPin size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Bambang, Nueva Vizcaya</p>
            <p className="text-xs mt-1 opacity-60">Tokyo Building, San Fernando Road, Calaocan</p>
            <a href="https://maps.google.com/?q=Bambang+Nueva+Vizcaya" target="_blank" rel="noreferrer"
               className="inline-block mt-4 text-brand-yellow text-sm hover:underline">
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function SocialMedia() {
  return (
    <section id="social" className="py-24 bg-brand-red text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="font-semibold tracking-widest uppercase text-sm mb-3 text-white/60">Follow Along</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
          Stay Connected
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
          Get the latest promos, new menu items, and behind-the-scenes content. 
          Follow us on Facebook and never miss a slice!
        </p>
        <a
          href="https://www.facebook.com/JoSanPizzaBambangBranch"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 bg-white text-brand-red font-bold text-lg px-8 py-4 rounded-full hover:bg-brand-yellow hover:text-brand-dark transition-all duration-200 shadow-xl"
        >
          <Facebook size={24} />
          Jo San Pizza – Bambang Branch
        </a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Jo San Pizza" className="w-10 h-10 rounded-full object-cover" />
          <span className="font-display font-bold">Jo San Pizza</span>
        </div>
        <p className="text-white/40 text-sm">
          © {new Date().getFullYear()} Jo San Pizza · Bambang, Nueva Vizcaya
        </p>
        <Link to="/admin/login" className="text-white/30 hover:text-white/60 text-xs transition-colors">
          Admin Login
        </Link>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div>
      <Navbar scrolled={scrolled} />
      <Hero />
      <About />
      <BestSellers />
      <Location />
      <SocialMedia />
      <Footer />
    </div>
  )
}
