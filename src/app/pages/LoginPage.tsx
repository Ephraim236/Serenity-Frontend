import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Scissors,
  Mail,
  Lock,
  ArrowRight,
  User,
  Building2,
  ChevronLeft,
  Chrome
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAuth, authApi } from "../contexts/AuthContext";
import Auth3DBackground from "../components/Auth3DBackground";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [role, setRole] = useState<"client" | "business">("client");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleAuthAvailable, setGoogleAuthAvailable] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  
  // Theme is always salon for login page
  const theme = 'salon';

  useEffect(() => {
    // Check if Google OAuth is configured
    authApi.getGoogleAuthStatus()
      .then(data => setGoogleAuthAvailable(data.googleAuthAvailable))
      .catch(() => setGoogleAuthAvailable(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.login(email, password);
      
      // Check if selected role matches user's actual role
      if (response.user.role !== role) {
        if (response.user.role === 'business' && role === 'client') {
          throw new Error("This account is registered as a business. Please select Business to login.");
        } else if (response.user.role === 'client' && role === 'business') {
          throw new Error("This account is registered as a client. Please select Client to login.");
        }
      }
      
      login(response.user, response.token);
      toast.success(`Logged in successfully`);
      
      // Navigate based on actual user role from response
      const userRole = response.user.role;
      const targetPath = userRole === "business" ? "/admin" : "/";
      
      // Use window.location for PWA in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: minimal-ui)').matches) {
        window.location.href = targetPath;
      } else {
        navigate(targetPath, { replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 3D Immersive Background */}
      <Auth3DBackground theme={theme} showWelcome={showWelcome} userName={welcomeName} />

      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-3 py-2 rounded-full touch-manipulation"
          aria-label="Go to home"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl border border-white/20">
            <Scissors className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Welcome Back</h1>
          <p className="text-white/70 mt-2">Sign in to your Booqlly account</p>
        </div>

        <Card className="p-8 border-none shadow-2xl bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          {/* Role Selector */}
          <div className="flex bg-neutral-100 dark:bg-neutral-700 p-1 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                role === "client" 
                  ? "bg-white dark:bg-neutral-600 text-indigo-600 dark:text-white shadow-sm" 
                  : "text-neutral-500 dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              Client
            </button>
            <button
              type="button"
              onClick={() => setRole("business")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                role === "business" 
                  ? "bg-white dark:bg-neutral-600 text-indigo-600 dark:text-white shadow-sm" 
                  : "text-neutral-500 dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Business
            </button>
          </div>

          {/* Google OAuth Button */}
          {googleAuthAvailable && (
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full h-12 mb-4 bg-white border-2 border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Chrome className="w-5 h-5" />
              )}
              Continue with Google
            </Button>
          )}

          {/* Divider */}
          {(googleAuthAvailable) && (
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-400 font-medium">or</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-neutral-700">Password</label>
                <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? "Signing in..." : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-50 text-center">
            <p className="text-neutral-500 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
