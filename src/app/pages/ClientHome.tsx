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
  Search,
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
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBmYWNpYWwlMjB0cmVhdG1lbnR8ZW58MXx8fHwxNzcxNjA3MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
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
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBtYXNzYWdl8ZW58MXx8fHwxNzcxNjA3MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
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
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbnxlbnwxfHx8fDE3NzE2MDcwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/business`);
        if (response.ok) {
          const data = await fetch(`${getApiUrl()}/api/business`);
          if (response.ok) {
            const data = await response.json();
            setBusinesses(data);
            setFilteredBusinesses(data);
          }
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
      <section className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden">
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
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}

        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-2xl">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/90 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-6">
              Welcome to Booqlly
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Luxury Self-Care,<br />Effortlessly Booked
            </h1>
            <p className="text-lg md:text-xl text-stone-100 mb-8 max-w-lg">
              Connecting Clients and Services Effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button size="lg" className="bg-stone-900 hover:bg-stone-800 text-white px-8 h-12 rounded-lg text-base transition-all">
                  Book an Appointment
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 h-12 rounded-lg text-base transition-all">
                View Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Info */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white rounded-2xl border border-stone-200 shadow-sm -mt-20 relative z-20">
          {[
            { icon: Star, title: "5-Star Rated", desc: "Best rated service in the city." },
            { icon: Clock, title: "Flexible Hours", desc: "Choose the best available time that suits your prefernce." },
            { icon: CheckCircle2, title: "Trusted Businesses", desc: "All our Businesses are trusted with excellent experience." }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4"
            >
              <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-700 shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                <p className="text-stone-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative bg-white rounded-xl border border-stone-200 shadow-sm">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Search for salons, spas, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full h-14 pl-12 pr-24 text-base bg-transparent rounded-xl border-0 focus:ring-2 focus:ring-stone-200 transition-all outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg transition-colors">
                Search
              </button>
            </div>
          </div>
          {searchQuery && (
            <p className="text-center text-sm text-stone-500 mt-4">
              {filteredBusinesses.length} result{filteredBusinesses.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </section>

      {/* Businesses Section */}
      {businesses.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-stone-900">Featured Businesses</h2>
            <p className="text-stone-500 max-w-xl">
              Choose a business below to view their services and book an appointment.
            </p>
          </div>

          <div
            ref={businessesRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredBusinesses.map((business) => (
              <div
                key={business._id}
                onClick={() => handleBusinessClick(business._id)}
                className="flex-shrink-0 w-[70%] sm:w-[45%] md:w-[30%] snap-start cursor-pointer group"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="h-48 overflow-hidden relative">
                    {business.image ? (
                      <img
                        src={business.image}
                        alt={business.businessName || business.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-stone-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-700 shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-stone-900">
                          {business.businessName || business.name}
                        </h3>
                        <p className="text-stone-500 text-sm">{business.name}</p>
                        {business.averageRating !== undefined && business.averageRating > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={business.averageRating} size={14} showValue />
                            <span className="text-xs text-stone-500">
                              ({business.reviewCount || 0} review{business.reviewCount !== 1 ? 's' : ''})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {business.location?.address && (
                        <div className="flex items-center gap-2 text-stone-500 text-sm">
                          <MapPin className="w-4 h-4 text-stone-400" />
                          <span>{business.location.address}, {business.location.city}</span>
                        </div>
                      )}
                      {business.businessPhone && (
                        <div className="flex items-center gap-2 text-stone-500 text-sm">
                          <Phone className="w-4 h-4 text-stone-400" />
                          <span>{business.businessPhone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-stone-500 text-sm">
                        <Mail className="w-4 h-4 text-stone-400" />
                        <span>{business.email}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Link to={`/book?business=${business._id}`} className="flex-1">
                        <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-all">
                          View Services & Book
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Services */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-stone-900">Featured Services</h2>
            <p className="text-stone-500 max-w-xl">
              Choose from our most popular treatments designed to enhance your natural beauty.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg border-stone-200"
              onClick={() => scrollServices("left")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg border-stone-200"
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
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="flex-shrink-0 w-[70%] sm:w-[45%] md:w-[30%] snap-start group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  placeholder="skeleton"
                />
                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-md font-semibold text-stone-900 text-sm">
                  {service.price}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-stone-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.duration}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-stone-900">{service.name}</h3>

                {service.averageRating !== undefined && service.averageRating > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={service.averageRating} size={14} showValue />
                    <span className="text-xs text-stone-500">
                      ({service.reviewCount || 0})
                    </span>
                  </div>
                )}

                <p className="text-stone-500 text-sm mb-6 line-clamp-2">{service.description}</p>
                <Link to="/book">
                  <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-all">
                    Book This
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
