import { Outlet, Link, useLocation } from "react-router";
import { 
  Calendar, 
  User, 
  LayoutDashboard, 
  Settings, 
  Scissors, 
  ShoppingBag,
  Bell,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

export function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const clientNav = [
    { label: "Home", href: "/", icon: Scissors },
    { label: "Book Now", href: "/book", icon: Calendar },
    { label: "My Bookings", href: "/my-bookings", icon: ShoppingBag },
  ];

  const adminNav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Appointments", href: "/admin/appointments", icon: Calendar },
    { label: "Services", href: "/admin/services", icon: Settings },
    { label: "Client View", href: "/", icon: User },
  ];

  const currentNav = isAdmin ? adminNav : clientNav;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Scissors className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">Serenity</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {currentNav.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  location.pathname === item.href ? "text-indigo-600" : "text-neutral-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin ? (
               <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </Button>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">{user?.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={logout}
                  className="text-neutral-500 hover:text-red-600"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-bold text-neutral-600 hover:text-indigo-600">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold px-6">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-neutral-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 w-full bg-white border-b z-40 p-4 space-y-2 shadow-lg"
          >
            {currentNav.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <item.icon className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            {!isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Admin Portal</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-neutral-500 text-sm">
          <p>© 2026 Serenity. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
