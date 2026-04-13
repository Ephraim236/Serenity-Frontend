import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { 
  Star, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Phone,
  Building2,
  Mail,
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";
import { motion } from "motion/react";

// API URL helper
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://serenity-gamma-two.vercel.app';
};

interface Business {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  image?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

const SERVICES = [
  // Spa Services
  {
    id: 1,
    name: "Luxury Facial",
    category: "Spa",
    duration: "60 min",
    price: "₵850",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBmYWNpYWwlMjB0cmVhdG1lbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcxNjA3MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Deep cleansing and rejuvenation for glowing skin."
  },
  {
    id: 2,
    name: "Deep Tissue Massage",
    category: "Spa",
    duration: "90 min",
    price: "₵1,200",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBtYXNzYWdlfGVufDF8fHx8MTc3NDQwNzgwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Targeted pressure to release muscle tension and stress."
  },
  {
    id: 3,
    name: "Hot Stone Therapy",
    category: "Spa",
    duration: "90 min",
    price: "₵1,400",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMHNhbG9uJTIwYXV0aG9yJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0NDA3ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Heated stones to melt away tension and promote relaxation."
  },
  // Men's Grooming
  {
    id: 4,
    name: "Classic Haircut",
    category: "Men's Grooming",
    duration: "30 min",
    price: "₵150",
    image: "/Serenity Pics/young-african-american-man-visiting-barbershop.jpg",
    description: "Traditional haircut with professional styling."
  },
  {
    id: 5,
    name: "Beard Trim & Shape",
    category: "Men's Grooming",
    duration: "30 min",
    price: "₵120",
    image: "/Serenity Pics/african-american-man-guy-sitting-chair-barber-works-with-beard (1).jpg",
    description: "Professional beard grooming and styling."
  },
  // Female Makeover
  {
    id: 6,
    name: "Hair Styling",
    category: "Female Makeover",
    duration: "60 min",
    price: "₵350",
    image: "/Serenity Pics/woman-getting-her-hair-done-salon.jpg",
    description: "Professional styling with premium products."
  },
];

// Hero slideshow images
const HERO_IMAGES = [
  "/Serenity Pics/african-american-man-guy-sitting-chair-barber-works-with-beard (1).jpg",
  "/Serenity Pics/man-woman-doing-beauty-treatment-home.jpg",
  "/Serenity Pics/medium-shot-man-living-as-digital-nomad.jpg",
  "/Serenity Pics/stylist-woman-taking-care-her-client-afro-hair.jpg",
  "/Serenity Pics/woman-getting-her-hair-done-salon.jpg",
  "/Serenity Pics/young-african-american-man-visiting-barbershop.jpg"
];

export function ClientHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Detect PWA installation status
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (PWA installed)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const inMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;
    
    // Also check localStorage for dismissed state
    const installDismissed = localStorage.getItem('booqlly_install_dismissed');
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const dismissedTime = installDismissed ? parseInt(installDismissed) : 0;
    const isExpired = dismissedTime > 0 && dismissedTime < thirtyDaysAgo;
    
    // Clear expired dismissal or update status
    if (isExpired) {
      localStorage.removeItem('booqlly_install_dismissed');
    }
    
    // Set installed if either standalone or NOT dismissed
    setIsAppInstalled(standalone || inMinimalUi);
    
    // Store dismissal with expiry
    if (installDismissed && !isExpired && !standalone && !inMinimalUi) {
      setIsAppInstalled(true); // Treat as installed if dismissed recently
    }
    
