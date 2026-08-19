import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  User,
  Building2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth, authApi } from "../contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [role, setRole] = useState<"client" | "business">("client");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleAuthAvailable, setGoogleAuthAvailable] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    authApi.getGoogleAuthStatus()
      .then(data => setGoogleAuthAvailable(data.googleAuthAvailable))
      .catch(() => setGoogleAuthAvailable(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.login(email, password);
      
      if (response.user.role !== role) {
        if (response.user.role === 'business' && role === 'client') {
          throw new Error("This account is registered as a business. Please select Business to login.");
        } else if (response.user.role === 'client' && role === 'business') {
          throw new Error("This account is registered as a client. Please select Client to login.");
        }
      }
      
      login(response.user, response.token);
      toast.success(`Logged in successfully`);
      
      const userRole = response.user.role;
      const targetPath = userRole === "business" ? "/admin" : "/";
      
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
    <div className="min-h-screen flex">
      {/* Left side - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Brand Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="text-2xl font-semibold text-stone-900">Booqlly</span>
            </div>
          </div>

          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-stone-900 mb-2">Welcome back</h1>
              <p className="text-stone-500">Sign in to your account to continue</p>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all border ${
                  role === "client"
                    ? "border-stone-900 bg-stone-50 text-stone-900"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                }`}
              >
                <User className="w-4 h-4" />
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole("business")}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all border ${
                  role === "business"
                    ? "border-stone-900 bg-stone-50 text-stone-900"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Business
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 ml-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 h-12 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-stone-700 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 h-12 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 h-10 w-10 flex items-center justify-center rounded-lg hover:bg-stone-50 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-stone-300 rounded peer-checked:bg-stone-900 peer-checked:border-stone-900 transition-all"></div>
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-stone-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-stone-900 hover:text-stone-700 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-base font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs font-medium text-stone-400">or</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full h-12 bg-white border border-stone-200 hover:border-stone-300 text-stone-700 rounded-lg text-base font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l2.85 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-stone-500 mt-8">
              Don't have an account?{" "}
              <Link to="/signup" className="text-stone-900 font-medium hover:text-stone-700 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Decorative Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-stone-900">
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-lg text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center">
              <Scissors className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-semibold mb-4">Luxury Self-Care Effortlessly Booked</h2>
            <p className="text-base text-stone-300 leading-relaxed">
              Connecting clients and services effortlessly. Book appointments with the best businesses in Ghana.
            </p>
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-semibold">5-Star</div>
                <div className="text-sm text-stone-400 mt-1">Rated Service</div>
              </div>
              <div className="w-px h-10 bg-stone-700" />
              <div className="text-center">
                <div className="text-2xl font-semibold">24/7</div>
                <div className="text-sm text-stone-400 mt-1">Online Booking</div>
              </div>
              <div className="w-px h-10 bg-stone-700" />
              <div className="text-center">
                <div className="text-2xl font-semibold">100+</div>
                <div className="text-sm text-stone-400 mt-1">Businesses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
