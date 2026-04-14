import { ArrowLeft, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";

interface MobileBackButtonProps {
  className?: string;
}

// All routes that should track navigation history
const TRACKED_ROUTES = [
  "/",
  "/book",
  "/my-bookings",
  "/login",
  "/signup",
  "/admin",
  "/admin/appointments",
  "/admin/services",
  "/admin/profile",
];

// Check if a route is an admin route
const isAdminRoute = (pathname: string) => 
  pathname.startsWith("/admin");

export function MobileBackButton({ className = "" }: MobileBackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  // Track navigation history
  useEffect(() => {
    const currentPath = location.pathname;
    const isTrackedRoute = TRACKED_ROUTES.some(route => 
      currentPath === route || currentPath.startsWith(route + "/")
    );

    if (isTrackedRoute) {
      // Add current page to history
      const history = JSON.parse(sessionStorage.getItem("navigation_history") || "[]");
      const lastEntry = history[history.length - 1];
      
      // Only add if it's different from current page
      if (lastEntry !== currentPath) {
        // Filter out any entries after current position (handle forward navigation)
        const currentIndex = history.indexOf(currentPath);
        if (currentIndex === -1) {
          // New page, add to end
          history.push(currentPath);
        } else {
          // We're at this page in history, trim any forward history
          const trimmedHistory = history.slice(0, currentIndex + 1);
          sessionStorage.setItem("navigation_history", JSON.stringify(trimmedHistory));
        }
        
        // Keep only last 30 entries
        const trimmedHistory = history.slice(-30);
        sessionStorage.setItem("navigation_history", JSON.stringify(trimmedHistory));
      }

      // Check if we can go back (more than 1 entry)
      const updatedHistory = JSON.parse(sessionStorage.getItem("navigation_history") || "[]");
      setCanGoBack(updatedHistory.length > 1);
    }
  }, [location.pathname]);

  // Handle back navigation
  const handleBack = () => {
    const history = JSON.parse(sessionStorage.getItem("navigation_history") || "[]");
    
    if (history.length > 1) {
      // Pop current page and go to previous
      history.pop();
      const previousPage = history[history.length - 1];
      
      // Save updated history
      sessionStorage.setItem("navigation_history", JSON.stringify(history));
      setCanGoBack(history.length > 1);
      
      // Navigate to previous page
      navigate(previousPage, { replace: true });
    } else {
      // No history, go to a sensible default based on current location
      if (isAdminRoute(location.pathname)) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  // Handle home navigation for login/signup pages
  const handleGoHome = () => {
    // Clear history when going to home from auth pages
    sessionStorage.removeItem("navigation_history");
    navigate("/", { replace: true });
  };

  // Don't show on home page
  if (location.pathname === "/") {
    return null;
  }

  // Login page - show home button instead of back
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return (
      <button
        onClick={handleGoHome}
        className={`fixed top-16 sm:top-20 left-4 z-40 p-2 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${className}`}
        aria-label="Go to home"
        style={{ touchAction: "manipulation" }}
      >
        <Home className="w-5 h-5" />
      </button>
    );
  }

  // Hide back button when there's no history to go back to
  if (!canGoBack) {
    return null;
  }

  return (
    <button
      onClick={handleBack}
      className={`fixed top-16 sm:top-20 left-4 z-40 p-2 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${className}`}
      aria-label="Go back"
      style={{ touchAction: "manipulation" }}
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}
