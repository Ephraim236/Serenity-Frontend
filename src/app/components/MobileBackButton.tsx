import { ArrowLeft, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

interface MobileBackButtonProps {
  className?: string;
}

export function MobileBackButton({ className = "" }: MobileBackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <button
      onClick={() => navigate(-1)}
      className={`fixed top-20 left-4 z-40 p-2 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}
