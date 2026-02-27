import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { 
  Star, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Phone
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

      {/* Contact Info */}
      <section className="bg-indigo-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-8">Visit Our Office</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Location</h4>
                    <p className="text-indigo-100">Pawpaw Street<br />East-Legon,Accra</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Contact</h4>
                    <p className="text-indigo-100">Phone: (+233) 123-4567<br />Email: hello@serenity.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-neutral-900">Get a Call Back</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">First Name</label>
                    <input className="w-full p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Jane" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Last Name</label>
                    <input className="w-full p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Email</label>
                  <input className="w-full p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="jane@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Message</label>
                  <input className="w-full p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Please input your message here" />
                </div>
                <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
