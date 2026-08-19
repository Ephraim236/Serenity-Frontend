import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Scissors,
  MapPin,
  ChevronRight,
  ChevronDown,
  Loader2,
  Star,
  Plus,
  AlertCircle,
  Edit2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { StarRating } from "../components/StarRating";
import { ScrollFadeInUp, StaggerContainer, StaggerItem, HoverLift } from "../components/ScrollAnimations";

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

type BookingStatus = 'upcoming' | 'past' | 'cancelled';

const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://booqlly.vercel.app';
};

const getAuthToken = () => {
  return localStorage.getItem('serenity_auth_token');
};

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string; border: string; icon: React.ComponentType<any> }> = {
  pending:    { 
    label: 'Pending', 
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', 
    dot: 'bg-amber-400', 
    border: 'border-amber-400',
    icon: AlertCircle
  },
  confirmed:  { 
    label: 'Confirmed', 
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', 
    dot: 'bg-green-400',
    border: 'border-green-400',
    icon: CheckCircle2
  },
  cancelled:  { 
    label: 'Cancelled', 
    badge: 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400', 
    dot: 'bg-stone-400', 
    border: 'border-stone-400',
    icon: XCircle
  },
  completed:  { 
    label: 'Completed', 
    badge: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300', 
    dot: 'bg-stone-500',
    border: 'border-stone-500',
    icon: CheckCircle2
  },
};

