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
  Moon,
  Download,
  MapPin,
  Phone,
  Mail,
  LogIn
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Chatbot } from "../components/Chatbot";
import { MobileBackButton } from "../components/MobileBackButton";
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
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  // Check if user is a business owner (for showing admin portal)
  const isBusinessOwner = user?.role === "business";

const clientNav = [
  { label: "Home", href: "/", icon: Scissors },
  { label: "Book Now", href: "/book", icon: Calendar },
  { label: "My Bookings", href: "/my-bookings", icon: ShoppingBag },
  { label: "Find Businesses", href: "/business-map", icon: MapPin },
];

// Bottom tab bar: Home + Book Now are persistent, remaining two slots swap
// between (My Bookings / Find Businesses) when authenticated and
// (Login / Sign Up) when not.
const bottomMobileNav = isAuthenticated
  ? clientNav
  : [
      { label: "Home", href: "/", icon: Scissors },
      { label: "Book Now", href: "/book", icon: Calendar },
      { label: "Login", href: "/login", icon: LogIn },
      { label: "Sign Up", href: "/signup", icon: User },
    ];

  const adminNav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Appointments", href: "/admin/appointments", icon: Calendar },
    { label: "Services", href: "/admin/services", icon: Settings },
    { label: "Profile", href: "/admin/profile", icon: User },
  ];

  const currentNav = isAdmin ? adminNav : clientNav;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/90 via-white/90 to-blue-50/90 dark:from-blue-950/40 dark:via-neutral-900/90 dark:to-blue-950/40 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
                  <Scissors className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-blue-700 dark:from-blue-300 dark:to-blue-300 bg-clip-text text-transparent">Booqlly</span>
              </div>
            </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Nav Items */}
            {currentNav.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-violet-100 dark:hover:bg-violet-900/30 ${
                  location.pathname === item.href 
                    ? "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40" 
                    : "text-neutral-600 dark:text-neutral-400 hover:text-blue-700 dark:hover:text-blue-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Admin Portal Link - Only show for business owners on non-admin pages */}
            {!isAdmin && isBusinessOwner && (
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-600 text-white hover:from-blue-700 hover:to-blue-700 shadow-lg shadow-blue-500/25"
              >
                Admin Portal
              </Link>
            )}
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
                {isInstallable && !isInstalled && (
                  <button
                    onClick={promptInstall}
                    className="hidden md:flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Install
                  </button>
                )}
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/30">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white rounded-xl font-semibold px-6 shadow-lg shadow-blue-500/25">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Toggle — hidden on client pages (bottom tabs handle nav) */}
          {isAdmin && (
            <button 
              className="md:hidden p-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
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
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                  }`}
                >
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-blue-200 dark:border-blue-700">
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
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-100 to-blue-100 dark:from-blue-900/40 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 font-medium text-lg"
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
                    className="flex items-center justify-center p-4 rounded-xl border-2 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 font-medium text-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 text-white font-medium text-lg hover:from-blue-700 hover:to-blue-700 transition-colors"
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

      {/* Main content */}
      <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <MobileBackButton />
        <Outlet />
      </main>

      {/* Mobile Bottom Tab Bar — always rendered before Chatbot so Chatbot z-index sits above it */}
      {!isAdmin && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center justify-around h-20 px-2">
            {bottomMobileNav.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-3 px-3 min-w-[56px] transition-colors",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-neutral-500 dark:text-neutral-400 active:text-blue-500"
                  )}
                >
                  <item.icon className="w-7 h-7" />
                  <span className="text-sm font-medium leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
      
      <Chatbot />

      <footer className="relative bg-neutral-950 text-white pt-16 pb-10 overflow-hidden mt-auto">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-neutral-900 to-purple-600/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(147,51,234,0.12),transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">B</div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">Booqlly</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-5">Luxury self-care, effortlessly booked. Your relaxation, our priority.</p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5">Company</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5">Support</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5">Contact</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 text-blue-400" /> Accra, Ghana</li>
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-blue-400" /> +233 30 123 4567</li>
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-400" /> info@booqlly.com</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      </div>
  );
}
