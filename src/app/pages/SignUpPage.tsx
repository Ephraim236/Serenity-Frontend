import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Auth3DBackground from "../components/Auth3DBackground";
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
  X,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const { login, loginWithGoogle, user } = useAuth();
  const [role, setRole] = useState<"client" | "business">("client");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  
  // Theme is always salon for signup page
  const theme = 'salon';
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

    // Use FileReader to create preview URLs
    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 5MB allowed.`);
        continue;
      }
      
      // Read file as base64 data URL
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      
      newImages.push(base64);
    }

    setFormData(prev => ({
      ...prev,
      businessImages: [...prev.businessImages, ...newImages]
    }));
    
    toast.success(`${newImages.length} image(s) added successfully`);
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
      
      // Navigate based on role
      const from = location.state?.from || "/";
      const targetPath = role === "business" ? "/admin" : (from === "/login" || from === "/signup" ? "/" : from);
      
      // Use window.location for PWA in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: minimal-ui)').matches) {
        window.location.href = targetPath;
      } else {
        navigate(targetPath, { replace: true });
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
      {/* 3D Immersive Background */}
      <Auth3DBackground theme={theme} showWelcome={showWelcome} userName={welcomeName} />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-pink-500/10 via-transparent to-blue-500/10 pointer-events-none z-0" />

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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-24 h-24 mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
            <div className="relative w-full h-full glass-card-premium rounded-3xl flex items-center justify-center text-white shadow-2xl">
              <UserPlus className="w-12 h-12" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-white/70 text-lg">Join Booqlly and get started</p>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map((step) => (
            <motion.div
              key={step}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`h-2 rounded-full transition-all ${
                step === currentStep 
                  ? 'w-8 bg-gradient-to-r from-blue-400 to-purple-400'
                  : step < currentStep 
                  ? 'w-2 bg-green-400'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Main Card */}
        <div className="glass-card-premium rounded-[32px] p-8 md:p-10 backdrop-blur-[30px]">
          {/* Role Selector */}
          {currentStep === 1 && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">I want to join as:</h2>
                <p className="text-white/60">Choose your account type</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={() => setRole("client")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative group p-6 rounded-2xl transition-all ${
                    role === "client" 
                      ? "glass-card-premium border-blue-400/40 shadow-lg shadow-blue-500/20" 
                      : "glass-card border-white/[0.15] hover:border-white/[0.3]"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto transition-all ${
                    role === "client" 
                      ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                      : "bg-white/[0.1] group-hover:bg-white/[0.15]"
                  }`}>
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-white text-lg">Client</span>
                    <span className="text-xs text-white/60">Book appointments</span>
                  </div>
                  {role === "client" && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => { setRole("business"); nextStep(); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative group p-6 rounded-2xl transition-all ${
                    role === "business" 
                      ? "glass-card-premium border-purple-400/40 shadow-lg shadow-purple-500/20" 
                      : "glass-card border-white/[0.15] hover:border-white/[0.3]"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto transition-all ${
                    role === "business" 
                      ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                      : "bg-white/[0.1] group-hover:bg-white/[0.15]"
                  }`}>
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-white text-lg">Business</span>
                    <span className="text-xs text-white/60">Manage my business</span>
                  </div>
                  {role === "business" && (
                    <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.button>
              </div>

              {role === "client" && (
                <motion.button
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full glass-button rounded-2xl h-12 text-white font-bold text-lg flex items-center justify-center gap-2 mt-6"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Business Profile Form - Step 2 */}
          {currentStep === 2 && role === "business" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Business Profile</h2>
                <button type="button" onClick={prevStep} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">Back</button>
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Business Name *</label>
                <input
                  required
                  type="text"
                  name="businessName"
                  placeholder="Booqlly Studio Central"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Business Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input
                      required
                      type="email"
                      name="businessEmail"
                      placeholder="contact@business.com"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Business Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input
                      required
                      type="tel"
                      name="businessPhone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.businessPhone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <input
                  required
                  type="text"
                  name="location.address"
                  placeholder="Street Address"
                  value={formData.location.address}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all mb-3"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    name="location.city"
                    placeholder="City"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                  />
                  <input
                    type="text"
                    name="location.state"
                    placeholder="State"
                    value={formData.location.state}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                  />
                  <input
                    type="text"
                    name="location.zipCode"
                    placeholder="Zip Code"
                    value={formData.location.zipCode}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                  />
                  <input
                    type="text"
                    name="location.country"
                    placeholder="Country"
                    value={formData.location.country}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                  />
                </div>
              </div>

              {/* Operating Days */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Operating Days *</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => toggleOperatingDay(day.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.operatingDays.includes(day.key)
                          ? "bg-indigo-600 text-white"
                          : "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Hours */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Service Hours
                </label>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day.key} className="flex items-center gap-3">
                      <span className="w-16 text-sm font-medium text-neutral-600 dark:text-neutral-300">{day.label}</span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!formData.serviceHours[day.key].isClosed}
                          onChange={(e) => handleServiceHoursChange(day.key, 'isClosed', !e.target.checked)}
                          className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Open</span>
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
                              className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
                            />
                            <span className="text-neutral-400 dark:text-neutral-500">to</span>
                            <input
                              type="time"
                              value={formData.serviceHours[day.key].close}
                              onChange={(e) => handleServiceHoursChange(day.key, 'close', e.target.value)}
                              className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
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
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Business Images
                </label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">Upload your business image</p>
                
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="business-images"
                    accept="image/*"
                    multiple
                    onChange={handleImageFilesChange}
                    className="hidden"
                  />
                  <label htmlFor="business-images" className="cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ImageIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      Click to upload images
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      or drag and drop
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>

                {/* Uploaded Images Preview */}
                {formData.businessImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {formData.businessImages.map((img, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden aspect-square bg-neutral-100 dark:bg-neutral-800">
                        <ImageWithFallback 
                          src={img} 
                          alt={`Business ${index + 1}`} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                          placeholder="skeleton"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageUrlRemove(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add URL Option */}
                <details className="mt-3">
                  <summary className="text-sm text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">
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
                          className="flex-1 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageUrlRemove(index)}
                          className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleImageUrlAdd}
                      className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
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
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Account Details</h2>
                  <button type="button" onClick={prevStep} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Back</button>
                </div>
              )}

              {/* Google OAuth Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full h-12 mb-6 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
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
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">or sign up with email</span>
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Password</label>
                <input
                  required
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white dark:placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                />
              </div>

              <div className="flex items-start gap-3 px-1">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500" />
                <label className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight">
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

          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <p className="text-white/70 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
