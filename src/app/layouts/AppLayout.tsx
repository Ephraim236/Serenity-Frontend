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
  MapPin
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
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

      <main className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
        <MobileBackButton />
        <Outlet />
      </main>

      <Chatbot />

      {/* Footer — add bottom padding when bottom tab bar is visible */}
      <footer className={cn("border-t bg-white py-8 dark:bg-neutral-900 dark:border-neutral-800", !isAdmin && "pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-8")}>
        {location.pathname === "/" && (
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-center text-neutral-800 dark:text-neutral-200 mb-6">Install Booqlly App</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Android Instructions */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.3414L12.4751 19.7066C12.2431 19.9039 11.8962 19.8899 11.6806 19.6743L6.58985 14.5836C6.15254 14.1463 6.46406 13.4288 7.08363 13.4288H10.0002V3.00012C10.0002 2.44784 10.4479 2.00012 11.0002 2.00012H13.0002C13.5525 2.00012 14.0002 2.44784 14.0002 3.00012V13.4288H16.9167C17.5363 13.4288 17.8478 14.1463 17.523 15.3414Z"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Android / Chrome</h4>
                </div>
                <ol className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex gap-2"><span className="text-blue-600 dark:text-blue-400 font-medium">1.</span> Tap the menu button ⋮ in Chrome</li>
                  <li className="flex gap-2"><span className="text-blue-600 dark:text-blue-400 font-medium">2.</span> Select <strong>Install app</strong> from menu</li>
                  <li className="flex gap-2"><span className="text-blue-600 dark:text-blue-400 font-medium">3.</span> Confirm with <strong>Install</strong> when prompted</li>
                  <li className="flex gap-2"><span className="text-blue-600 dark:text-blue-400 font-medium">4.</span> Booqlly will be added to your home screen</li>
                </ol>
              </div>

              {/* iOS Instructions */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21ZM12 17C12.5523 17 13 16.5523 13 16H11C11 16.5523 11.4477 17 12 17Z"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">iPhone / Safari</h4>
                </div>
                <ol className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex gap-2"><span className="text-blue-600 dark:text-blue-400 font-medium">1.</span> Tap the share button <svg className="inline w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> at bottom</li>
                  <li className="flex gap-2"><span className="text-blue-600 dark:text-blue-400 font-medium">2.</span> Scroll and tap <strong>Add to Home Screen</strong></li>
                  <li className="flex gap-2"><span className="text-blue-600 dark:text-blue-400 font-medium">3.</span> Tap <strong>Add</strong> in the top right corner</li>
                  <li className="flex gap-2"><span className="text-blue-600 dark:text-blue-400 font-medium">4.</span> App icon will appear on your home screen</li>
                </ol>
              </div>
            </div>

            <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm">© 2026 Booqlly. All rights reserved.</p>
          </div>
        </div>
        )}
        {location.pathname !== "/" && (
        <div className="container mx-auto px-4">
          <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm">© 2026 Booqlly. All rights reserved.</p>
        </div>
        )}
      </footer>

      {/* Mobile Bottom Tab Bar — client pages only */}
      {!isAdmin && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center justify-around h-16 px-2">
            {clientNav.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[52px] transition-colors",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-neutral-500 dark:text-neutral-400 active:text-blue-500"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
