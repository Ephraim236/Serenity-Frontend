import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { 
  Star, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Phone,
  Smartphone
} from "lucide-react";
import { motion } from "motion/react";

const SERVICES = [
  {
    id: 1,
    name: "Luxury Facial",
    duration: "60 min",
    price: "$85",
    image: "https://images.unsplash.com/photo-1761718210055-e83ca7e2c9ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBmYWNpYWwlMjB0cmVhdG1lbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcxNjA3MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Deep cleansing and rejuvenation for glowing skin."
  },
  {
    id: 2,
    name: "Deep Tissue Massage",
    duration: "90 min",
    price: "$120",
    image: "https://images.unsplash.com/photo-1617952986600-802f965dcdbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVyYXBldXRpYyUyMG1hc3NhZ2UlMjBzcGElMjB0aGVyYXBpc3R8ZW58MXx8fHwxNzcxNjA3MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Targeted pressure to release muscle tension and stress."
  },
  {
    id: 3,
    name: "Designer Haircut",
    duration: "45 min",
    price: "$65",
    image: "https://images.unsplash.com/photo-1761931403671-d020a14928d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoYWlyY3V0JTIwc2Fsb24lMjBwcm9mZXNzaW9uYWwlMjBoYWlyJTIwc3R5bGlzdHxlbnwxfHx8fDE3NzE2MDcwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Modern styling from our master hair artists."
  }
];

export function ClientHome() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1637777277337-f114350fb088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcGElMjBpbnRlcmlvciUyMHNhbG9uJTIwbWFzc2FnZSUyMGZhY2lhbCUyMGhhaXJkcmVzc2VyfGVufDF8fHx8MTc3MTYwNzA5NXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Spa Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white rounded-3xl shadow-xl -mt-24 relative z-20 border border-neutral-100">
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

      {/* Featured Services */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Featured Services</h2>
            <p className="text-neutral-500 max-w-xl">
              Choose from our most popular treatments designed to enhance your natural beauty.
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex items-center gap-2 text-indigo-600">
            View All Services <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300"
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
                <div className="flex items-center gap-2 text-neutral-400 text-xs mb-3">
                  <Clock className="w-3 h-3" />
                  <span>{service.duration}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-neutral-500 text-sm mb-6">{service.description}</p>
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

      {/* Ghana Map & Mobile App */}
      <section className="bg-indigo-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Ghana Map */}
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">Book Anywhere in Ghana</h2>
              <p className="text-indigo-100 mb-8 text-lg">
                Serenity Spa & Wellness is available in multiple locations across Ghana. 
                Find the nearest salon or spa to you and book your relaxing experience today.
              </p>
              
              {/* Ghana Map - Simplified Style */}
              <div className="relative w-full max-w-sm mx-auto lg:mx-0">
                <svg viewBox="0 0 400 350" className="w-full h-auto">
                  {/* Simplified Ghana map outline */}
                  <path 
                    d="M80,60 L160,50 L220,45 L280,50 L340,65 L360,100 L365,160 L360,220 L340,280 L280,310 L200,320 L120,300 L60,260 L40,200 L45,140 L60,90 Z" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="3"
                    strokeOpacity="0.6"
                  />
                  {/* Inner fill */}
                  <path 
                    d="M80,60 L160,50 L220,45 L280,50 L340,65 L360,100 L365,160 L360,220 L340,280 L280,310 L200,320 L120,300 L60,260 L40,200 L45,140 L60,90 Z" 
                    fill="#ffffff" 
                    fillOpacity="0.1"
                  />
                  {/* Accra marker */}
                  <circle cx="280" cy="220" r="8" fill="#fbbf24" />
                  <circle cx="280" cy="220" r="20" fill="#fbbf24" fillOpacity="0.3" />
                  {/* Kumasi marker */}
                  <circle cx="200" cy="160" r="6" fill="#fbbf24" />
                  <circle cx="200" cy="160" r="14" fill="#fbbf24" fillOpacity="0.3" />
                  {/* Tamale marker */}
                  <circle cx="180" cy="80" r="5" fill="#fbbf24" />
                  <circle cx="180" cy="80" r="12" fill="#fbbf24" fillOpacity="0.3" />
                </svg>
              </div>
            </div>

            {/* Mobile App Download */}
            <div className="bg-white p-8 rounded-3xl shadow-2xl text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">Download Our Mobile App</h3>
              <p className="text-neutral-600 mb-8">
                Book your spa appointments on the go! Get the Serenity app for a seamless experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* App Store Button */}
                <button className="flex items-center gap-3 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-2xl transition-colors">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-neutral-400">Download on the</p>
                    <p className="text-sm font-bold">App Store</p>
                  </div>
                </button>
                
                {/* Google Play Button */}
                <button className="flex items-center gap-3 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-2xl transition-colors">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-neutral-400">Get it on</p>
                    <p className="text-sm font-bold">Google Play</p>
                  </div>
                </button>
              </div>
              
              <p className="mt-6 text-sm text-neutral-500">
                Coming soon to your favorite app store
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
