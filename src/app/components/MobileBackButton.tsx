import { ArrowLeft, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";

interface MobileBackButtonProps {
  className?: string;
}

// Admin routes that should be tracked
const ADMIN_ROUTES = [
  "/admin",
  "/admin/appointments",
  "/admin/services",
  "/admin/staff",
  "/admin/clients",
  "/admin/settings",
];

export function MobileBackButton({ className = "" }: MobileBackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasAdminHistory, setHasAdminHistory] = useState(false);

  // Track admin navigation history
  useEffect(() => {
    const isCurrentAdmin = ADMIN_ROUTES.some(route => 
      location.pathname === route || location.pathname.startsWith(route + "/")
    );

    if (isCurrentAdmin) {
      // Check if there's admin history in sessionStorage
      const adminHistory = sessionStorage.getItem("admin_navigation_history");
      setHasAdminHistory(!!adminHistory);
    } else {
      // For non-admin pages, reset the history when we navigate away
      setHasAdminHistory(false);
    }
  }, [location.pathname]);

  // Update history when navigating to an admin page
  useEffect(() => {
    const isAdminRoute = ADMIN_ROUTES.some(route => 
      location.pathname === route || location.pathname.startsWith(route + "/")
    );

    if (isAdminRoute) {
      // Add current page to history
      const history = JSON.parse(sessionStorage.getItem("admin_navigation_history") || "[]");
      const lastEntry = history[history.length - 1];
      
      // Only add if it's different from the current page
      if (lastEntry !== location.pathname) {
        history.push(location.pathname);
        // Keep only last 20 entries
        const trimmedHistory = history.slice(-20);
        sessionStorage.setItem("admin_navigation_history", JSON.stringify(trimmedHistory));
        setHasAdminHistory(history.length > 1);
      }
    }
  }, [location.pathname]);

  // For login and signup pages, navigate to home instead of going back
  const loginSignupPaths = ["/login", "/signup"];
  
  if (loginSignupPaths.includes(location.pathname)) {
    return (
      <button
        onClick={() => navigate("/")}
        className={`fixed top-20 left-4 z-40 p-2 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${className}`}
        aria-label="Go to home"
      >
        <Home className="w-5 h-5" />
      </button>
    );
  }

  // Don't show on home page
  if (location.pathname === "/") {
    return null;
  }

  // Check if current page is an admin route
  const isAdminRoute = ADMIN_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith(route + "/")
  );

  // Hide back button on admin pages if there's no admin history
  if (isAdminRoute && !hasAdminHistory) {
    return null;
  }

  // Handle back navigation
  const handleBack = () => {
    if (isAdminRoute && hasAdminHistory) {
      // Get admin history and go back
      const history = JSON.parse(sessionStorage.getItem("admin_navigation_history") || "[]");
      if (history.length > 1) {
        history.pop(); // Remove current page
        const previousPage = history[history.length - 1];
        sessionStorage.setItem("admin_navigation_history", JSON.stringify(history));
        navigate(previousPage);
        return;
      }
    }
    
    // Fallback to browser history or home
    if (window.history.length > 1) {
      const from = document.referrer;
      if (from && (from.includes(window.location.host) || from.includes('serenity'))) {
        navigate(-1);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`fixed top-20 left-4 z-40 p-2 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}