export function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const getDisplayStatus = (apt: Appointment): BookingStatus => {
    if (apt.status === 'cancelled') return 'cancelled';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    if (apt.status === 'completed' || aptDate < today) return 'past';
    return 'upcoming';
  };

  const groupedAppointments = {
    upcoming: appointments.filter(apt => getDisplayStatus(apt) === 'upcoming'),
    past: appointments.filter(apt => getDisplayStatus(apt) === 'past'),
    cancelled: appointments.filter(apt => getDisplayStatus(apt) === 'cancelled'),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-stone-900">My Bookings</h1>
            <p className="text-stone-500 mt-2">Track and manage your appointments</p>
          </div>
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-stone-900 mx-auto mb-4" />
              <span className="text-stone-500">Loading your bookings…</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 md:mb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-stone-900">My Bookings</h1>
              <p className="text-stone-500 mt-2">
                {user?.name ? `${user.name.split(' ')[0]}, ` : ''}
                {appointments.length > 0
                  ? `you have ${appointments.length} booking${appointments.length !== 1 ? 's' : ''}`
                  : 'no bookings yet'}
              </p>
            </div>
            <Link to="/book">
              <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg h-11 px-6 font-medium hidden sm:flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Booking
              </Button>
            </Link>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 md:p-16 text-center border border-stone-200">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="w-10 h-10 text-stone-500" />
            </div>
            <h3 className="text-2xl font-semibold text-stone-900 mb-3">No bookings yet</h3>
            <p className="text-stone-500 max-w-sm mx-auto mb-8">
              When you book an appointment with a business, it will appear here. Start by finding a service you love!
            </p>
            <Link to="/book">
              <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg h-12 px-8 font-medium mx-auto">
                Book Your First Appointment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden sticky top-4">
                <div className="bg-stone-50 border-b border-stone-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <h2 className="font-medium text-stone-900">Upcoming</h2>
                    <span className="ml-auto px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                      {groupedAppointments.upcoming.length}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {groupedAppointments.upcoming.length === 0 ? (
                    <p className="text-sm text-stone-500 text-center py-8">No upcoming bookings</p>
                  ) : (
                    groupedAppointments.upcoming.map(booking => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        expanded={expandedId === booking._id}
                        onExpand={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                        onCancel={() => handleCancel(booking._id)}
                        isCancelling={cancellingId === booking._id}
                        displayStatus="upcoming"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden sticky top-4">
                <div className="bg-stone-50 border-b border-stone-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-stone-500" />
                    <h2 className="font-medium text-stone-900">Completed</h2>
                    <span className="ml-auto px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                      {groupedAppointments.past.length}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {groupedAppointments.past.length === 0 ? (
                    <p className="text-sm text-stone-500 text-center py-8">No completed bookings</p>
                  ) : (
                    groupedAppointments.past.map(booking => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        expanded={expandedId === booking._id}
                        onExpand={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                        displayStatus="past"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden sticky top-4">
                <div className="bg-stone-50 border-b border-stone-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-stone-400" />
                    <h2 className="font-medium text-stone-900">Cancelled</h2>
                    <span className="ml-auto px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                      {groupedAppointments.cancelled.length}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {groupedAppointments.cancelled.length === 0 ? (
                    <p className="text-sm text-stone-500 text-center py-8">No cancelled bookings</p>
                  ) : (
                    groupedAppointments.cancelled.map(booking => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        expanded={expandedId === booking._id}
                        onExpand={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                        displayStatus="cancelled"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {appointments.length > 0 && (
          <div className="mt-12 bg-stone-900 rounded-xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-white text-lg mb-1">Need to make changes?</h3>
                <p className="text-stone-300 text-sm">Reschedule or cancel your bookings with just a few clicks.</p>
              </div>
              <Link to="/book">
                <Button className="bg-white hover:bg-stone-100 text-stone-900 font-medium rounded-lg h-10 px-6 shrink-0">
                  New Booking
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  expanded,
  onExpand,
  onCancel,
  isCancelling = false,
  displayStatus
}: BookingCardProps) {
  const sc = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = sc.icon;

  return (
    <div className={`bg-white border border-stone-200 rounded-xl hover:shadow-sm transition-all overflow-hidden cursor-pointer`}>
      <button
        onClick={onExpand}
        className="w-full text-left p-3.5 flex items-start gap-3 hover:bg-stone-50 transition-colors"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center ${
          booking.status === 'pending' ? 'text-amber-500' :
          booking.status === 'confirmed' || booking.status === 'completed' ? 'text-green-600' :
          'text-stone-400'
        }`}>
          <StatusIcon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-stone-900 text-sm truncate">
            {booking.service}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {new Date(booking.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })} at {booking.time}
          </p>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.badge}`}>
            {sc.label}
          </span>
          <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-stone-200 px-3.5 py-3 space-y-3 bg-stone-50/50">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-stone-500 font-medium">Specialist</p>
              <p className="text-stone-900 font-medium mt-0.5">{booking.specialist}</p>
            </div>
            <div className="text-right">
              <p className="text-stone-500 font-medium">Price</p>
              <p className="text-stone-900 font-medium mt-0.5">₵{booking.price.toLocaleString()}</p>
            </div>
          </div>

          <div className="text-xs">
            <p className="text-stone-500 font-medium mb-1">Booking ID</p>
            <p className="font-mono text-stone-600 text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-stone-200">
              #{booking._id.slice(-8).toUpperCase()}
            </p>
          </div>

          {booking.notes && (
            <div className="text-xs">
              <p className="text-stone-500 font-medium mb-1">Notes</p>
              <p className="text-stone-700">{booking.notes}</p>
            </div>
          )}

          <div className="pt-2 border-t border-stone-200 space-y-2">
            {displayStatus === 'upcoming' && (
              <>
                <button
                  onClick={onCancel}
                  disabled={isCancelling}
                  className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isCancelling ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                  {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
                <button className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                  <Edit2 className="w-3 h-3" />
                  Reschedule
                </button>
              </>
            )}

            {displayStatus === 'past' && (
              <>
                <Link to={`/review/write?businessId=${booking.business}&serviceId=${booking.serviceId || ''}&appointmentId=${booking._id}`} className="w-full">
                  <button className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors flex items-center justify-center gap-2">
                    <Star className="w-3 h-3" />
                    Leave Review
                  </button>
                </Link>
                <button className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                  <RotateCcw className="w-3 h-3" />
                  Rebook
                </button>
              </>
            )}

            {displayStatus === 'cancelled' && (
              <Link to="/book">
                <button className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-3 h-3" />
                  Book Again
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
