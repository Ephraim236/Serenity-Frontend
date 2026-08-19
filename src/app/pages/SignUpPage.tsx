import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
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
import { Button } from "../components/ui/button";

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
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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

    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 5MB allowed.`);
        continue;
      }
      
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
      
      const from = location.state?.from || "/";
      const targetPath = role === "business" ? "/admin" : (from === "/login" || from === "/signup" ? "/" : from);
      
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
    <div className="min-h-screen flex">
      {/* Left side - Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-stone-900">
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-lg text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-2xl flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-semibold mb-4">Create Account</h2>
            <p className="text-base text-stone-300 leading-relaxed">
              Join Booqlly and get started with your self-care journey.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="text-xl font-semibold text-stone-900">Booqlly</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-stone-900 mb-2">Create Account</h1>
            <p className="text-stone-500">Join Booqlly and get started</p>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2 mb-8 justify-center">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all ${
                  step === currentStep 
                    ? 'w-8 bg-stone-900'
                    : step < currentStep 
                    ? 'w-4 bg-stone-400'
                    : 'w-4 bg-stone-200'
                }`}
              />
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-8">
            {/* Role Selector */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-stone-900 mb-2">I want to join as:</h2>
                  <p className="text-stone-500 text-sm">Choose your account type</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("client")}
                    className={`relative p-6 rounded-xl transition-all border ${
                      role === "client" 
                        ? "border-stone-900 bg-stone-50" 
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto transition-all ${
                      role === "client" 
                        ? "bg-stone-900 text-white" 
                        : "bg-stone-100 text-stone-600"
                    }`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <span className="block font-medium text-stone-900">Client</span>
                      <span className="text-xs text-stone-500">Book appointments</span>
                    </div>
                    {role === "client" && (
                      <div className="absolute top-3 right-3 bg-stone-900 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRole("business"); nextStep(); }}
                    className={`relative p-6 rounded-xl transition-all border ${
                      role === "business" 
                        ? "border-stone-900 bg-stone-50" 
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto transition-all ${
                      role === "business" 
                        ? "bg-stone-900 text-white" 
                        : "bg-stone-100 text-stone-600"
                    }`}>
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <span className="block font-medium text-stone-900">Business</span>
                      <span className="text-xs text-stone-500">Manage my business</span>
                    </div>
                    {role === "business" && (
                      <div className="absolute top-3 right-3 bg-stone-900 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                </div>

                {role === "client" && (
                  <button
                    onClick={nextStep}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-lg h-12 font-medium flex items-center justify-center gap-2 mt-6 transition-colors"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Business Profile Form - Step 2 */}
            {currentStep === 2 && role === "business" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-stone-900">Business Profile</h2>
                  <button type="button" onClick={prevStep} className="text-sm text-stone-600 font-medium hover:text-stone-900 transition-colors">Back</button>
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 ml-1">Business Name *</label>
                  <input
                    required
                    type="text"
                    name="businessName"
                    placeholder="Booqlly Studio Central"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 ml-1">Business Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        required
                        type="email"
                        name="businessEmail"
                        placeholder="contact@business.com"
                        value={formData.businessEmail}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 ml-1">Business Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        required
                        type="tel"
                        name="businessPhone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.businessPhone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 ml-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </label>
                  <input
                    required
                    type="text"
                    name="location.address"
                    placeholder="Street Address"
                    value={formData.location.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all mb-3"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      name="location.city"
                      placeholder="City"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="px-3 py-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                    />
                    <input
                      type="text"
                      name="location.state"
                      placeholder="State"
                      value={formData.location.state}
                      onChange={handleChange}
                      className="px-3 py-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                    />
                    <input
                      type="text"
                      name="location.zipCode"
                      placeholder="Zip Code"
                      value={formData.location.zipCode}
                      onChange={handleChange}
                      className="px-3 py-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                    />
                    <input
                      type="text"
                      name="location.country"
                      placeholder="Country"
                      value={formData.location.country}
                      onChange={handleChange}
                      className="px-3 py-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                    />
                  </div>
                </div>

                {/* Operating Days */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 ml-1">Operating Days *</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleOperatingDay(day.key)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          formData.operatingDays.includes(day.key)
                            ? "bg-stone-900 text-white"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Hours */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 ml-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Service Hours
                  </label>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.key} className="flex items-center gap-3">
                        <span className="w-16 text-sm font-medium text-stone-600">{day.label}</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!formData.serviceHours[day.key].isClosed}
                            onChange={(e) => handleServiceHoursChange(day.key, 'isClosed', !e.target.checked)}
                            className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                          />
                          <span className="text-xs text-stone-500">Open</span>
                        </label>
                        <AnimatePresence>
                          {!formData.serviceHours[day.key].isClosed && (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={formData.serviceHours[day.key].open}
                                onChange={(e) => handleServiceHoursChange(day.key, 'open', e.target.value)}
                                className="px-3 py-1.5 bg-white border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900"
                              />
                              <span className="text-stone-400">to</span>
                              <input
                                type="time"
                                value={formData.serviceHours[day.key].close}
                                onChange={(e) => handleServiceHoursChange(day.key, 'close', e.target.value)}
                                className="px-3 py-1.5 bg-white border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900"
                              />
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Images */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 ml-1 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Business Images
                  </label>
                  <p className="text-xs text-stone-500 ml-1">Upload your business image</p>
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:border-stone-300 transition-colors">
                    <input
                      type="file"
                      id="business-images"
                      accept="image/*"
                      multiple
                      onChange={handleImageFilesChange}
                      className="hidden"
                    />
                    <label htmlFor="business-images" className="cursor-pointer">
                      <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className="w-5 h-5 text-stone-500" />
                      </div>
                      <p className="text-sm font-medium text-stone-700">
                        Click to upload images
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        or drag and drop
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </label>
                  </div>

                  {/* Uploaded Images Preview */}
                  {formData.businessImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {formData.businessImages.map((img, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden aspect-square bg-stone-100">
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
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full transition-opacity hover:bg-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add URL Option */}
                  <details className="mt-3">
                    <summary className="text-sm text-stone-600 font-medium cursor-pointer hover:text-stone-900 transition-colors">
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
                            className="flex-1 px-4 py-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageUrlRemove(index)}
                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleImageUrlAdd}
                        className="flex items-center gap-2 text-sm text-stone-600 font-medium hover:text-stone-900 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Image URL
                      </button>
                    </div>
                  </details>
                </div>

                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium flex items-center justify-center gap-2"
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
                    <h2 className="text-xl font-semibold text-stone-900">Account Details</h2>
                    <button type="button" onClick={prevStep} className="text-sm text-stone-600 font-medium hover:text-stone-900 transition-colors">Back</button>
                  </div>
                )}

                {/* Google OAuth Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full h-12 mb-6 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Chrome className="w-5 h-5" />
                  )}
                  Continue with Google
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="text-xs text-stone-400 font-medium">or sign up with email</span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 ml-1">Password</label>
                  <input
                    required
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-300 transition-all"
                  />
                </div>

                <div className="flex items-start gap-3 px-1">
                  <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500" />
                  <label className="text-xs text-stone-500 leading-tight">
                    I agree to the <button type="button" className="text-stone-900 font-medium hover:underline">Terms of Service</button> and <button type="button" className="text-stone-900 font-medium hover:underline">Privacy Policy</button>.
                  </label>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {isLoading ? "Creating Account..." : (
                    <>
                      Create {role === "client" ? "Client" : "Business"} Account <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-stone-200 text-center">
              <p className="text-sm text-stone-500">
                Already have an account?{" "}
                <Link to="/login" className="text-stone-900 font-medium hover:text-stone-700 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
