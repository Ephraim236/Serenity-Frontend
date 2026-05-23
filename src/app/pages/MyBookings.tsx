import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Scissors,
  MapPin,
  ChevronRight,
  Loader2,
  Star,
  Plus
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { StarRating } from "../components/StarRating";

interface Appointment {
  _id: string;
  service: string;
  serviceId?: string;
  specialist: string;
  date: string;
  time: string;
  price: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  business: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://booqlly.vercel.app';
};

const getAuthToken = () => {
  return localStorage.getItem('serenity_auth_token');
};

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string; border: string }> = {
  pending:    { label: 'Pending',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', dot: 'bg-amber-400', border: 'border-l-amber-400' },
  confirmed:  { label: 'Confirmed', badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', dot: 'bg-green-400',  border: 'border-l-green-400' },
  cancelled:  { label: 'Cancelled', badge: 'bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400', dot: 'bg-neutral-400', border: 'border-l-neutral-400' },
  completed:  { label: 'Completed', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400', dot: 'bg-blue-400',  border: 'border-l-blue-400' },
};

export function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');

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

  // Refresh appointments when page comes into focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.email) {
        (async () => {
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
          }
        })();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
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

  const getDisplayStatus = (apt: Appointment): 'upcoming' | 'past' | 'cancelled' => {
    if (apt.status === 'cancelled') return 'cancelled';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    if (apt.status === 'completed' || aptDate < today) return 'past';
    return 'upcoming';
  };

  const filteredAppointments = appointments.filter(apt => {
    const ds = getDisplayStatus(apt);
    if (activeTab === 'upcoming') return ds === 'upcoming';
    if (activeTab === 'past') return ds === 'past' || ds === 'cancelled';
    return true;
  });

  const upcomingCount = appointments.filter(apt => getDisplayStatus(apt) === 'upcoming').length;
  const pastCount = appointments.filter(apt => getDisplayStatus(apt) !== 'upcoming').length;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Bookings</h1>
        <p className="text-neutral-500 mb-10">Track and manage your appointments</p>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-neutral-500">Loading your bookings…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-12">
      {/* ── Header ── */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-neutral-900">My Bookings</h1>
        <p className="text-neutral-500 text-sm md:text-base">
          {user?.name ? `${user.name.split(' ')[0]}, ` : ''}
          {appointments.length > 0
            ? `you have ${appointments.length} booking${appointments.length !== 1 ? 's' : ''}`
            : 'no bookings yet'}
        </p>
      </div>

      {/* ── Empty State ── */}
      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-20">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
            <CalendarIcon className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">No bookings yet</h3>
          <p className="text-neutral-500 text-center mb-8 max-w-xs">
            When you book an appointment it will appear here
          </p>
          <Link to="/book">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-bold">
              Book Now
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* ── Tab Filter ── */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
            {[
              { key: 'all', label: `All (${appointments.length})` },
              { key: 'upcoming', label: `Upcoming (${upcomingCount})` },
              { key: 'past', label: `Past (${pastCount})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Booking List ── */}
          <div className="space-y-4">
            {filteredAppointments.map((booking) => {
              const sc = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
              const displayStatus = getDisplayStatus(booking);
              
              return (
                <Card
                  key={booking._id}
                  className={`overflow-hidden border-l-4 ${sc.border} bg-white dark:bg-neutral-800 shadow-sm`}
                >
                  <div className="p-4 md:p-6">
                    {/* Card Header: status badge + service name + price */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${sc.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                      <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                        ₵{booking.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Service Name */}
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1 leading-tight">
                      {booking.service}
                    </h3>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-3">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        {booking.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        {booking.specialist}
                      </span>
                    </div>

                    {/* ID tag */}
                    <p className="text-[10px] font-mono text-neutral-400 mb-4">
                      #{booking._id.slice(-8).toUpperCase()}
                    </p>

                    {/* ── Actions ── */}
                    {displayStatus === 'upcoming' && (
                      <div className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                        <Button
                          variant="ghost"
                          className="flex-1 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm h-11"
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancellingId === booking._id}
                        >
                          {cancellingId === booking._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Cancel Booking'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-sm h-11"
                          disabled={cancellingId === booking._id}
                        >
                          {cancellingId === booking._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Reschedule'
                          )}
                        </Button>
                      </div>
                    )}

                    {displayStatus === 'past' && (
                      <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                        <Link to={`/review/write?businessId=${booking.business}&serviceId=${booking.serviceId || ''}&appointmentId=${booking._id}`} state={{ appointmentId: booking._id }} className="flex-1">
                          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm h-11">
                            <Star className="w-4 h-4" /> Leave a Review
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-sm h-11"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" /> Rebook
                        </Button>
                      </div>
                    )}

                    {displayStatus === 'cancelled' && (
                      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-700">
                        <Link to={`/business-map`}>
                          <Button variant="outline" className="w-full rounded-xl border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-sm h-11">
                            Find Another Business
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* ── Help Banner ── */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-900 dark:text-blue-200">Need help with your booking?</h4>
            <p className="text-sm text-blue-700/70 dark:text-blue-300/70 mt-0.5">
              Our support team is available 24/7 to assist with any changes or questions.
            </p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto bg-white dark:bg-neutral-800 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl h-10 px-5 font-semibold text-sm shrink-0">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
