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
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Check if user is a business owner (for showing admin portal)
  const isBusinessOwner = user?.role === "business";

  const clientNav = [
    { label: "Home", href: "/", icon: Scissors },
    { label: "Book Now", href: "/book", icon: Calendar },
    { label: "My Bookings", href: "/my-bookings", icon: ShoppingBag },
  ];

  const adminNav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Appointments", href: "/admin/appointments", icon: Calendar },
    { label: "Services", href: "/admin/services", icon: Settings },
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none">
                    {user?.avatar ? (
                      <ImageWithFallback 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200 cursor-pointer hover:border-indigo-400 transition-colors"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm border-2 border-indigo-200 cursor-pointer hover:border-indigo-400 transition-colors">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none">
                    {user?.avatar ? (
                      <ImageWithFallback 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200 cursor-pointer hover:border-indigo-400 transition-colors"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm border-2 border-indigo-200 cursor-pointer hover:border-indigo-400 transition-colors">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

      {/* Mobile Menu Overlay - Fixed overlay that allows scrolling behind */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop - click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu Panel - Glass effect drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed top-16 left-0 w-full max-w-sm z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="bg-white/80 backdrop-blur-lg border-r border-white/20 shadow-xl m-2 rounded-2xl overflow-hidden">
            {/* Menu Content */}
            <div className="p-4 space-y-2">
              {currentNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-neutral-100 transition-colors text-lg font-medium"
                >
                  <item.icon className="w-6 h-6 text-indigo-600" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile User Section */}
              {isAuthenticated && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-3 p-4">
                    {user?.avatar ? (
                      <ImageWithFallback 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border-2 border-indigo-200">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-neutral-900 text-lg">{user?.name}</p>
                      <p className="text-sm text-neutral-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 p-4 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors text-lg font-medium"
                  >
                    <LogOut className="w-6 h-6" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
              
              {/* Admin Portal - Only show for business owners */}
              {!isAdmin && isBusinessOwner && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 text-indigo-700 font-medium text-lg"
                >
                  <LayoutDashboard className="w-6 h-6" />
                  <span>Admin Portal</span>
                </Link>
              )}

              {/* Login/Signup for non-authenticated users */}
              {!isAuthenticated && (
                <div className="space-y-3 pt-4 border-t">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-xl border-2 border-indigo-600 text-indigo-600 font-medium text-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-xl bg-indigo-600 text-white font-medium text-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            </div>
            </motion.div>
            </>
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
