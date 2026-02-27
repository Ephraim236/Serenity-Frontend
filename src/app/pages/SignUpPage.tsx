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
  Chrome,
  MapPin,
  Clock,
  Phone,
  Image as ImageIcon,
  Plus,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth, authApi } from "../contexts/AuthContext";

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

const DEFAULT_SERVICE_HOURS = {
  monday: { open: '09:00', close: '18:00', isClosed: false },
  tuesday: { open: '09:00', close: '18:00', isClosed: false },
  wednesday: { open: '09:00', close: '18:00', isClosed: false },
  thursday: { open: '09:00', close: '18:00', isClosed: false },
  friday: { open: '09:00', close: '18:00', isClosed: false },
  saturday: { open: '09:00', close: '18:00', isClosed: false },
  sunday: { open: '09:00', close: '18:00', isClosed: true }
};

interface ServiceHours {
  open: string;
  close: string;
  isClosed: boolean;
}

interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [role, setRole] = useState<"client" | "business">("client");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Business details
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    } as Location,
    serviceHours: { ...DEFAULT_SERVICE_HOURS } as { [key: string]: ServiceHours },
    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as string[],
    businessImages: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceHoursChange = (day: string, field: keyof ServiceHours, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      serviceHours: {
        ...prev.serviceHours,
        [day]: {
          ...prev.serviceHours[day],
          [field]: value
        }
      }
    }));
  };

  const toggleOperatingDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter(d => d !== day)
        : [...prev.operatingDays, day]
    }));
  };

  const handleImageUrlAdd = () => {
    setFormData(prev => ({
      ...prev,
      businessImages: [...prev.businessImages, ""]
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      businessImages: prev.businessImages.map((img, i) => i === index ? value : img)
    }));
  };

  const handleImageUrlRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      businessImages: prev.businessImages.filter((_, i) => i !== index)
    }));
  };

  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // For now, we'll use FileReader to create preview URLs
    // In production, you'd upload to the server first
    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 5MB allowed.`);
        continue;
      }
      
      const reader = new FileReader();
      const imagePromise = new Promise<string>((resolve) => {
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
      });
      reader.readAsDataURL(file);
      newImages.push(await imagePromise);
    }

    setFormData(prev => ({
      ...prev,
      businessImages: [...prev.businessImages, ...newImages]
    }));
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
        businessName: role === "business" ? formData.businessName : undefined,
        businessEmail: role === "business" ? formData.businessEmail : undefined,
        businessPhone: role === "business" ? formData.businessPhone : undefined,
        location: role === "business" ? formData.location : undefined,
        serviceHours: role === "business" ? formData.serviceHours : undefined,
        operatingDays: role === "business" ? formData.operatingDays : undefined,
        businessImages: role === "business" ? formData.businessImages : undefined
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

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

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
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl border border-white/20">
            <UserPlus className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Create Account</h1>
          <p className="text-white/70 mt-2">Join Serenity Spa & Wellness</p>
        </div>

        <Card className="p-8 border-none shadow-2xl bg-white/95 backdrop-blur-md rounded-[40px]">
          {/* Role Selector */}
          {currentStep === 1 && (
            <div className="mb-8">
              <label className="text-sm font-bold text-neutral-700 block mb-4 text-center">I want to join as a:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                    role === "client" 
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" 
                      : "border-neutral-100 hover:border-neutral-200 text-neutral-500"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role === "client" ? "bg-indigo-600 text-white" : "bg-neutral-100"}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold">Client</span>
                    <span className="text-[10px] opacity-70">Book appointments</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => { setRole("business"); nextStep(); }}
                  className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                    role === "business" 
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" 
                      : "border-neutral-100 hover:border-neutral-200 text-neutral-500"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role === "business" ? "bg-indigo-600 text-white" : "bg-neutral-100"}`}>
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold">Business</span>
                    <span className="text-[10px] opacity-70">Manage my salon</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Business Profile Form - Step 2 */}
          {currentStep === 2 && role === "business" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Business Profile</h2>
                <button type="button" onClick={prevStep} className="text-sm text-indigo-600 font-medium hover:underline">
                  Back
                </button>
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 ml-1">Business Name *</label>
                <input
                  required
                  type="text"
                  name="businessName"
                  placeholder="Serenity Spa Central"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 ml-1">Business Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                    <input
                      required
                      type="email"
                      name="businessEmail"
                      placeholder="contact@business.com"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 ml-1">Business Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                    <input
                      required
                      type="tel"
                      name="businessPhone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.businessPhone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 ml-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <input
                  required
                  type="text"
                  name="location.address"
                  placeholder="Street Address"
                  value={formData.location.address}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all mb-3"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    name="location.city"
                    placeholder="City"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  <input
                    type="text"
                    name="location.state"
                    placeholder="State"
                    value={formData.location.state}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  <input
                    type="text"
                    name="location.zipCode"
                    placeholder="Zip Code"
                    value={formData.location.zipCode}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  <input
                    type="text"
                    name="location.country"
                    placeholder="Country"
                    value={formData.location.country}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Operating Days */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 ml-1">Operating Days *</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => toggleOperatingDay(day.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.operatingDays.includes(day.key)
                          ? "bg-indigo-600 text-white"
                          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Hours */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 ml-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Service Hours
                </label>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day.key} className="flex items-center gap-3">
                      <span className="w-16 text-sm font-medium text-neutral-600">{day.label}</span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!formData.serviceHours[day.key].isClosed}
                          onChange={(e) => handleServiceHoursChange(day.key, 'isClosed', !e.target.checked)}
                          className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs text-neutral-500">Open</span>
                      </label>
                      <AnimatePresence>
                        {!formData.serviceHours[day.key].isClosed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="time"
                              value={formData.serviceHours[day.key].open}
                              onChange={(e) => handleServiceHoursChange(day.key, 'open', e.target.value)}
                              className="px-3 py-1.5 bg-neutral-50 border border-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <span className="text-neutral-400">to</span>
                            <input
                              type="time"
                              value={formData.serviceHours[day.key].close}
                              onChange={(e) => handleServiceHoursChange(day.key, 'close', e.target.value)}
                              className="px-3 py-1.5 bg-neutral-50 border border-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Images */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 ml-1 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Business Images
                </label>
                
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    id="business-images"
                    accept="image/*"
                    multiple
                    onChange={handleImageFilesChange}
                    className="hidden"
                  />
                  <label htmlFor="business-images" className="cursor-pointer">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ImageIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-sm font-medium text-neutral-700">
                      Click to upload images
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      or drag and drop
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>

                {/* Uploaded Images Preview */}
                {formData.businessImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {formData.businessImages.map((img, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden aspect-square bg-neutral-100">
                        <img 
                          src={img} 
                          alt={`Business ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageUrlRemove(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add URL Option */}
                <details className="mt-3">
                  <summary className="text-sm text-indigo-600 font-medium cursor-pointer hover:underline">
                    Or add image URL
                  </summary>
                  <div className="mt-3 space-y-2">
                    {formData.businessImages.map((img, index) => (
                      <div key={`url-${index}`} className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={img}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageUrlRemove(index)}
                          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleImageUrlAdd}
                      className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add Image URL
                    </button>
                  </div>
                </details>
              </div>

              <Button 
                type="button" 
                onClick={nextStep}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Account Details - Step 3 or for clients */}
          {(currentStep === 3 || role === "client") && (
            <form onSubmit={handleSignUp} className="space-y-6">
              {role === "business" && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-neutral-900">Account Details</h2>
                  <button type="button" onClick={prevStep} className="text-sm text-indigo-600 font-medium hover:underline">
                    Back
                  </button>
                </div>
              )}

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
                    Create {role === "client" ? "Client" : "Business"} Account <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          )}

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
