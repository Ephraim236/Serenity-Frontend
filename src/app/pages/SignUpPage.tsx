import { useState } from "react";
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
  UserPlus,
  Briefcase,
  Chrome
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth, authApi } from "../contexts/AuthContext";

export function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [role, setRole] = useState<"client" | "business">("client");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: role,
        businessName: role === "business" ? formData.businessName : undefined
      });
      
      login(response.user, response.token);
      toast.success("Account created successfully!");
      
      const from = location.state?.from || "/";
      if (role === "business") {
        navigate("/admin");
      } else {
        navigate(from === "/login" || from === "/signup" ? "/" : from);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMHNhbG9uJTIwYXV0aG9yJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0NDA3ODAwfDA&ixlib=rb-4.1.0&q=80&w=2070" 
          alt="Spa background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/80 via-purple-900/70 to-indigo-900/60" />
        {/* Animated decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl border border-white/20"
            key={role}
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <UserPlus className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            key={`title-${role}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white drop-shadow-lg"
          >
            Create Account
          </motion.h1>
          <motion.p 
            key={`subtitle-${role}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/70 mt-2"
          >
            Join as {role === "client" ? "a Client" : "a Business Owner"}
          </motion.p>
        </div>

        <Card className="p-10 border-none shadow-2xl rounded-[40px] overflow-hidden relative">
          {/* Animated gradient background covering the whole form - water effect */}
          <motion.div
            className="absolute inset-0 -z-10"
            initial={false}
            animate={{
              background: role === "client"
                ? "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 25%, #a5b4fc 50%, #c7d2fe 75%, #e0e7ff 100%)"
                : "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 25%, #c4b5fd 50%, #ddd6fe 75%, #ede9fe 100%)"
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          {/* Shimmer overlay for water flow effect */}
          <motion.div
            className="absolute inset-0 -z-10 opacity-50"
            animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, ease: "linear" }}
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
              backgroundSize: "200% 100%"
            }}
          />

          <div className="mb-10">
            <label className="text-sm font-bold text-neutral-700 block mb-4 text-center">I want to join as a:</label>
            <div className="relative">
              {/* Animated sliding background */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-indigo-600 bg-indigo-50/50"
                initial={false}
                animate={{ 
                  x: role === "client" ? 0 : "50%",
                  opacity: 1 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <div className="relative grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                    role === "client" 
                      ? "border-transparent text-white drop-shadow-md" 
                      : "border-transparent text-white/70 hover:text-white"
                  }`}
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role === "client" ? "bg-white/30 backdrop-blur-sm" : "bg-white/20"}`}
                    animate={{ scale: role === "client" ? 1 : 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <User className="w-6 h-6" />
                  </motion.div>
                  <div className="text-center">
                    <span className="block font-bold">Client</span>
                    <span className="text-[10px] opacity-70">Book appointments</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("business")}
                  className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                    role === "business" 
                      ? "border-transparent text-white drop-shadow-md" 
                      : "border-transparent text-white/70 hover:text-white"
                  }`}
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role === "business" ? "bg-white/30 backdrop-blur-sm" : "bg-white/20"}`}
                    animate={{ scale: role === "business" ? 1 : 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Briefcase className="w-6 h-6" />
                  </motion.div>
                  <div className="text-center">
                    <span className="block font-bold">Business</span>
                    <span className="text-[10px] opacity-70">Manage my salon</span>
                  </div>
                </button>
              </div>
            </div>
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
            `}</style>
          </div>

          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full h-12 mb-6 bg-white border-2 border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Chrome className="w-5 h-5" />
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400 font-medium">or sign up with email</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
            {role === "business" && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: undefined }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-sm font-bold text-neutral-700 ml-1">Business Name</label>
                <input
                  required
                  type="text"
                  name="businessName"
                  placeholder="Serenity Spa Central"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700 ml-1">Password</label>
              <input
                required
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-start gap-3 px-1">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500" />
              <label className="text-xs text-neutral-500 leading-tight">
                I agree to the <button type="button" className="text-indigo-600 font-bold hover:underline">Terms of Service</button> and <button type="button" className="text-indigo-600 font-bold hover:underline">Privacy Policy</button>.
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? "Creating Account..." : (
                <>
                  <motion.span
                    key={role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    Create {role === "client" ? "Client" : "Business"} Account
                  </motion.span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-neutral-50 text-center">
            <p className="text-neutral-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
