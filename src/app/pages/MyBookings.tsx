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
  Plus,
  ChevronDown,
  AlertCircle,
  Send,
  Edit2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { StarRating } from "../components/StarRating";
import { motion } from "motion/react";
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

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string; border: string; icon: React.ComponentType<any>; gradient: string }> = {
  pending:    { 
    label: 'Pending', 
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', 
    dot: 'bg-amber-400', 
    border: 'border-amber-400',
    icon: AlertCircle,
    gradient: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20'
  },
  confirmed:  { 
    label: 'Confirmed', 
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', 
    dot: 'bg-green-400',
    border: 'border-green-400',
    icon: CheckCircle2,
    gradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
  },
  cancelled:  { 
    label: 'Cancelled', 
    badge: 'bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400', 
    dot: 'bg-neutral-400', 
    border: 'border-neutral-400',
    icon: XCircle,
    gradient: 'from-neutral-50 to-gray-50 dark:from-neutral-900/20 dark:to-gray-900/20'
  },
  completed:  { 
    label: 'Completed', 
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400', 
    dot: 'bg-blue-400',
    border: 'border-blue-400',
    icon: CheckCircle2,
    gradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'
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

  const getDisplayStatus = (apt: Appointment): BookingStatus => {
    if (apt.status === 'cancelled') return 'cancelled';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    if (apt.status === 'completed' || aptDate < today) return 'past';
    return 'upcoming';
  };

  // Group appointments by display status
  const groupedAppointments = {
    upcoming: appointments.filter(apt => getDisplayStatus(apt) === 'upcoming'),
    past: appointments.filter(apt => getDisplayStatus(apt) === 'past'),
    cancelled: appointments.filter(apt => getDisplayStatus(apt) === 'cancelled'),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">My Bookings</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Track and manage your appointments</p>
          </div>
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <span className="text-slate-600 dark:text-slate-400">Loading your bookings…</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* ── Header ── */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">My Bookings</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {user?.name ? `${user.name.split(' ')[0]}, ` : ''}
                {appointments.length > 0
                  ? `you have ${appointments.length} booking${appointments.length !== 1 ? 's' : ''}`
                  : 'no bookings yet'}
              </p>
            </div>
            <Link to="/book">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 px-6 font-semibold hidden sm:flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Booking
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Empty State ── */}
        {appointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-16 text-center shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No bookings yet</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-8">
              When you book an appointment with a business, it will appear here. Start by finding a service you love!
            </p>
            <Link to="/book">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-bold mx-auto">
                Book Your First Appointment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* ── Upcoming Column ── */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <h2 className="font-bold text-slate-900 dark:text-white">Upcoming</h2>
                    <span className="ml-auto px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold">
                      {groupedAppointments.upcoming.length}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {groupedAppointments.upcoming.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No upcoming bookings</p>
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

            {/* ── Completed Column ── */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <h2 className="font-bold text-slate-900 dark:text-white">Completed</h2>
                    <span className="ml-auto px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold">
                      {groupedAppointments.past.length}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {groupedAppointments.past.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No completed bookings</p>
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

            {/* ── Cancelled Column ── */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-neutral-50 to-gray-50 dark:from-neutral-950/30 dark:to-gray-950/30 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                    <h2 className="font-bold text-slate-900 dark:text-white">Cancelled</h2>
                    <span className="ml-auto px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900/40 text-neutral-700 dark:text-neutral-400 text-xs font-bold">
                      {groupedAppointments.cancelled.length}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {groupedAppointments.cancelled.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No cancelled bookings</p>
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

        {/* ── Footer CTA ── */}
        {appointments.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-3xl p-6 md:p-8 shadow-lg border border-indigo-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg mb-1">Need to make changes?</h3>
                <p className="text-indigo-100 text-sm">Reschedule or cancel your bookings with just a few clicks.</p>
              </div>
              <Link to="/book">
                <Button className="bg-white hover:bg-slate-100 text-indigo-600 font-semibold rounded-xl h-10 px-6 shrink-0">
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

// ── Booking Card Component ──
interface BookingCardProps {
  booking: Appointment;
  expanded: boolean;
  onExpand: () => void;
  onCancel?: () => void;
  isCancelling?: boolean;
  displayStatus: BookingStatus;
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-gradient-to-br ${sc.gradient} rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all overflow-hidden cursor-pointer`}
    >
      <button
        onClick={onExpand}
        className="w-full text-left p-3.5 flex items-start gap-3 hover:bg-black/2 dark:hover:bg-white/5 transition-colors"
      >
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className={`flex-shrink-0 w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center ${
            booking.status === 'pending' ? 'text-amber-500' :
            booking.status === 'confirmed' || booking.status === 'completed' ? 'text-green-500' :
            'text-neutral-400'
          }`}
        >
          <StatusIcon className="w-5 h-5" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
            {booking.service}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {new Date(booking.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })} at {booking.time}
          </p>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.badge}`}>
            {sc.label}
          </span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </motion.div>
        </div>
      </button>

      {/* ── Expanded Details ── */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={expanded ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="border-t border-slate-200 dark:border-slate-700 px-3.5 py-3 space-y-3 bg-white/50 dark:bg-slate-900/30">
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Specialist</p>
              <p className="text-slate-900 dark:text-white font-semibold mt-0.5">{booking.specialist}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Price</p>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">₵{booking.price.toLocaleString()}</p>
            </div>
          </div>

          {/* ID */}
          <div className="text-xs">
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Booking ID</p>
            <p className="font-mono text-slate-600 dark:text-slate-300 text-[11px] bg-slate-900/5 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
              #{booking._id.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="text-xs">
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Notes</p>
              <p className="text-slate-700 dark:text-slate-300">{booking.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
            {displayStatus === 'upcoming' && (
              <>
                <button
                  onClick={onCancel}
                  disabled={isCancelling}
                  className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isCancelling ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                  {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
                <button className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors flex items-center justify-center gap-2">
                  <Edit2 className="w-3 h-3" />
                  Reschedule
                </button>
              </>
            )}

            {displayStatus === 'past' && (
              <>
                <Link to={`/review/write?businessId=${booking.business}&serviceId=${booking.serviceId || ''}&appointmentId=${booking._id}`} className="w-full">
                  <button className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors flex items-center justify-center gap-2">
                    <Star className="w-3 h-3" />
                    Leave Review
                  </button>
                </Link>
                <button className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors flex items-center justify-center gap-2">
                  <RotateCcw className="w-3 h-3" />
                  Rebook
                </button>
              </>
            )}

            {displayStatus === 'cancelled' && (
              <Link to="/book">
                <button className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-3 h-3" />
                  Book Again
                </button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
