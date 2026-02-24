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
      login(response.user, response.token);
      toast.success(`Logged in as ${role === "client" ? "Client" : "Business Owner"}`);
      
      const from = location.state?.from || "/";
      if (role === "business") {
        navigate("/admin");
      } else {
        navigate(from === "/login" || from === "/signup" ? "/" : from);
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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMHNwYSUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3NDQwNzgwMHww&ixlib=rb-4.1.0&q=80&w=2070" 
          alt="Spa background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-neutral-900/60" />
        {/* Animated decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">Back</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl border border-white/20"
            key={role}
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Scissors className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            key={`title-${role}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white drop-shadow-lg"
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            key={`subtitle-${role}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/70 mt-2"
          >
            Sign in as {role === "client" ? "a Client" : "a Business Owner"}
          </motion.p>
        </div>

        <Card className="p-8 border-none shadow-2xl bg-white/95 backdrop-blur-md rounded-[32px]">
          {/* Role Selector */}
          <div className="relative bg-neutral-100 p-1 rounded-2xl mb-8 overflow-hidden">
            {/* Animated flowing gradient background - water effect */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              initial={false}
              animate={{
                background: role === "client"
                  ? "linear-gradient(135deg, #a5b4fc 0%, #818cf8 25%, #6366f1 50%, #818cf8 75%, #a5b4fc 100%)"
                  : "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 25%, #8b5cf6 50%, #a78bfa 75%, #c4b5fd 100%)"
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            {/* Animated shimmer overlay for water flow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-40"
              initial={false}
              animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, ease: "linear" }}
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
                backgroundSize: "200% 100%"
              }}
            />
            <div className="relative flex">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all z-10 ${
                  role === "client" 
                    ? "text-white drop-shadow-md" 
                    : "text-white/70 hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole("business")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all z-10 ${
                  role === "business" 
                    ? "text-white drop-shadow-md" 
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Business
              </button>
            </div>
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
              <label className="text-sm font-bold text-neutral-700 ml-1">Email Address</label>
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
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-4"
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
              <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
