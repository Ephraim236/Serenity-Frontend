import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Scissors,
  MapPin,
  ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link } from "react-router";
import { toast } from "sonner";

const MY_BOOKINGS = [
  {
    id: "BK-9912",
    service: "Luxury Facial",
    date: "March 15, 2026",
    time: "10:30 AM",
    specialist: "Sarah J.",
    status: "upcoming",
    price: "$85",
    location: "Downtown Serenity Spa"
  },
  {
    id: "BK-8821",
    service: "Designer Haircut",
    date: "February 10, 2026",
    time: "02:15 PM",
    specialist: "Emma W.",
    status: "completed",
    price: "$65",
    location: "Downtown Serenity Spa"
  },
  {
    id: "BK-7712",
    service: "Swedish Massage",
    date: "January 22, 2026",
    time: "11:00 AM",
    specialist: "Michael C.",
    status: "cancelled",
    price: "$95",
    location: "Uptown Serenity Express"
  }
];

export function MyBookings() {
  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      toast.success(`Booking ${id} has been cancelled.`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">My Bookings</h1>
          <p className="text-neutral-500">Track and manage your upcoming and past appointments</p>
        </div>
        <Link to="/book">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-bold">
            New Booking
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {MY_BOOKINGS.map((booking) => (
          <Card key={booking.id} className="p-0 border-none shadow-sm bg-white rounded-[32px] overflow-hidden group">
            <div className="flex flex-col md:flex-row">
              <div className={`w-full md:w-3 px-6 py-6 md:py-0 ${
                booking.status === 'upcoming' ? 'bg-indigo-600' :
                booking.status === 'completed' ? 'bg-green-500' :
                'bg-neutral-300'
              }`} />
              
              <div className="flex-1 p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'upcoming' ? 'bg-indigo-50 text-indigo-600' :
                        booking.status === 'completed' ? 'bg-green-50 text-green-600' :
                        'bg-neutral-100 text-neutral-400'
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">ID: {booking.id}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-1">{booking.service}</h3>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500 font-medium">
                        <span className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-indigo-400" /> {booking.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-400" /> {booking.time}
                        </span>
                        <span className="flex items-center gap-2">
                          <Scissors className="w-4 h-4 text-indigo-400" /> {booking.specialist}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <MapPin className="w-3 h-3" />
                      {booking.location}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 lg:pt-0 border-t lg:border-none border-neutral-50">
                    <div className="text-center sm:text-right mr-6">
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="text-2xl font-black text-indigo-600">{booking.price}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {booking.status === 'upcoming' && (
                        <>
                          <Button variant="outline" className="flex-1 sm:flex-none rounded-xl border-neutral-200 text-neutral-600 hover:bg-neutral-50" onClick={() => handleCancel(booking.id)}>
                            Reschedule
                          </Button>
                          <Button variant="ghost" className="flex-1 sm:flex-none rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleCancel(booking.id)}>
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <Button className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" /> Rebook Service
                        </Button>
                      )}
                      {booking.status === 'cancelled' && (
                        <Button variant="outline" className="w-full sm:w-auto rounded-xl border-neutral-200 text-neutral-600">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-8 bg-indigo-50 rounded-[40px] flex items-center justify-between">
        <div className="max-w-md">
          <h4 className="text-xl font-bold text-indigo-900 mb-2">Need help with your booking?</h4>
          <p className="text-indigo-700/70 text-sm">Our support team is available 24/7 to assist you with any changes or questions.</p>
        </div>
        <Button className="bg-white text-indigo-600 hover:bg-white/90 rounded-2xl h-12 px-6 font-bold shadow-sm">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
