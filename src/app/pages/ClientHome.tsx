import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
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
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

// API URL helper
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://serenity-5zku.onrender.com';
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
        }
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

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
              Welcome to Serenity
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
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white dark:bg-neutral-800 rounded-3xl shadow-xl -mt-24 relative z-20 border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-start gap-4 p-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">5-Star Rated</h3>
              <p className="text-neutral-500 text-sm">Consistently rated best service in the city.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border-l border-neutral-100">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Flexible Hours</h3>
              <p className="text-neutral-500 text-sm">Open 7 days a week, the best available time that suits your prefernce.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border-l border-neutral-100">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Expert Staff</h3>
              <p className="text-neutral-500 text-sm">All our Staffs are certified with excellent experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Businesses Section */}
      {businesses.length > 0 && (
        <section className="container mx-auto px-4">
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
            {businesses.map((business, index) => (
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">Featured Services</h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl">
            Choose from our most popular treatments designed to enhance your natural beauty.
          </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Google Play Store */}
            <a href="#" className="bg-neutral-800 hover:bg-neutral-700 p-6 rounded-2xl flex items-center gap-4 transition-all">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
              </div>
              <div className="text-white">
                <p className="text-xs text-neutral-400">Get it on</p>
                <p className="text-xl font-bold">Google Play</p>
              </div>
            </a>

            {/* Apple App Store */}
            <a href="#" className="bg-neutral-800 hover:bg-neutral-700 p-6 rounded-2xl flex items-center gap-4 transition-all">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div className="text-white">
                <p className="text-xs text-neutral-400">Download on the</p>
                <p className="text-xl font-bold">App Store</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
