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
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
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
  const { theme, toggleTheme } = useTheme();

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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-violet-100 dark:border-violet-900/30 bg-gradient-to-r from-violet-50/90 via-white/90 to-purple-50/90 dark:from-violet-950/40 dark:via-neutral-900/90 dark:to-purple-950/40 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
                  <Scissors className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-700 to-purple-700 dark:from-violet-300 dark:to-purple-300 bg-clip-text text-transparent">Serenity</span>
              </div>
            </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {currentNav.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-violet-100 dark:hover:bg-violet-900/30 ${
                  location.pathname === item.href 
                    ? "text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/40" 
                    : "text-neutral-600 dark:text-neutral-400 hover:text-violet-700 dark:hover:text-violet-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/30"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-violet-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </Button>
            {isAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none">
                    {user?.avatar ? (
                      <ImageWithFallback 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-violet-200 dark:border-violet-700 cursor-pointer hover:border-violet-400 dark:hover:border-violet-500 transition-colors"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm border-2 border-violet-200 dark:border-violet-700 cursor-pointer hover:border-violet-400 dark:hover:border-violet-500 transition-colors">
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
                        className="w-8 h-8 rounded-full object-cover border-2 border-violet-200 dark:border-violet-700 cursor-pointer hover:border-violet-400 dark:hover:border-violet-500 transition-colors"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm border-2 border-violet-200 dark:border-violet-700 cursor-pointer hover:border-violet-400 dark:hover:border-violet-500 transition-colors">
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
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-violet-700 dark:text-violet-300 hover:text-violet-800 dark:hover:text-violet-200 hover:bg-violet-100 dark:hover:bg-violet-900/30">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold px-6 shadow-lg shadow-violet-500/25">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Fixed overlay that allows scrolling behind */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden">
            {/* Backdrop - click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu Panel - Glass effect drawer */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white/70 backdrop-blur-xl border-r border-white/30 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Menu Content */}
              <div className="p-4 space-y-2">
              {currentNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-colors text-lg font-medium ${
                    location.pathname === item.href
                      ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                  }`}
                >
                  <item.icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile User Section */}
              {isAuthenticated && (
                <div className="border-t border-violet-100 dark:border-violet-800/30 pt-4 mt-4">
                  <div className="flex items-center gap-3 p-4">
                    {user?.avatar ? (
                      <ImageWithFallback 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-violet-200 dark:border-violet-700"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-violet-200 dark:border-violet-700">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white text-lg">{user?.name}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 p-4 w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-lg font-medium"
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
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 text-violet-700 dark:text-violet-300 font-medium text-lg"
                >
                  <LayoutDashboard className="w-6 h-6" />
                  <span>Admin Portal</span>
                </Link>
              )}

              {/* Login/Signup for non-authenticated users */}
              {!isAuthenticated && (
                <div className="space-y-3 pt-4 border-t border-violet-100 dark:border-violet-800/30">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-xl border-2 border-violet-600 dark:border-violet-500 text-violet-700 dark:text-violet-300 font-medium text-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium text-lg hover:from-violet-700 hover:to-purple-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            </motion.div>
          </div>
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