    // Detect iOS Safari
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
      /Version/.test(navigator.userAgent) && 
      !/Opera/.test(navigator.userAgent);
    setIsIOS(isIOSDevice || (/Mac/.test(navigator.userAgent) && 'ontouchend' in document));
  }, []);
  const businessesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const scrollBusinesses = (direction: "left" | "right") => {
    if (businessesRef.current) {
      const container = businessesRef.current;
      const scrollAmount = container.clientWidth * 0.85;
      container.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const scrollServices = (direction: "left" | "right") => {
    if (servicesRef.current) {
      const container = servicesRef.current;
      const scrollAmount = container.clientWidth * 0.85;
      container.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/business`);
        if (response.ok) {
          const data = await response.json();
          setBusinesses(data);
          setFilteredBusinesses(data);
        }
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Filter businesses based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBusinesses(businesses);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = businesses.filter(business => {
        const businessName = (business.businessName || business.name).toLowerCase();
        const email = business.email.toLowerCase();
        const city = business.location?.city?.toLowerCase() || "";
        const address = business.location?.address?.toLowerCase() || "";
        
        return businessName.includes(query) || 
               email.includes(query) || 
               city.includes(query) || 
               address.includes(query);
      });
      setFilteredBusinesses(filtered);
    }
  }, [searchQuery, businesses]);

  const handleBusinessClick = (businessId: string) => {
    navigate(`/book?business=${businessId}`);
  };

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {HERO_IMAGES.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <ImageWithFallback
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                placeholder="skeleton"
                fetchPriority={index === 0 ? 'high' : 'low'}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
              Welcome to Booqlly
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Luxury <span className="text-indigo-400">Self-Care</span> Effortlessly Booked
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 mb-8 max-w-lg">
              Connecting Clients and Services Effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-14 rounded-full text-lg">
                  Book an Appointment
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-8 h-14 rounded-full text-lg">
                View Services
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Info */}
      <section className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white dark:bg-neutral-800 rounded-3xl shadow-xl -mt-24 relative z-20 border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-start gap-4 p-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">5-Star Rated</h3>
              <p className="text-neutral-500 text-sm">Best rated service in the city.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border-l border-neutral-100">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Flexible Hours</h3>
              <p className="text-neutral-500 text-sm">Choose the best available time that suits your prefernce.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border-l border-neutral-100">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Trusted Businesses</h3>
              <p className="text-neutral-500 text-sm">All our Businesses are trusted with excellent experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 mt-8">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
            <Search className="w-6 h-6 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search for salons, spas, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 pl-14 pr-32 text-lg bg-white dark:bg-neutral-800 rounded-2xl border-2 border-neutral-100 dark:border-neutral-700 shadow-lg focus:border-blue-500 focus:ring-0 transition-all outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
              Search
            </button>
          </div>
        </div>
        {searchQuery && (
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4">
            {filteredBusinesses.length} result{filteredBusinesses.length !== 1 ? 's' : ''} found
          </p>
        )}
      </section>

      {/* Businesses Section */}
      {businesses.length > 0 && (
        <section className="container mx-auto px-4 mt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">Featured Businesses</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl">
              Choose a business below to view their services and book an appointment.
            </p>
          </div>

           <div 
            ref={businessesRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredBusinesses.map((business, index) => (
              <motion.div
                key={business._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleBusinessClick(business._id)}
                className="flex-shrink-0 w-[70%] sm:w-[45%] md:w-[30%] snap-start cursor-pointer group"
              >
                {/* Business Image */}
                <div className="h-48 overflow-hidden relative">
                  {business.image ? (
                    <img 
                      src={business.image} 
                      alt={business.businessName || business.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-white shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        {business.businessName || business.name}
                      </h3>
                      <p className="text-neutral-500 text-sm">{business.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {business.location?.address && (
                      <div className="flex items-center gap-2 text-neutral-500 text-sm">
                        <MapPin className="w-4 h-4 text-violet-600" />
                        <span>{business.location.address}, {business.location.city}</span>
                      </div>
                    )}
                    {business.businessPhone && (
                      <div className="flex items-center gap-2 text-neutral-500 text-sm">
                        <Phone className="w-4 h-4 text-violet-600" />
                        <span>{business.businessPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-neutral-500 text-sm">
                      <Mail className="w-4 h-4 text-violet-600" />
                      <span>{business.email}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl">
                    View Services & Book
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Services */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">Featured Services</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl">
              Choose from our most popular treatments designed to enhance your natural beauty.
            </p>
          </div>
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scrollServices("left")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scrollServices("right")}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div 
          ref={servicesRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[70%] sm:w-[45%] md:w-[30%] snap-start group bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-indigo-600">
                  {service.price}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-neutral-400 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{service.duration}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">{service.name}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">{service.description}</p>
                <Link to="/book">
                  <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl">
                    Book This
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mobile App Promo */}
      <section className="relative bg-neutral-900 py-24 overflow-hidden">
        {/* Ghana Map Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/Serenity Pics/map-ghana-polygonal-mesh-line-map-flag-map.jpg"
            alt="Ghana map"
            className="w-full h-full object-cover opacity-40"
            loading="lazy"
            placeholder="skeleton"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-neutral-900/60" />
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          {/* Ghana Flag Colors Caption */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span style={{ color: '#FF0000' }}>B</span>
              <span style={{ color: '#FFD700' }}>oo</span>
              <span style={{ color: '#006B3D' }}>k </span>
              <span style={{ color: '#FF0000' }}>A</span>
              <span style={{ color: '#FFD700' }}>n</span>
              <span style={{ color: '#006B3D' }}>yw</span>
              <span style={{ color: '#FF0000' }}>h</span>
              <span style={{ color: '#FFD700' }}>e</span>
              <span style={{ color: '#006B3D' }}>r</span>
              <span style={{ color: '#FF0000' }}>e </span>
              <span style={{ color: '#FFD700' }}>i</span>
              <span style={{ color: '#006B3D' }}>n </span>
              <span style={{ color: '#FF0000' }}>G</span>
              <span style={{ color: '#FFD700' }}>h</span>
              <span style={{ color: '#006B3D' }}>a</span>
              <span style={{ color: '#FF0000' }}>n</span>
              <span style={{ color: '#FFD700' }}>a</span>
            </h2>
            <p className="text-neutral-400 text-lg">Book your beauty appointments anywhere in Ghana</p>
          </div>

          {!isAppInstalled && (
          <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
            {/* Install Instructions */}
            <div className="bg-neutral-800 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                </svg>
              </div>
              <div className="text-white flex-1">
                <p className="text-xl font-bold">How to Install</p>
                {isIOS ? (
                  <p className="text-sm text-neutral-400 mt-1">Tap <span className="font-semibold text-white">Share</span> button → Tap <span className="font-semibold text-white">Add to Home Screen</span></p>
                ) : (
                  <p className="text-sm text-neutral-400 mt-1">Tap <span className="font-semibold text-white">⋮</span> menu → Tap <span className="font-semibold text-white">Add to Home Screen</span></p>
                )}
              </div>
              <button 
                onClick={() => {
                  localStorage.setItem('booqlly_install_dismissed', Date.now().toString());
                  setIsAppInstalled(true);
                }}
                className="shrink-0 text-neutral-400 hover:text-white"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>)}
        </div>
      </section>
    </div>
  );
}
