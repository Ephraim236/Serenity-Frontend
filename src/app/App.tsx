import { RouterProvider, useNavigate } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PreloadScreen } from "./components/PreloadScreen";
import { useEffect } from "react";

// Component to handle browser back button
function BrowserBackHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Handle browser back button
    const handlePopState = (event: PopStateEvent) => {
      // Get the current path
      const currentPath = window.location.pathname;
      
      // List of paths that should redirect to home instead of going back
      const authPaths = ['/login', '/signup', '/auth/callback'];
      
      // If trying to go back to auth pages, redirect to home
      if (authPaths.includes(currentPath)) {
        event.preventDefault();
        navigate('/', { replace: true });
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);
  
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserBackHandler />
        <PreloadScreen>
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </PreloadScreen>
      </AuthProvider>
    </ThemeProvider>
  );
}
