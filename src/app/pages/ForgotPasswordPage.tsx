import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, ArrowLeft, Send, Scissors } from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const API_URL = () => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          return 'http://localhost:5000';
        }
        return 'https://booqlly.vercel.app';
      };

      const response = await fetch(`${API_URL()}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send reset email");
      }
      
      setIsSubmitted(true);
      toast.success("If your email exists, you will receive a password reset link.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl border border-stone-200 p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="text-2xl font-semibold text-stone-900">Booqlly</span>
            </Link>
          </div>

          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-stone-900 mb-2">Forgot password?</h1>
                <p className="text-stone-500">Enter your email and we'll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-base font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send reset link <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-stone-600" />
              </div>
              <h2 className="text-2xl font-semibold text-stone-900 mb-2">Check your email</h2>
              <p className="text-stone-500 mb-6">
                We've sent a password reset link to <strong className="text-stone-900">{email}</strong>
              </p>
              <Link to="/login">
                <button className="inline-flex items-center gap-2 text-stone-900 font-medium hover:text-stone-700 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              </Link>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-stone-200 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
