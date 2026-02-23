import { useState } from "react";
import { useNavigate } from "react-router";
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
  Smile
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const SERVICES = [
  { id: 's1', name: 'Luxury Facial', category: 'Skin', price: '$85', duration: '60 min', icon: Sparkles },
  { id: 's2', name: 'Deep Tissue Massage', category: 'Massage', price: '$120', duration: '90 min', icon: Sparkles },
  { id: 's3', name: 'Designer Haircut', category: 'Hair', price: '$65', duration: '45 min', icon: Scissors },
  { id: 's4', name: 'Manicure & Pedicure', category: 'Nails', price: '$75', duration: '75 min', icon: Sparkles },
  { id: 's5', name: 'Hot Stone Therapy', category: 'Massage', price: '$140', duration: '90 min', icon: Sparkles },
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
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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

  const handleBooking = () => {
    if (!selectedTime) return toast.error("Please select a time slot");
    setStep(4);
    toast.success("Booking confirmed!");
    // In a real app, save to DB here
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Select a Service</h2>
              <p className="text-neutral-500">Choose the treatment you'd like to book</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="flex items-center justify-between p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{service.name}</h4>
                      <p className="text-neutral-400 text-sm">{service.duration} • {service.category}</p>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-indigo-600">{service.price}</div>
                </button>
              ))}
            </div>
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
              <h2 className="text-3xl font-bold">Choose Specialist</h2>
              <p className="text-neutral-500">Select a professional for your {selectedService?.name}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleSpecialistSelect({ name: 'Any Professional', id: 'any', image: 'https://images.unsplash.com/photo-1745434123194-7c877b033e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMHN0YWZmJTIwdGVhbSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTYwNzA5OHww&ixlib=rb-4.1.0&q=80&w=1080' })}
                className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-md transition-all text-center flex flex-col items-center gap-3"
              >
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Any Professional</h4>
                  <p className="text-neutral-400 text-sm">Find the best available slot</p>
                </div>
              </button>
              {SPECIALISTS.map((specialist) => (
                <button
                  key={specialist.id}
                  onClick={() => handleSpecialistSelect(specialist)}
                  className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-md transition-all text-center flex flex-col items-center gap-3"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-100">
                    <ImageWithFallback src={specialist.image} alt={specialist.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{specialist.name}</h4>
                    <p className="text-neutral-400 text-sm">{specialist.role}</p>
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
              <h2 className="text-3xl font-bold">Pick Date & Time</h2>
              <p className="text-neutral-500">When would you like to come in?</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                />
              </div>

              <div className="space-y-6">
                <h4 className="font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Available Time Slots
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-4 rounded-xl border font-medium transition-all ${
                        selectedTime === time 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" 
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-indigo-600"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                
                <div className="pt-8 space-y-4">
                  <Button 
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg flex items-center justify-center gap-2"
                    onClick={handleBooking}
                    disabled={!selectedTime}
                  >
                    Confirm Booking <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" onClick={() => setStep(2)} className="w-full flex items-center gap-2">
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
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold mb-4">You're All Set!</h2>
            <p className="text-neutral-500 mb-12 max-w-md mx-auto">
              Your appointment for <span className="font-bold text-neutral-900">{selectedService?.name}</span> with <span className="font-bold text-neutral-900">{selectedSpecialist?.name}</span> is confirmed for <span className="font-bold text-neutral-900">{selectedDate ? format(selectedDate, 'PPP') : ''}</span> at <span className="font-bold text-neutral-900">{selectedTime}</span>.
            </p>
            
            <Card className="max-w-md mx-auto p-6 mb-8 bg-neutral-50 border-dashed">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-500">Booking ID:</span>
                <span className="font-mono font-bold">#SPA-88219</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-indigo-600">{selectedService?.price}</span>
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
            {[1, 2, 3].map((i) => (
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
            ))}
          </div>
        )}

        <div className="bg-neutral-50 rounded-[40px] p-2">
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-neutral-100">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
