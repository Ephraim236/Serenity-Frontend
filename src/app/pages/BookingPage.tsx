import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { toast } from "sonner";
import {
  Scissors,
  Sparkles,
  User,
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Smile,
  Loader2,
  Star,
  MapPin,
  Building2,
  Store
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getAuthToken, useAuth } from "../contexts/AuthContext";
import { StarRating } from "../components/StarRating";
import { StaticMap } from "../components/StaticMap";

// API URL helper
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://booqlly.vercel.app';
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface BusinessService {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description?: string;
  image?: string;
  averageRating?: number;
  reviewCount?: number;
}

interface BusinessDetails {
  _id: string;
  name: string;
  businessName?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  serviceHours?: {
    [key: string]: { open: string; close: string; isClosed: boolean };
  };
}

const SERVICES = [
  // Spa Services
  { id: 's1', name: 'Luxury Facial', category: 'Spa', price: '₵850', duration: '60 min', icon: Sparkles, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBmYWNpYWwlMjB0cmVhdG1lbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcxNjA3MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Deep cleansing and rejuvenation for glowing skin' },
  { id: 's2', name: 'Deep Tissue Massage', category: 'Spa', price: '₵1,200', duration: '90 min', icon: Sparkles, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBtYXNzYWdlfGVufDF8fHx8MTc3NDQwNzgwMHww&ixlib=rb-4.1.0&q=80&w=1080', description: 'Targeted pressure to release muscle tension and stress' },
  { id: 's3', name: 'Hot Stone Therapy', category: 'Spa', price: '₵1,400', duration: '90 min', icon: Sparkles, image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMHNhbG9uJTIwYXV0aG9yJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0NDA3ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Heated stones to melt away tension and promote relaxation' },
  { id: 's4', name: 'Aromatherapy Massage', category: 'Spa', price: '₵1,100', duration: '75 min', icon: Sparkles, image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcm9tYXRoZXJhcHklMjBtYXNzYWdlfGVufDF8fHx8MTc3NDQwNzgwMHww&ixlib=rb-4.1.0&q=80&w=1080', description: 'Essential oils combined with gentle massage for total relaxation' },
  
  // Men's Grooming
  { id: 's5', name: 'Classic Haircut', category: 'Men\'s Grooming', price: '₵150', duration: '30 min', icon: Scissors, image: '/Serenity Pics/young-african-american-man-visiting-barbershop.jpg', description: 'Traditional haircut with clippers and scissors' },
  { id: 's6', name: 'Beard Trim & Shape', category: 'Men\'s Grooming', price: '₵120', duration: '30 min', icon: Scissors, image: '/Serenity Pics/african-american-man-guy-sitting-chair-barber-works-with-beard (1).jpg', description: 'Professional beard grooming and styling' },
  { id: 's7', name: 'Hot Towel Shave', category: 'Men\'s Grooming', price: '₵200', duration: '45 min', icon: Scissors, image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBzaGF2aW5nfGVufDF8fHx8MTc3NDQwNzgwMHww&ixlib=rb-4.1.0&q=80&w=1080', description: 'Luxurious hot towel treatment with straight razor shave' },
  { id: 's8', name: 'Hair & Beard Combo', category: 'Men\'s Grooming', price: '₵250', duration: '60 min', icon: Scissors, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBoYWlyY3V0fGVufDF8fHx8MTc3NDQwNzgwMHww&ixlib=rb-4.1.0&q=80&w=1080', description: 'Complete grooming package for hair and beard' },
  
  // Female Makeover
  { id: 's9', name: 'Hair Styling & Treatment', category: 'Female Makeover', price: '₵350', duration: '60 min', icon: Sparkles, image: '/Serenity Pics/woman-getting-her-hair-done-salon.jpg', description: 'Professional styling with deep conditioning treatment' },
  { id: 's10', name: 'Manicure & Pedicure', category: 'Female Makeover', price: '₵300', duration: '75 min', icon: Sparkles, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHBlZGljdXJlJTIwbWFuaWN1cmV8ZW58MXx8fHx8MTc3NDQwNzgwMHww&ixlib=rb-4.1.0&q=80&w=1080', description: 'Full nail care with polish and nail art' },
  { id: 's11', name: 'Bridal Makeup', category: 'Female Makeover', price: '₵1,500', duration: '90 min', icon: Sparkles, image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWRlYWwlMjBtYWtldXAlMjBicmlkYWx8ZW58MXx8fHx8MTc3NDQwNzgwMHww&ixlib=rb-4.1.0&q=80&w=1080', description: 'Professional bridal makeup for your special day' },
  { id: 's12', name: 'Full Makeover Package', category: 'Female Makeover', price: '₵2,500', duration: '180 min', icon: Sparkles, image: '/Serenity Pics/stylist-woman-taking-care-her-client-afro-hair.jpg', description: 'Complete transformation with hair, makeup, and nails' },
];

const SPECIALISTS = [
  { id: 't1', name: 'Sarah Johnson', role: 'Lead Esthetician', image: 'https://images.unsplash.com/photo-1745434123194-7c877b033e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMHN0YWZmJTIwdGVhbSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTYwNzA5OHww&ixlib=rb-4.1.0&q=80&w=1080', specialty: 'Skin' },
  { id: 't2', name: 'Michael Chen', role: 'Massage Therapist', image: 'https://images.unsplash.com/photo-1617952986600-802f965dcdbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVyYXBldXRpYyUyMG1hc3NhZ2UlMjBzcGElMjB0aGVyYXBpc3R8ZW58MXx8fHwxNzcxNjA3MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080', specialty: 'Massage' },
  { id: 't3', name: 'Emma Wilson', role: 'Senior Stylist', image: 'https://images.unsplash.com/photo-1761931403671-d020a14928d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoYWlyY3V0JTIwc2Fsb24lMjBwcm9mZXNzaW9uYWwlMjBoYWlyJTIwc3R5bGlzdHxlbnwxfHx8fDE3NzE2MDcwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080', specialty: 'Hair' },
];

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get('business');
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [services, setServices] = useState<BusinessService[]>([]);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<BusinessDetails[]>([]);
  const [businessesLoading, setBusinessesLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessDetails | null>(null);
  const [bookingId, setBookingId] = useState<string>('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Fetch all registered businesses
  const fetchBusinesses = useCallback(async () => {
    setBusinessesLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/business`);
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data);
      }
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setBusinessesLoading(false);
    }
  }, []);

  // Select a business and load its services
  const handleBusinessSelect = useCallback((biz: BusinessDetails) => {
    setSelectedBusiness(biz);
    setBusiness(biz);
    setServices(biz.services || []);
    setStep(1);
  }, []);

  // Fetch business details and services
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Fetch business details and services from URL param
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${getApiUrl()}/api/business/${businessId}`);
        if (response.ok) {
          const data = await response.json();
          setBusiness(data);
          setSelectedBusiness(data);
          setServices(data.services || []);
        }
      } catch (error) {
        console.error('Failed to fetch business:', error);
      } finally {
        setLoading(false);
      }
    };


    fetchBusinessData();
  }, [businessId]);

  // Fetch booked appointments when date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate || !businessId) {
        setBookedSlots([]);
        return;
      }

      try {
        const token = getAuthToken();
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(
          `${getApiUrl()}/api/dashboard/appointments/booked?businessId=${businessId}&date=${dateStr}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Extract time slots from confirmed appointments
          const times = data
            .filter((apt: any) => apt.status === 'confirmed')
            .map((apt: any) => apt.time);
          setBookedSlots(times);
        }
      } catch (error) {
        console.error('Failed to fetch booked slots:', error);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, businessId]);

  // Check if time slot is disabled (past time for today or already booked)
  const isTimeDisabled = (time: string) => {
    // Check if already booked
    if (bookedSlots.includes(time)) {
      return true;
    }

    if (!selectedDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);
    
    // If selected date is not today, all times are available (except booked ones)
    if (selectedDay.getTime() !== today.getTime()) return false;
    
    // Parse the time and check if it's past
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr.split(':').map(Number);
    let hour24 = hours;
    
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    
    const now = new Date();
    const slotTime = new Date();
    slotTime.setHours(hour24, minutes, 0, 0);
    
    return slotTime <= now;
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleSpecialistSelect = (specialist: any) => {
    setSelectedSpecialist(specialist);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = async () => {
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return;
    }
    
    // Save booking to database
    const token = getAuthToken();
    
    // Show confirmation page first
    setStep(4);
    setSaving(true);
    
    // Save to database
    try {
       const bookingData = {
         service: selectedService?.name,
         serviceId: selectedService?._id,
         specialist: selectedSpecialist?.name,
         date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
         time: selectedTime,
         price: typeof selectedService?.price === 'string' 
           ? selectedService.price.replace(/[^0-9]/g, '') 
           : selectedService?.price,
         clientName: user?.name || 'Guest',
         clientEmail: user?.email || 'guest@example.com',
         clientPhone: '',
          businessId: selectedBusiness?._id || businessId || 'demo-business-1'
       };

      if (token) {
        console.log('Saving booking to:', `${getApiUrl()}/api/dashboard/appointments`);
        const response = await fetch(`${getApiUrl()}/api/dashboard/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(bookingData)
        });

        console.log('Booking response:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Booking saved:', data);
          setBookingId(data.appointment?._id || `SPA-${Date.now()}`);
          toast.success('Booking confirmed!');
        } else {
          const errorData = await response.json();
          console.error('Booking error:', errorData);
          toast.error('Failed to save booking. Please try again.');
          setBookingId(`SPA-${Date.now()}`);
        }
      } else {
        console.warn('No auth token found');
        toast.error('Please log in to book an appointment');
        setBookingId(`SPA-${Date.now()}`);
      }
    } catch (error) {
      console.error('Failed to save booking:', error);
      toast.error('Failed to save booking. Please try again.');
      setBookingId(`SPA-${Date.now()}`);
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Choose a Business</h2>
              <p className="text-neutral-500 dark:text-neutral-400">Select where you'd like to book your appointment</p>
            </div>
            {businessesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
                <Store className="w-12 h-12 mx-auto mb-4 opacity-50 dark:opacity-30" />
                <p className="dark:text-neutral-300">No registered businesses found.</p>
                <p className="text-sm mt-1 dark:text-neutral-400">Please check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {businesses.map((biz: any) => (
                  <button
                    key={biz._id}
                    onClick={() => handleBusinessSelect(biz)}
                    className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all text-left group"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shrink-0">
                          <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-neutral-900 dark:text-white truncate">
                            {biz.businessName || biz.name}
                          </h3>
                          {biz.businessName && (
                            <p className="text-xs truncate dark:text-neutral-500">{biz.name}</p>
                          )}
                          {biz.location?.city && (
                            <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>
                                {biz.location.city}
                                {biz.location.country ? `, ${biz.location.country}` : ''}
                              </span>
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                      {biz.averageRating !== undefined && biz.averageRating > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                              {biz.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-xs dark:text-neutral-500">
                            ({biz.reviewCount || 0} review{(biz.reviewCount || 0) !== 1 ? 's' : ''})
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Business Info & Map */}
            {business && (
              <div className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-neutral-800 dark:to-neutral-700 p-6 rounded-3xl border border-violet-100 dark:border-neutral-600">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                          {business.businessName || business.name}
                        </h2>
                        {business.location?.city && (
                          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                            {business.location.city}, {business.location.country}
                          </p>
                        )}
                      </div>
                    </div>

                    {business.location?.address && (
                      <div className="flex items-start gap-2 text-neutral-600 dark:text-neutral-300 mb-4">
                        <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                        <span className="text-sm dark:text-neutral-300">{business.location.address}</span>
                      </div>
                    )}

                    {business.location?.latitude && business.location?.longitude && GOOGLE_MAPS_API_KEY && (
                      <button
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${business.location.latitude},${business.location.longitude}`, '_blank', 'noopener,noreferrer')}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-800/60 transition-colors"
                        aria-label="Get directions"
                      >
                        <MapPin className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Static Map */}
                  {business.location?.latitude && business.location?.longitude && GOOGLE_MAPS_API_KEY && (
                    <div className="lg:w-80 xl:w-96 shrink-0">
                      <StaticMap
                        latitude={business.location.latitude}
                        longitude={business.location.longitude}
                        address={business.location.address}
                        businessName={business.businessName || business.name}
                        apiKey={GOOGLE_MAPS_API_KEY}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Select a Service</h2>
              <p className="text-neutral-500 dark:text-neutral-400">Choose the treatment you'd like to book</p>
            </div>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {(services.length > 0 ? services : SERVICES).map((service: any) => (
                <button
                  key={service.id || service._id}
                  onClick={() => handleServiceSelect(service)}
                  className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all text-left group"
                >
                  {/* Image at top */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative h-48 overflow-hidden"
                  >
                    <ImageWithFallback 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      placeholder="skeleton"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-indigo-600">
                      {typeof service.price === 'number' ? `₵${service.price.toLocaleString()}` : service.price}
                        </div>
                      </motion.div>
                       {/* Content below */}
                   <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 rounded-full">
                          {service.category}
                        </span>
                        <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{typeof service.duration === 'number' ? `${service.duration} min` : service.duration}</span>
                        </div>
                      </div>
                     <h4 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">{service.name}</h4>
                     
                     {/* Service Rating */}
                     {service.averageRating !== undefined && service.averageRating > 0 && (
                       <div className="flex items-center gap-2 mb-2">
                         <StarRating 
                           rating={service.averageRating} 
                           size={14} 
                           showValue 
                         />
                          <span className="text-xs dark:text-neutral-400">
                            ({service.reviewCount || 0} review{(service.reviewCount || 0) !== 1 ? 's' : ''})
                          </span>
                       </div>
                     )}
                     
                     <p className="text-neutral-500 dark:text-neutral-400 text-sm line-clamp-2">{service.description}</p>
                   </div>
                </button>
               ))}
            </div>

            <Button variant="ghost" onClick={() => setStep(0)} className="mt-8 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Change Business
            </Button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold dark:text-white">Choose Specialist</h2>
              <p className="text-neutral-500 dark:text-neutral-400">Select a professional for your {selectedService?.name}</p>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <button
                 onClick={() => handleSpecialistSelect({ name: 'Any Professional', id: 'any', image: 'https://images.unsplash.com/photo-1745434123194-7c877b033e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMHN0YWZmJTIwdGVhbSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTYwNzA5OHww&ixlib=rb-4.1.0&q=80&w=1080' })}
                 className="p-6 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-md transition-all text-center flex flex-col items-center gap-3"
               >
                 <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center text-neutral-400 dark:text-neutral-500">
                   <User className="w-10 h-10" />
                 </div>
                 <div>
                   <h4 className="font-bold text-lg dark:text-white">Any Professional</h4>
                   <p className="text-neutral-400 dark:text-neutral-500 text-sm">Find the best available slot</p>
                 </div>
               </button>
               {SPECIALISTS.map((specialist) => (
                 <button
                   key={specialist.id}
                   onClick={() => handleSpecialistSelect(specialist)}
                   className="p-6 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-md transition-all text-center flex flex-col items-center gap-3"
                 >
                   <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-100 dark:border-neutral-700">
                     <ImageWithFallback 
                       src={specialist.image} 
                       alt={specialist.name} 
                       className="w-full h-full object-cover" 
                       loading="lazy"
                       placeholder="skeleton"
                     />
                   </div>
                   <div>
                     <h4 className="font-bold text-lg dark:text-white">{specialist.name}</h4>
                     <p className="text-neutral-400 dark:text-neutral-500 text-sm">{specialist.role}</p>
                   </div>
                 </button>
               ))}
            </div>
            <Button variant="ghost" onClick={() => setStep(1)} className="mt-8 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold dark:text-white">Pick Date & Time</h2>
              <p className="text-neutral-500 dark:text-neutral-400">When would you like to come in?</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                />
              </div>

              <div className="space-y-6">
                <h4 className="font-bold flex items-center gap-2 dark:text-white">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Available Time Slots
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {TIME_SLOTS.map((time) => {
                    const disabled = isTimeDisabled(time);
                    return (
               <button
                 key={time}
                 onClick={() => !disabled && handleTimeSelect(time)}
                 disabled={disabled}
                 className={`p-4 rounded-xl border font-medium transition-all hover:scale-[1.02] active:scale-95 ${
                    selectedTime === time
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                      : disabled
                        ? "bg-neutral-100 dark:bg-neutral-700/50 border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                        : "bg-white dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-indigo-600 dark:hover:border-indigo-500"
                 }`}
               >
                        {time}
                        {disabled && <span className="block text-xs">Passed</span>}
                      </button>
                    );
                  })}
                </div>
                
                <div className="pt-8 space-y-4">
                  <Button 
                    type="button"
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg flex items-center justify-center gap-2"
                    onClick={handleBooking}
                    disabled={!selectedTime || saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        Confirm Booking <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setStep(2)} className="w-full flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Specialist
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Booking Successful!</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-2 max-w-md mx-auto">
              Your appointment for <span className="font-bold text-neutral-900 dark:text-white">{selectedService?.name}</span> with <span className="font-bold text-neutral-900 dark:text-white">{selectedSpecialist?.name}</span> is scheduled for <span className="font-bold text-neutral-900 dark:text-white">{selectedDate ? format(selectedDate, 'PPP') : ''}</span> at <span className="font-bold text-neutral-900 dark:text-white">{selectedTime}</span>.
            </p>
            <p className="text-amber-600 dark:text-amber-500 font-medium mb-8 max-w-md mx-auto">
              ⏳ Waiting for admin approval
            </p>
            
            <Card className="max-w-md mx-auto p-6 mb-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 border-dashed">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-500 dark:text-neutral-400">Booking ID:</span>
                <span className="font-mono font-bold dark:text-white">#{bookingId || `SPA-${Date.now()}`}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-indigo-600">
                  {typeof selectedService?.price === 'number' 
                    ? `₵${selectedService.price.toLocaleString()}` 
                    : selectedService?.price}
                </span>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/my-bookings")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl h-12">
                Manage My Bookings
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" className="px-8 rounded-xl h-12">
                Return Home
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-12 px-4">
            {!businessId ? (
              /* 4-step flow: Business → Service → Specialist → Date */
              (() => {
                const labels = ['Business', 'Service', 'Specialist', '✓'];
                const total = labels.length;
                return labels.map((lbl, idx) => (
                  <div key={lbl} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                      step > idx ? "bg-indigo-600 text-white shadow-lg" : "bg-neutral-200 text-neutral-500"
                    }`}>
                      {step > idx ? <CheckCircle2 className="w-6 h-6" /> : (idx === 0 ? <Store className="w-5 h-5" /> : lbl)}
                    </div>
                    {idx < total - 1 && (
                      <div className={`h-1 flex-1 mx-4 rounded-full ${
                        step > idx ? "bg-indigo-600" : "bg-neutral-200"
                      }`} />
                    )}
                  </div>
                ));
              })()
            ) : (
              /* 3-step flow: Service → Specialist → Date (business from URL) */
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= i ? "bg-indigo-600 text-white shadow-lg" : "bg-neutral-200 text-neutral-500"
                  }`}>
                    {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
                  </div>
                  {i < 3 && (
                    <div className={`h-1 flex-1 mx-4 rounded-full ${
                      step > i ? "bg-indigo-600" : "bg-neutral-200"
                    }`} />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-[40px] p-2">
          <div className="bg-white dark:bg-neutral-800 rounded-[32px] p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-700">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
