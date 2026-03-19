import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Search, 
  Mail,
  Phone,
  Check,
  X,
  Trash2,
  Loader2,
  Clock
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Calendar } from "../components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { format } from "date-fns";
import { getAuthToken } from "../contexts/AuthContext";
import { toast } from "sonner";

const API_URL = "https://serenity-5zku.onrender.com";

interface Appointment {
  _id: string;
  clientName: string;
  service: string;
  time: string;
  status: string;
  specialist: string;
  price?: number | string;
  email?: string;
  phone?: string;
  date?: string;
}

// Default data for when API is not available
const DEFAULT_APPOINTMENTS: Appointment[] = [];

export function AdminAppointments() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>(DEFAULT_APPOINTMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  // Confirmation dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    const token = getAuthToken();
    
    try {
      // Fetch appointments filtered by date
      const url = selectedDate 
        ? `${API_URL}/api/dashboard/appointments/by-date?date=${selectedDate}`
        : `${API_URL}/api/dashboard/appointments/all`;
        
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    const token = getAuthToken();
    
    try {
      const response = await fetch(`${API_URL}/api/dashboard/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setAppointments(appointments.map(apt => 
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        ));
        let statusMessage = '';
        if (newStatus === 'confirmed') {
          statusMessage = 'Booking confirmed! The client has been notified.';
        } else if (newStatus === 'cancelled') {
          statusMessage = 'Booking cancelled! The client has been notified.';
        } else {
          statusMessage = `Appointment ${newStatus} successfully`;
        }
        toast.success(statusMessage);
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);
      toast.error("Failed to update appointment");
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    
    const token = getAuthToken();
    
    try {
      const response = await fetch(`${API_URL}/api/dashboard/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAppointments(appointments.filter(apt => apt._id !== appointmentId));
        toast.success("Appointment deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      toast.error("Failed to delete appointment");
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 text-green-600';
      case 'pending': return 'bg-amber-50 text-amber-600';
      case 'in_progress': return 'bg-blue-50 text-blue-600';
      case 'completed': return 'bg-emerald-50 text-emerald-600';
      case 'cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-neutral-50 text-neutral-600';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Dialog handlers
  const openConfirmDialog = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setConfirmDialogOpen(true);
  };

  const openCancelDialog = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setCancelDialogOpen(true);
  };

  const openDeleteDialog = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setDeleteDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAppointment) return;
    
    setActionLoading(true);
    try {
      await handleUpdateStatus(selectedAppointment._id, 'confirmed');
    } finally {
      setActionLoading(false);
      setConfirmDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleCancelAction = async () => {
    if (!selectedAppointment) return;
    
    setActionLoading(true);
    try {
      await handleUpdateStatus(selectedAppointment._id, 'cancelled');
    } finally {
      setActionLoading(false);
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleDeleteAction = () => {
    if (selectedAppointment) {
      handleDeleteAppointment(selectedAppointment._id);
    }
    setDeleteDialogOpen(false);
    setSelectedAppointment(null);
  };

  // Calculate summary
  const totalBookings = filteredAppointments.length;
  const confirmed = filteredAppointments.filter(a => a.status === 'confirmed').length;
  const pending = filteredAppointments.filter(a => a.status === 'pending').length;
  const cancelled = filteredAppointments.filter(a => a.status === 'cancelled').length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar - Calendar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Card className="p-4 border-none shadow-sm bg-white rounded-3xl overflow-hidden">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                if (newDate) {
                  setSelectedDate(format(newDate, 'yyyy-MM-dd'));
                }
              }}
              className="w-full"
            />
          </Card>

          <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
            <h4 className="font-bold mb-4">Summary for Today</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Total Bookings</span>
                <span className="font-bold">{totalBookings}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Confirmed</span>
                <span className="font-bold text-green-600">{confirmed}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Pending</span>
                <span className="font-bold text-amber-600">{pending}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Cancelled</span>
                <span className="font-bold text-red-600">{cancelled}</span>
              </div>
            </div>
          </Card>

          {/* Pending Appointments Alert */}
          {pending > 0 && (
            <Card className="p-4 border-none shadow-sm bg-amber-50 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-amber-800">{pending} Pending</p>
                  <p className="text-xs text-amber-600">Require confirmation</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Content - Appointments List */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {date ? format(date, 'MMMM do, yyyy') : "Appointments"}
              </h1>
              <p className="text-neutral-500">Manage and view all bookings for this day</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search client..." 
                  className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <Card key={apt._id} className="p-6 border-none shadow-sm bg-white rounded-3xl group hover:ring-2 hover:ring-indigo-100 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] uppercase font-bold text-indigo-400">Time</span>
                          <span className="font-bold text-indigo-700 text-xs">{apt.time}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{apt.clientName}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-neutral-500">
                            {apt.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {apt.email}</span>}
                            {apt.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {apt.phone}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Service</p>
                          <p className="font-bold text-sm">{apt.service}</p>
                          {apt.price && <p className="text-neutral-500 text-xs">{typeof apt.price === 'number' ? `₵${apt.price}` : apt.price}</p>}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Specialist</p>
                          <p className="font-bold text-sm">{apt.specialist}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Status</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(apt.status)}`}>
                            {formatStatus(apt.status)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {apt.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-xl h-10 px-3 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                              onClick={() => openConfirmDialog(apt)}
                            >
                              <Check className="w-4 h-4 mr-1" /> Confirm
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-xl h-10 px-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                              onClick={() => openCancelDialog(apt)}
                            >
                              <X className="w-4 h-4 mr-1" /> Cancel
                            </Button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl h-10 px-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                            onClick={() => openCancelDialog(apt)}
                          >
                            <X className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                        )}
                        {apt.status === 'in_progress' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl h-10 px-3 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                            onClick={() => handleUpdateStatus(apt._id, 'completed')}
                          >
                            <Check className="w-4 h-4 mr-1" /> Complete
                          </Button>
                        )}
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => openDeleteDialog(apt)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-neutral-100">
                  <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-neutral-300" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">No appointments found</h3>
                  <p className="text-neutral-400">Try adjusting your search or selected date</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Appointment Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm this appointment for {selectedAppointment?.clientName}? 
              This will notify the client that their booking has been accepted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className="bg-green-600 hover:bg-green-700 rounded-xl"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Confirming...
                </>
              ) : (
                'Yes, Confirm'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Appointment Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment for {selectedAppointment?.clientName}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={actionLoading}>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelAction}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Appointment Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this appointment for {selectedAppointment?.clientName}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAction}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
