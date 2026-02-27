import { useState, useEffect } from "react";
import { 
  Users, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  DollarSign,
  Clock,
  MoreVertical,
  Check,
  X,
  Plus,
  Loader2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { getAuthToken } from "../contexts/AuthContext";

const API_URL = "https://serenity-production-bafc.up.railway.app";

interface DashboardStats {
  totalRevenue: string;
  totalAppointments: number;
  activeClients: number;
  todayAppointments: number;
  growth: number;
}

interface Appointment {
  _id: string;
  clientName: string;
  service: string;
  time: string;
  status: string;
  specialist: string;
}

interface Staff {
  name: string;
  role: string;
  value: number;
}

// Default data for when API is not available
const DEFAULT_STATS: DashboardStats = {
  totalRevenue: "12,840",
  totalAppointments: 156,
  activeClients: 842,
  todayAppointments: 12,
  growth: 12.5
};

const DEFAULT_REVENUE_DATA = [
  { name: "Mon", revenue: 4000 },
  { name: "Tue", revenue: 3000 },
  { name: "Wed", revenue: 5000 },
  { name: "Thu", revenue: 2780 },
  { name: "Fri", revenue: 6890 },
  { name: "Sat", revenue: 8390 },
  { name: "Sun", revenue: 4490 },
];

const DEFAULT_STAFF: Staff[] = [
  { name: "Sarah J.", role: "Skin", value: 85 },
  { name: "Michael C.", role: "Massage", value: 65 },
  { name: "Emma W.", role: "Hair", value: 92 },
  { name: "David L.", role: "Nails", value: 45 },
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    _id: "1",
    clientName: "Jessica Reed",
    service: "Luxury Facial",
    time: "10:30 AM",
    status: "confirmed",
    specialist: "Sarah J."
  },
  {
    _id: "2",
    clientName: "Marcus Smith",
    service: "Deep Tissue",
    time: "12:00 PM",
    status: "pending",
    specialist: "Michael C."
  },
  {
    _id: "3",
    clientName: "Elena Gilbert",
    service: "Designer Haircut",
    time: "02:15 PM",
    status: "in_progress",
    specialist: "Emma W."
  }
];

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [revenueData, setRevenueData] = useState(DEFAULT_REVENUE_DATA);
  const [staff, setStaff] = useState<Staff[]>(DEFAULT_STAFF);
  const [appointments, setAppointments] = useState<Appointment[]>(DEFAULT_APPOINTMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("7");

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const token = getAuthToken();
    
    try {
      // Fetch stats
      const statsResponse = await fetch(`${API_URL}/api/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
        setAppointments(statsData.recentAppointments || DEFAULT_APPOINTMENTS);
      }

      // Fetch revenue data
      const revenueResponse = await fetch(`${API_URL}/api/dashboard/revenue?period=${period}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (revenueResponse.ok) {
        const revenueData = await revenueResponse.json();
        if (revenueData.length > 0) {
          setRevenueData(revenueData);
        }
      }

      // Fetch staff data
      const staffResponse = await fetch(`${API_URL}/api/dashboard/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        if (staffData.length > 0) {
          setStaff(staffData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Keep default data if API fails
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
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-600';
      case 'pending':
        return 'bg-amber-50 text-amber-600';
      case 'in_progress':
        return 'bg-blue-50 text-blue-600';
      case 'completed':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-neutral-50 text-neutral-600';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Business Overview</h1>
          <p className="text-neutral-500">Welcome back!</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl">Export Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.growth}%
            </span>
          </div>
          <h3 className="text-neutral-500 text-sm font-medium mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-neutral-900">{formatCurrency(stats.totalRevenue)}</p>
        </Card>

        <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.growth / 2}%
            </span>
          </div>
          <h3 className="text-neutral-500 text-sm font-medium mb-1">Bookings</h3>
          <p className="text-2xl font-bold text-neutral-900">{stats.totalAppointments}</p>
        </Card>

        <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.growth / 3}%
            </span>
          </div>
          <h3 className="text-neutral-500 text-sm font-medium mb-1">Active Clients</h3>
          <p className="text-2xl font-bold text-neutral-900">{stats.activeClients}</p>
        </Card>

        <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.growth / 4}%
            </span>
          </div>
          <h3 className="text-neutral-500 text-sm font-medium mb-1">Today's Appointments</h3>
          <p className="text-2xl font-bold text-neutral-900">{stats.todayAppointments}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-8 border-none shadow-sm bg-white rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Revenue Analytics</h3>
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-neutral-50 border-none text-sm font-medium p-2 rounded-lg outline-none cursor-pointer"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="365">This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Staff Availability/Summary */}
        <Card className="p-8 border-none shadow-sm bg-white rounded-3xl">
          <h3 className="text-xl font-bold mb-6">Staff Utilization</h3>
          <div className="space-y-6">
            {staff.map((member) => (
              <div key={member.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{member.name}</span>
                  <span className="text-neutral-500">{member.value}%</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${member.value >= 80 ? 'bg-indigo-600' : member.value >= 60 ? 'bg-blue-600' : 'bg-emerald-600'}`} 
                    style={{ width: `${member.value}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-8 rounded-xl">View Schedule</Button>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="p-8 border-none shadow-sm bg-white rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold">Today's Appointments</h3>
          <Link to="/admin/appointments">
            <Button variant="link" className="text-indigo-600 font-bold p-0">View Calendar</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-neutral-400 text-sm border-b border-neutral-50">
                <th className="pb-4 font-medium">Client</th>
                <th className="pb-4 font-medium">Service</th>
                <th className="pb-4 font-medium">Time</th>
                <th className="pb-4 font-medium">Specialist</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt._id} className="border-b border-neutral-50 last:border-none group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {apt.clientName.charAt(0)}
                      </div>
                      <span className="font-bold">{apt.clientName}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-neutral-600">{apt.service}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      {apt.time}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-neutral-600">{apt.specialist}</span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(apt.status)}`}>
                      {formatStatus(apt.status)}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {apt.status === 'pending' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-green-600 hover:bg-green-50"
                            onClick={() => handleUpdateStatus(apt._id, 'confirmed')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-red-600 hover:bg-red-50"
                            onClick={() => handleUpdateStatus(apt._id, 'cancelled')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
