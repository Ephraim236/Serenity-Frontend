import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Scissors,
  MapPin,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

interface Appointment {
  _id: string;
  service: string;
  specialist: string;
  date: string;
  time: string;
  price: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return 'https://serenity-api-2txb.onrender.com';
};

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const token = getAuthToken();
        const response = await fetch(
          `${getApiUrl()}/api/dashboard/appointments/client?email=${encodeURIComponent(user.email)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.email]);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(id);
    try {
      const token = getAuthToken();
      const response = await fetch(`${getApiUrl()}/api/dashboard/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        toast.success("Booking has been cancelled");
        setAppointments(prev => 
          prev.map(apt => 
            apt._id === id ? { ...apt, status: 'cancelled' } : apt
          )
        );
      } else {
        toast.error("Failed to cancel booking");
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error("Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending Approval', class: 'bg-amber-50 text-amber-600' };
      case 'confirmed':
        return { label: 'Confirmed', class: 'bg-green-50 text-green-600' };
      case 'cancelled':
        return { label: 'Cancelled', class: 'bg-neutral-100 text-neutral-400' };
      case 'completed':
        return { label: 'Completed', class: 'bg-blue-50 text-blue-600' };
      default:
        return { label: status, class: 'bg-neutral-100 text-neutral-400' };
    }
  };

  const getStatusBarColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500';
      case 'confirmed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-neutral-300';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-neutral-300';
    }
  };

  const getStatusForDisplay = (apt: Appointment) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);

    if (apt.status === 'cancelled') return 'cancelled';
    if (apt.status === 'completed') return 'completed';
    if (aptDate < today) return 'completed';
    if (apt.status === 'confirmed') return 'upcoming';
    return 'pending';
  };

  if (loading) {
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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-neutral-500">Loading your bookings...</span>
        </div>
      </div>
    );
  }

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

      {appointments.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarIcon className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">No bookings yet</h3>
          <p className="text-neutral-500 mb-8">You haven't made any appointments yet.</p>
          <Link to="/book">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8">
              Book Now
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((booking) => {
            const statusDisplay = getStatusDisplay(booking.status);
            const displayStatus = getStatusForDisplay(booking);
            
            return (
              <Card key={booking._id} className="p-0 border-none shadow-sm bg-white rounded-[32px] overflow-hidden group">
                <div className="flex flex-col md:flex-row">
                  <div className={`w-full md:w-3 px-6 py-6 md:py-0 ${getStatusBarColor(booking.status)}`} />
                  
                  <div className="flex-1 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusDisplay.class}`}>
                            {statusDisplay.label}
                          </span>
                          <span className="text-xs text-neutral-400 font-mono">ID: {booking._id.slice(-8).toUpperCase()}</span>
                        </div>
                        
                        <div>
                          <h3 className="text-2xl font-bold text-neutral-900 mb-1">{booking.service}</h3>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500 font-medium">
                            <span className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-indigo-400" /> {new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-indigo-400" /> {booking.time}
                            </span>
                            <span className="flex items-center gap-2">
                              <Scissors className="w-4 h-4 text-indigo-400" /> {booking.specialist}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 lg:pt-0 border-t lg:border-none border-neutral-50">
                        <div className="text-center sm:text-right mr-6">
                          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-2xl font-black text-indigo-600">₵{booking.price.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {displayStatus === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                className="flex-1 sm:flex-none rounded-xl border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                                disabled={cancellingId === booking._id}
                              >
                                {cancellingId === booking._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'Reschedule'
                                )}
                              </Button>
                              <Button 
                                variant="ghost" 
                                className="flex-1 sm:flex-none rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleCancel(booking._id)}
                                disabled={cancellingId === booking._id}
                              >
                                {cancellingId === booking._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'Cancel'
                                )}
                              </Button>
                            </>
                          )}
                          {displayStatus === 'upcoming' && (
                            <>
                              <Button variant="outline" className="flex-1 sm:flex-none rounded-xl border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                                Reschedule
                              </Button>
                              <Button 
                                variant="ghost" 
                                className="flex-1 sm:flex-none rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleCancel(booking._id)}
                                disabled={cancellingId === booking._id}
                              >
                                {cancellingId === booking._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'Cancel'
                                )}
                              </Button>
                            </>
                          )}
                          {displayStatus === 'completed' && (
                            <Button className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl flex items-center gap-2">
                              <RotateCcw className="w-4 h-4" /> Rebook Service
                            </Button>
                          )}
                          {displayStatus === 'cancelled' && (
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
            );
          })}
        </div>
      )}

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
