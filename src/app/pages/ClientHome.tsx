import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SearchBackdrop3D } from "../components/SearchBackdrop3D";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Search,
  Sparkles,
  Heart
} from "lucide-react";
import { StarRating } from "../components/StarRating";
import {
  ScrollFadeInUp,
  ScrollFadeInLeft,
  ScrollFadeInRight,
  ScrollScale,
  StaggerContainer,
  StaggerItem,
  ParallexScroll,
  HoverLift,
  PulseAnimation
} from "../components/ScrollAnimations";

const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://booqlly.vercel.app';
};

interface Business {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  image?: string;
  averageRating?: number;
  reviewCount?: number;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
}

const SERVICES = [
  {
    id: 1,
    name: "Luxury Facial",
    category: "Spa",
    duration: "60 min",
    price: "₵850",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBmYWNpYWwlMjB0cmVhdG1lbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcxNjA3MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Deep cleansing and rejuvenation for glowing skin.",
    averageRating: 4.8,
    reviewCount: 124
  },
  {
    id: 2,
    name: "Deep Tissue Massage",
    category: "Spa",
    duration: "90 min",
    price: "₵1,200",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBtYXNzYWdlfGVufDF8fHx8MTc3NDQwNzgwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Targeted pressure to release muscle tension and stress.",
    averageRating: 4.9,
    reviewCount: 98
  },
  {
    id: 3,
    name: "Hot Stone Therapy",
    category: "Spa",
    duration: "90 min",
    price: "₵1,400",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMHNhbG9uJTIwYXV0aG9yJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0NDA3ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Heated stones to melt away tension and promote relaxation.",
    averageRating: 4.7,
    reviewCount: 86
  },
  {
    id: 4,
    name: "Classic Haircut",
    category: "Men's Grooming",
    duration: "30 min",
    price: "₵150",
    image: "/Serenity Pics/young-african-american-man-visiting-barbershop.jpg",
    description: "Traditional haircut with professional styling.",
    averageRating: 4.6,
    reviewCount: 312
  },
  {
    id: 5,
    name: "Beard Trim & Shape",
    category: "Men's Grooming",
    duration: "30 min",
    price: "₵120",
    image: "/Serenity Pics/african-american-man-guy-sitting-chair-barber-works-with-beard (1).jpg",
    description: "Professional beard grooming and styling.",
    averageRating: 4.5,
    reviewCount: 245
  },
  {
    id: 6,
    name: "Hair Styling",
    category: "Female Makeover",
    duration: "60 min",
    price: "₵350",
    image: "/Serenity Pics/woman-getting-her-hair-done-salon.jpg",
    description: "Professional styling with premium products.",
    averageRating: 4.9,
    reviewCount: 178
  },
];

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

   const businessesRef = useRef<HTMLDivElement>(null);
   const servicesRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

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
        return businessName.includes(query) || email.includes(query) || city.includes(query) || address.includes(query);
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
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          {HERO_IMAGES.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <ImageWithFallback
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                placeholder="skeleton"
                fetchPriority={index === 0 ? 'high' : 'low'}
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block py-1 px-3 rounded-full bg-indigo-600 text-xs font-bold uppercase tracking-wider mb-6"
            >
              Welcome to Booqlly
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Luxury <span className="text-blue-400">Self-Care</span> Effortlessly Booked
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="text-lg md:text-xl text-neutral-200 mb-8 max-w-lg"
            >
              Connecting Clients and Services Effortlessly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/book">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-14 rounded-full text-lg transition-all hover:scale-105 active:scale-95">
                  Book an Appointment
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-8 h-14 rounded-full text-lg transition-all hover:scale-105 active:scale-95">
                View Services
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Info - Staggered reveal */}
      <section className="container mx-auto px-4 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white dark:bg-neutral-800 rounded-3xl shadow-xl -mt-24 relative z-20 border border-neutral-100 dark:border-neutral-700"
        >
          {[
            { icon: Star, title: "5-Star Rated", desc: "Best rated service in the city.", delay: 0.1 },
            { icon: Clock, title: "Flexible Hours", desc: "Choose the best available time that suits your prefernce.", delay: 0.2 },
            { icon: CheckCircle2, title: "Trusted Businesses", desc: "All our Businesses are trusted with excellent experience.", delay: 0.3 }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -20 : idx === 2 ? 20 : 0, y: idx === 1 ? 20 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay, duration: 0.5 }}
              className="flex items-start gap-4 p-4"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-neutral-500 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto"
        >
          <SearchBackdrop3D />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
            <Search className="w-6 h-6 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search for salons, spas, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full h-16 pl-14 pr-32 text-lg bg-transparent dark:bg-transparent rounded-2xl border-2 border-neutral-100 dark:border-neutral-700 shadow-lg focus:border-blue-500 focus:ring-0 transition-all outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
              Search
            </button>
          </div>
        </motion.div>
        {searchQuery && (
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4">
            {filteredBusinesses.length} result{filteredBusinesses.length !== 1 ? 's' : ''} found
          </p>
        )}
      </section>

      {/* Businesses Section - staggered cards */}
      {businesses.length > 0 && (
        <section className="container mx-auto px-4 mt-12">
          <ScrollFadeInUp className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">Featured Businesses</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl">
              Choose a business below to view their services and book an appointment.
            </p>
          </ScrollFadeInUp>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            ref={businessesRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredBusinesses.map((business) => (
              <motion.div
                key={business._id}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onClick={() => handleBusinessClick(business._id)}
                className="flex-shrink-0 w-[70%] sm:w-[45%] md:w-[30%] snap-start cursor-pointer group"
              >
                <motion.div
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700"
                >
                  <div className="h-48 overflow-hidden relative">
                    {business.image ? (
                      <img
                        src={business.image}
                        alt={business.businessName || business.name}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-600 flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                          {business.businessName || business.name}
                        </h3>
                        <p className="text-neutral-500 text-sm">{business.name}</p>
                        {business.averageRating !== undefined && business.averageRating > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={business.averageRating} size={14} showValue />
                            <span className="text-xs text-neutral-500">
                              ({business.reviewCount || 0} review{business.reviewCount !== 1 ? 's' : ''})
                            </span>
                          </div>
                        )}
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
                      {business.location?.latitude && business.location?.longitude && (
                        <div className="flex items-center gap-2 text-neutral-500 text-xs">
                          <MapPin className="w-4 h-4 text-violet-600" />
                          <span>GPS: {business.location.latitude.toFixed(4)}, {business.location.longitude.toFixed(4)}</span>
                        </div>
                      )}
                    </div>

                     <div className="flex gap-3 mt-6">
                       <Link to={`/book?business=${business._id}`} className="flex-1">
                         <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white rounded-xl transition-all hover:scale-105 active:scale-95">
                           View Services & Book
                         </Button>
                       </Link>
                     </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Featured Services - scrollable with stagger */}
      <section className="container mx-auto px-4">
        <ScrollFadeInUp className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">Featured Services</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl">
              Choose from our most popular treatments designed to enhance your natural beauty.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full transition-all hover:scale-105 active:scale-95"
              onClick={() => scrollServices("left")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full transition-all hover:scale-105 active:scale-95"
              onClick={() => scrollServices("right")}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </ScrollFadeInUp>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } }
          }}
          ref={servicesRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {SERVICES.map((service) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-shrink-0 w-[70%] sm:w-[45%] md:w-[30%] snap-start group bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative h-64 overflow-hidden"
              >
                <ImageWithFallback
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  placeholder="skeleton"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-blue-600">
                  {service.price}
                </div>
              </motion.div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-neutral-400 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{service.duration}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">{service.name}</h3>

                {service.averageRating !== undefined && service.averageRating > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={service.averageRating} size={14} showValue />
                    <span className="text-xs text-neutral-500">
                      ({service.reviewCount || 0})
                    </span>
                  </div>
                )}

                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 line-clamp-2">{service.description}</p>
                <Link to="/book">
                  <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all hover:scale-105 active:scale-95">
                    Book This
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Modern Footer */}
      <footer className="relative bg-neutral-950 text-white pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-neutral-900 to-purple-600/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(147,51,234,0.12),transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">B</div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">Booqlly</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">Luxury self-care, effortlessly booked. Your relaxation, our priority.</p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Contact</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 text-blue-400" /> Accra, Ghana</li>
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-blue-400" /> +233 30 123 4567</li>
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-400" /> info@booqlly.com</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
