import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UPLOADS_URL } from '../config'
import {
  MapPin, Phone, Clock, Facebook, ChevronDown,
  Pizza, Star, Menu, X, Instagram, ChefHat, Heart, Award, Sparkles
} from 'lucide-react'
import logo from '../assets/logo.png'
import pizzaHero from '../assets/pizza_hero.png'

const API = '/api'

function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#about', label: 'About' },
    { href: '#menu', label: 'Best Sellers' },
    { href: '#location', label: 'Location' },
    { href: '#social', label: 'Social' },
  ]

  // Disable body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <>
      {/* Backdrop blur overlay for mobile menu */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        (scrolled || open) 
          ? 'bg-brand-dark/95 backdrop-blur-md border-b border-white/5 shadow-xl py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={logo} alt="Jo San Pizza" className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-full ring-2 ring-brand-yellow/20 group-hover:ring-brand-yellow/50 transition-all duration-300" />
            </div>
            <span className="font-display text-white text-xl font-bold tracking-wider group-hover:text-brand-yellow transition-colors duration-200 hidden sm:block">
              Jo San Pizza
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <li key={l.href}>
                <a href={l.href} className="text-white/80 hover:text-brand-yellow font-semibold tracking-wide text-sm transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-yellow hover:after:w-full after:transition-all after:duration-250">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/menu" className="btn-primary py-2 px-6 text-sm">
                Full Menu
              </Link>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setOpen(!open)} 
            className="md:hidden text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors focus:ring-2 focus:ring-brand-yellow/50 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-brand-dark/98 backdrop-blur-lg border-b border-white/10 px-6 py-6 transition-all duration-300 ease-in-out ${
          open ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
        }`}>
          <div className="flex flex-col gap-1">
            {links.map(l => (
              <a 
                key={l.href} 
                href={l.href} 
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-brand-yellow py-3 border-b border-white/5 font-semibold text-base transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Link 
              to="/menu" 
              onClick={() => setOpen(false)}
              className="mt-6 btn-primary w-full text-center py-3"
            >
              Full Menu
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen hero-clip bg-gradient-to-b from-brand-dark to-[#090b0e] flex items-center justify-center overflow-hidden pt-24 pb-20">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-brand-red/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-brand-orange/10 blur-[100px] pointer-events-none" />
      
      {/* Abstract Grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
              早晨 · Bambang, Nueva Vizcaya
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Every Slice Tells<br />
              <span className="text-brand-yellow italic drop-shadow-md">a Story</span>
            </h1>
            
            <p className="text-white/70 text-base sm:text-lg md:text-xl font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience the perfect fusion of Italian culinary craftsmanship and warm Filipino hospitality, fresh from our kitchen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/menu" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-brand-red/25">
                View Full Menu
              </Link>
              <a href="#about" className="btn-outline border-white/30 text-white hover:bg-white hover:text-brand-dark text-base px-8 py-3.5">
                Our Story
              </a>
            </div>
          </div>

          {/* Hero Right Media */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[420px] lg:h-[420px] animate-float">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/20 to-brand-yellow/10 rounded-full blur-3xl opacity-60" />
              
              {/* Spinning Ring */}
              <div className="absolute inset-[-12px] border-2 border-dashed border-brand-yellow/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
              
              {/* Main Image Frame */}
              <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-white/10 shadow-2xl relative">
                <img 
                  src={pizzaHero} 
                  alt="Delicious Jo San Pizza" 
                  className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <a href="#about" className="flex flex-col items-center text-white/40 hover:text-white/80 transition-colors animate-bounce">
            <span className="text-xs mb-1 font-semibold tracking-widest uppercase">Scroll Down</span>
            <ChevronDown size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

function About() {
  const stats = [
    { icon: Pizza, value: '20+', label: 'Artisanal Flavors' },
    { icon: Star, value: '100%', label: 'Happy Guests' },
    { icon: ChefHat, value: '3+ Years', label: 'Of Love & Craft' },
    { icon: Heart, value: '1000+', label: 'Slices Shared' },
  ]
  return (
    <section id="about" className="py-28 bg-brand-cream relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full border-4 border-brand-red/5" />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full border-8 border-brand-orange/5" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block text-brand-red font-bold tracking-widest uppercase text-xs">
              Our Journey
            </div>
            <h2 className="section-title">
              Where Filipino Heart Meets Italian Soul
            </h2>
            <div className="w-16 h-1 bg-brand-red rounded-full" />
            <div className="space-y-4 text-gray-600 leading-relaxed text-base sm:text-lg font-light">
              <p>
                Jo San Pizza was born from a simple dream — to bring the warmth of family gatherings
                to every bite. Named after the Chinese phrase <em className="text-brand-red font-medium not-italic">"早晨" (Jo San)</em> meaning
                <strong className="text-brand-dark font-semibold"> "Good Morning"</strong>, we believe every meal should feel like the start
                of something wonderful.
              </p>
              <p>
                Nestled in the heart of Bambang, Nueva Vizcaya, our pizzas blend classic Italian
                techniques with local Filipino flavors — because good food speaks every language.
              </p>
              <p>
                From our hand-stretched, slow-fermented dough to our signature house-made tomato sauces, 
                every single pizza is crafted fresh to order. Come hungry. Leave happy.
              </p>
            </div>
          </div>

          {/* Right Cards Column */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((s, idx) => {
              const IconComp = s.icon
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-3xl p-6 sm:p-8 text-center border border-brand-border/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                    <IconComp size={24} />
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-brand-dark">
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm mt-1.5 font-medium">
                    {s.label}
                  </div>
                </div>
              )
            })}
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
    <section id="menu" className="py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-block text-brand-red font-bold tracking-widest uppercase text-xs">
            Crowd Favorites
          </div>
          <h2 className="section-title">Best Sellers</h2>
          <div className="w-12 h-1 bg-brand-red rounded-full mx-auto" />
          <p className="text-gray-500 text-base sm:text-lg font-light">
            These are the ones our customers keep coming back for. Handcrafted, fresh, and bursting with flavor.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-brand-border/30 overflow-hidden shadow-sm animate-pulse">
                <div className="bg-gray-100 h-52 w-full" />
                <div className="p-6 space-y-4">
                  <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
                  <div className="space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded-md w-full" />
                    <div className="h-3.5 bg-gray-100 rounded-md w-5/6" />
                  </div>
                  <div className="h-6 bg-gray-100 rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-brand-cream/40 rounded-3xl border border-dashed border-brand-border/60">
            <div className="w-16 h-16 rounded-full bg-brand-red/5 flex items-center justify-center mx-auto mb-4 text-brand-red">
              <Pizza size={32} />
            </div>
            <p className="text-gray-600 font-medium">No best sellers featured yet.</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon for our fresh selections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item._id} className="card-premium group flex flex-col h-full bg-white">
                <div className="relative overflow-hidden h-52 bg-brand-muted">
                  {item.photo ? (
                    <img 
                      src={`${UPLOADS_URL}/${item.photo}`} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-brand-red bg-brand-cream">
                      <Pizza size={48} className="stroke-[1.25]" />
                      <span className="text-xs text-gray-400 font-medium mt-2">Tasty Pizza</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-brand-yellow text-brand-dark text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Star size={12} fill="currentColor" className="stroke-none" /> 
                    Best Seller
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl text-brand-dark truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm font-light line-clamp-2 leading-relaxed">
                      {item.description || 'Delicious pizza crafted from fresh ingredients daily.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-brand-border/30 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xxs uppercase tracking-wider font-semibold">Price</span>
                      <span className="font-bold text-brand-red text-lg">
                        {formatPrice(item)}
                      </span>
                    </div>
                    {item.category?.name && (
                      <span className="bg-brand-red/10 text-brand-red text-xs px-2.5 py-1 rounded-full font-bold">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link to="/menu" className="btn-primary inline-flex text-base px-8 py-3.5 shadow-lg shadow-brand-red/20">
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  )
}

function Location() {
  return (
    <section id="location" className="py-28 bg-brand-dark text-white relative overflow-hidden">
      {/* Decorative subtle glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <div className="inline-block text-brand-yellow font-bold tracking-widest uppercase text-xs">
            Find Us
          </div>
          <h2 className="section-title text-white">Visit Our Branch</h2>
          <div className="w-12 h-1 bg-brand-yellow rounded-full mx-auto" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-lg mb-3 tracking-wide">Address</h3>
            <p className="text-white/70 leading-relaxed font-light text-sm sm:text-base">
              Tokyo Building,<br />
              San Fernando Road,<br />
              Calaocan, Bambang,<br />
              Nueva Vizcaya
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center mb-6">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-lg mb-3 tracking-wide">Operating Hours</h3>
            <div className="text-white/70 space-y-1.5 font-light text-sm sm:text-base">
              <p className="font-semibold text-brand-yellow uppercase tracking-widest text-xs">Open Daily</p>
              <p className="text-xl font-bold text-white">9:00 AM – 8:00 PM</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center mb-6">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-lg mb-3 tracking-wide">Contact Us</h3>
            <p className="text-white/70 mb-4 font-light text-sm sm:text-base">For orders, delivery & reservations</p>
            <a 
              href="https://www.facebook.com/JoSanPizzaBambangBranch" 
              target="_blank" 
              rel="noreferrer"
              className="btn-outline border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-brand-dark px-6 py-2 text-sm shadow-md"
            >
              Message on Facebook
            </a>
          </div>
        </div>

        {/* Embedded Map */}
        <div className="mt-14 rounded-3xl overflow-hidden h-96 shadow-2xl border border-white/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.710237085621!2d121.11006789999999!3d16.3887167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33905bcefe6fc337%3A0xe69ad142ffeca5ef!2sJo%20San%20Pizza!5e0!3m2!1sen!2sph!4v1779490042760!5m2!1sen!2sph"
            className="w-full h-full border-0 filter grayscale-[20%] contrast-[110%]"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Jo San Pizza Location Map"
          ></iframe>
        </div>
      </div>
    </section>
  )
}

function SocialMedia() {
  return (
    <section id="social" className="py-24 bg-gradient-to-r from-brand-red to-brand-orange text-white relative overflow-hidden">
      {/* Decorative design circles */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-60 h-60 bg-white/5 rounded-full -translate-x-20 translate-y-20 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
        <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
          Connect With Us
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Stay in the Pizza Loop
        </h2>
        <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed">
          Be the first to hear about special promos, flash sales, new menu items, and behind-the-scenes content!
        </p>
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://www.facebook.com/JoSanPizzaBambangBranch"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-white text-brand-red font-bold text-base px-8 py-4 rounded-full hover:bg-brand-yellow hover:text-brand-dark hover:-translate-y-0.5 transition-all duration-300 shadow-xl active:scale-95 cursor-pointer"
          >
            <Facebook size={20} />
            Join Us on Facebook
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#090b0e] text-white py-14 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3 group">
          <img src={logo} alt="Jo San Pizza" className="w-10 h-10 rounded-full object-cover border border-white/10" />
          <span className="font-display font-bold text-lg tracking-wider text-white">Jo San Pizza</span>
        </div>
        <p className="text-white/40 text-xs sm:text-sm font-light text-center md:text-left">
          © {new Date().getFullYear()} Jo San Pizza · Bambang, Nueva Vizcaya. All rights reserved.
        </p>
        <Link 
          to="/admin/login" 
          className="text-white/30 hover:text-brand-yellow text-xs font-semibold tracking-wider uppercase transition-colors py-2 px-4 rounded-lg bg-white/5 border border-white/5 hover:border-brand-yellow/30"
        >
          Staff Login
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
    <div className="min-h-screen bg-brand-cream overflow-hidden">
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
