import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
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
import { motion } from "framer-motion";
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

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none z-0" />

      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => navigate('/')} 
          className="group flex items-center gap-1.5 text-white/80 hover:text-white transition-all backdrop-blur-md bg-white/[0.08] hover:bg-white/[0.12] px-3 py-2 rounded-full touch-manipulation border border-white/[0.15] hover:border-white/[0.3]"
          aria-label="Go to home"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-24 h-24 mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
            <div className="relative w-full h-full glass-card-premium rounded-3xl flex items-center justify-center text-white shadow-2xl">
              <Scissors className="w-12 h-12" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-white/70 text-lg">Sign in to your Booqlly account</p>
        </div>

        {/* Main Card */}
        <div className="glass-card-premium rounded-[32px] p-8 md:p-10 backdrop-blur-[30px]">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <motion.button
              type="button"
              onClick={() => setRole("client")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
                role === "client" 
                  ? "glass-card-premium text-blue-300 shadow-lg shadow-blue-500/30 border-blue-400/30" 
                  : "glass-card text-white/60 hover:text-white/80 border-white/[0.1]"
              }`}
            >
              <User className="w-4 h-4" />
              Client
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setRole("business")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
                role === "business" 
                  ? "glass-card-premium text-purple-300 shadow-lg shadow-purple-500/30 border-purple-400/30" 
                  : "glass-card text-white/60 hover:text-white/80 border-white/[0.1]"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Business
            </motion.button>
          </div>

          {/* Google OAuth Button */}
          {googleAuthAvailable && (
            <>
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 mb-4 glass-card-premium text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:border-white/[0.4] transition-all"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Chrome className="w-5 h-5" />
                )}
                Continue with Google
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-xs text-white/50 font-medium">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <motion.div 
              className="space-y-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-sm font-semibold text-white/80 ml-1 block">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" />
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 glass-input bg-white/[0.08] rounded-2xl text-white placeholder:text-white/40 focus:bg-white/[0.15] focus:shadow-lg focus:shadow-blue-500/20"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div 
              className="space-y-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-white/80">Password</label>
                <button type="button" className="text-xs font-semibold text-blue-400/80 hover:text-blue-300 transition-colors">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 glass-input bg-white/[0.08] rounded-2xl text-white placeholder:text-white/40 focus:bg-white/[0.15] focus:shadow-lg focus:shadow-blue-500/20"
                />
              </div>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 mt-8 glass-button rounded-2xl text-white text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Signup Link */}
          <motion.div 
            className="mt-8 pt-8 border-t border-white/10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-white/70 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                Create one now
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
