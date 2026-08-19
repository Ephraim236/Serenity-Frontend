import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Clock,
  MoreVertical,
  Check,
  X,
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
import { Link } from "react-router";
import { getAuthToken } from "../contexts/AuthContext";

const API_URL = "https://booqlly.vercel.app";

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

const DEFAULT_STATS: DashboardStats = {
  totalRevenue: "0",
  totalAppointments: 0,
  activeClients: 0,
  todayAppointments: 0,
  growth: 0
};

const DEFAULT_REVENUE_DATA = [
  { name: "Mon", revenue: 0 },
  { name: "Tue", revenue: 0 },
  { name: "Wed", revenue: 0 },
  { name: "Thu", revenue: 0 },
  { name: "Fri", revenue: 0 },
  { name: "Sat", revenue: 0 },
  { name: "Sun", revenue: 0 },
];

const DEFAULT_STAFF: Staff[] = [];
const DEFAULT_APPOINTMENTS: Appointment[] = [];

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
      currency: 'GHS',
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
        return 'bg-stone-100 text-stone-600';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl font-semibold text-stone-900">Business Overview</h1>
            <p className="text-stone-500">Welcome back!</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-lg border-stone-200 hover:bg-stone-50">Export Report</Button>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {[
            { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), iconBg: "bg-stone-900", iconColor: "text-white", statBg: "bg-stone-100", growth: stats.growth },
            { title: "Bookings", value: stats.totalAppointments, iconBg: "bg-stone-800", iconColor: "text-white", statBg: "bg-stone-100", growth: stats.growth / 2 },
            { title: "Active Clients", value: stats.activeClients, iconBg: "bg-stone-700", iconColor: "text-white", statBg: "bg-stone-100", growth: stats.growth / 3 },
            { title: "Today's Appointments", value: stats.todayAppointments, iconBg: "bg-stone-600", iconColor: "text-white", statBg: "bg-stone-100", growth: stats.growth / 4 },
          ].map((stat, idx) => (
            <motion.div
              key={stat.title}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-xl border border-stone-200 shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.iconBg} text-white rounded-xl flex items-center justify-center`}>
                    {stat.title === "Total Revenue" && <span className="text-xl font-bold">₵</span>}
                    {stat.title === "Bookings" && <CalendarIcon className="w-6 h-6" />}
                    {stat.title === "Active Clients" && <Users className="w-6 h-6" />}
                    {stat.title === "Today's Appointments" && <TrendingUp className="w-6 h-6" />}
                  </div>
                  <span className={`text-xs font-medium text-stone-600 ${stat.statBg} px-2 py-1 rounded-full`}>
                    +{typeof stat.growth === 'number' && stat.growth % 1 !== 0 ? stat.growth.toFixed(0) : stat.growth}%
                  </span>
                </div>
                <h3 className="text-stone-500 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-semibold text-stone-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10"
        >
          <div className="lg:col-span-2 p-8 border border-stone-200 shadow-sm bg-white rounded-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-medium text-stone-900">Revenue Analytics</h3>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-white border border-stone-200 text-sm font-medium p-2 rounded-lg outline-none cursor-pointer"
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
                      <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#78716c', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#78716c', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#ffffff' }}
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1e293b" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-8 border border-stone-200 shadow-sm bg-white rounded-xl">
            <h3 className="text-xl font-medium mb-6 text-stone-900">Staff Utilization</h3>
            <div className="space-y-6">
              {staff.map((member) => (
                <div key={member.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-stone-900">{member.name}</span>
                    <span className="text-stone-500">{member.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${member.value >= 80 ? 'bg-stone-900' : member.value >= 60 ? 'bg-stone-700' : 'bg-stone-500'}`} 
                      style={{ width: `${member.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-8 rounded-lg border-stone-200 hover:bg-stone-50">View Schedule</Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="p-4 sm:p-6 border border-stone-200 shadow-sm bg-white rounded-xl"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg font-medium text-stone-900">Today's Appointments</h3>
            <Link to="/admin/appointments">
              <Button variant="link" className="text-stone-900 font-medium p-0 text-sm">View Calendar</Button>
            </Link>
          </div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } }
            }}
            className="space-y-3 sm:hidden"
          >
            {appointments.slice(0, 5).map((apt) => (
              <motion.div
                key={apt._id}
                variants={{
                  hidden: { opacity: 0, y: 15, scale: 0.97 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-white border border-stone-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 font-medium text-sm">
                      {apt.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">{apt.clientName}</p>
                      <p className="text-xs text-stone-500">{apt.service}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                    {formatStatus(apt.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-stone-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>{apt.time}</span>
                    </div>
                    <span className="text-stone-400">•</span>
                    <span>{apt.specialist}</span>
                  </div>
                  {apt.status === 'pending' && (
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg text-green-600 hover:bg-green-50"
                        onClick={() => handleUpdateStatus(apt._id, 'confirmed')}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg text-red-600 hover:bg-red-50"
                        onClick={() => handleUpdateStatus(apt._id, 'cancelled')}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {appointments.length === 0 && (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-500">No appointments today</p>
              </div>
             )}
            </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } }
            }}
            className="hidden sm:block overflow-x-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="text-left text-stone-400 text-sm border-b border-stone-100">
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
                  <motion.tr
                    key={apt._id}
                    variants={{
                      hidden: { opacity: 0, x: -15 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="border-b border-stone-100 last:border-none"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 font-medium">
                          {apt.clientName.charAt(0)}
                        </div>
                        <span className="font-medium text-stone-900">{apt.clientName}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-stone-600">{apt.service}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-stone-600">
                        <Clock className="w-4 h-4 text-stone-500" />
                        {apt.time}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-stone-600">{apt.specialist}</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
