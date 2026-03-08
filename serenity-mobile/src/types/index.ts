export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'business';
  avatar?: string;
}

export interface Service {
  id: string | number;
  name: string;
  category: string;
  duration: string;
  price: string | number;
  description?: string;
  image?: string;
  active?: boolean;
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  image?: string;
  specialty?: string;
}

export interface Appointment {
  _id: string;
  clientName: string;
  service: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  specialist: string;
  price?: string;
  email?: string;
  phone?: string;
  date?: string;
}

export interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  specialist: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: string;
  location: string;
}

export interface DashboardStats {
  totalRevenue: string;
  totalAppointments: number;
  activeClients: number;
  todayAppointments: number;
  growth: number;
}

export interface StaffMember {
  name: string;
  role: string;
  value: number;
}

export interface RevenueData {
  name: string;
  revenue: number;
}

export type RootStackParamList = {
  Auth: undefined;
  Client: undefined;
  Admin: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type ClientTabParamList = {
  Home: undefined;
  Book: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

export type AdminDrawerParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  Services: undefined;
};
