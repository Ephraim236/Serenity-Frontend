import { useState, useEffect } from "react";
import { Camera, Save, MapPin, Phone, Mail, Clock, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { getAuthToken } from "../contexts/AuthContext";
import { toast } from "sonner";
import { MapPicker } from "../components/MapPicker";

// Get API URL and Google Maps key from environment
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'https://booqlly.vercel.app';
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // GPS coordinates for maps
  latitude?: number;
  longitude?: number;
}

interface ServiceHours {
  [key: string]: {
    isClosed: boolean;
    open: string;
    close: string;
  };
}

interface BusinessProfile {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessImage: string;
  businessImages: string[];
  location: Location;
  serviceHours: ServiceHours;
  operatingDays: string[];
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_SERVICE_HOURS: ServiceHours = {
  Monday: { isClosed: false, open: "09:00", close: "17:00" },
  Tuesday: { isClosed: false, open: "09:00", close: "17:00" },
  Wednesday: { isClosed: false, open: "09:00", close: "17:00" },
  Thursday: { isClosed: false, open: "09:00", close: "17:00" },
  Friday: { isClosed: false, open: "09:00", close: "17:00" },
  Saturday: { isClosed: true, open: "10:00", close: "14:00" },
  Sunday: { isClosed: true, open: "10:00", close: "14:00" },
};

const DEFAULT_LOCATION: Location = {
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  // GPS coordinates for maps
  latitude: undefined,
  longitude: undefined
};

const DEFAULT_PROFILE: BusinessProfile = {
  businessName: "",
  businessEmail: "",
  businessPhone: "",
  businessImage: "",
  businessImages: [],
  location: DEFAULT_LOCATION,
  serviceHours: DEFAULT_SERVICE_HOURS || {},
  operatingDays: [],
};

export function AdminProfile() {
  const [profile, setProfile] = useState<BusinessProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    const token = getAuthToken();

    try {
      const response = await fetch(`${getApiUrl()}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

       if (response.ok) {
         const data = await response.json();
         setProfile({
           businessName: data.businessName || "",
           businessEmail: data.businessEmail || "",
           businessPhone: data.businessPhone || "",
           businessImage: data.businessImage || "",
           businessImages: data.businessImages || [],
           location: {
             address: data.location?.address || "",
             city: data.location?.city || "",
             state: data.location?.state || "",
             zipCode: data.location?.zipCode || "",
             country: data.location?.country || "",
             // GPS coordinates for maps
             latitude: data.location?.latitude,
             longitude: data.location?.longitude
           },
           serviceHours: data.serviceHours || DEFAULT_SERVICE_HOURS,
           operatingDays: data.operatingDays || [],
         });
       }
     } catch (error) {
       console.error("Failed to fetch profile:", error);
     } finally {
       setIsLoading(false);
     }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    const token = getAuthToken();

    try {
      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({ ...profile, businessImage: data.url });
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = getAuthToken();

     try {
       const profileData = {
         businessName: profile.businessName,
         businessEmail: profile.businessEmail,
         businessPhone: profile.businessPhone,
         businessImage: profile.businessImage,
         location: {
           address: profile.location?.address || "",
           city: profile.location?.city || "",
           state: profile.location?.state || "",
           zipCode: profile.location?.zipCode || "",
           country: profile.location?.country || "",
           // GPS coordinates for maps
           latitude: profile.location?.latitude,
           longitude: profile.location?.longitude
         },
         serviceHours: profile.serviceHours,
         operatingDays: profile.operatingDays,
       };

      const response = await fetch(`${getApiUrl()}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleDay = (day: string) => {
    const currentServiceHours = profile.serviceHours || DEFAULT_SERVICE_HOURS;
    const newServiceHours = { ...currentServiceHours };
    if (newServiceHours[day]) {
      newServiceHours[day] = {
        ...newServiceHours[day],
        isClosed: !newServiceHours[day]?.isClosed,
      };
    } else {
      newServiceHours[day] = { isClosed: false, open: "09:00", close: "17:00" };
    }
    setProfile({ ...profile, serviceHours: newServiceHours });
  };

  const handleTimeChange = (day: string, field: "open" | "close", value: string) => {
    const currentServiceHours = profile.serviceHours || DEFAULT_SERVICE_HOURS;
    const newServiceHours = { ...currentServiceHours };
    if (newServiceHours[day]) {
      newServiceHours[day] = {
        ...newServiceHours[day],
        [field]: value,
      };
    }
    setProfile({ ...profile, serviceHours: newServiceHours });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Business Profile</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Manage your business information</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Business Image */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-100 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Business Image</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Upload your business logo or main image</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 border-2 border-dashed border-neutral-300 dark:border-neutral-600">
                {profile.businessImage ? (
                  <img
                    src={profile.businessImage}
                    alt="Business"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-neutral-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="business-image"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
                </label>
                <input
                  id="business-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">JPG, PNG or GIF. Max 5MB</p>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-100 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Business Information</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Basic information about your business</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Business Name</label>
                <Input
                  value={profile.businessName}
                  onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  placeholder="Enter business name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Business Email</label>
                <Input
                  type="email"
                  value={profile.businessEmail}
                  onChange={(e) => setProfile({ ...profile, businessEmail: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Phone Number</label>
                <Input
                  type="tel"
                  value={profile.businessPhone}
                  onChange={(e) => setProfile({ ...profile, businessPhone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

            {/* Location */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-100 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Location</h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Set your business location on the map. Click anywhere to place the pin.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Map Picker */}
                {GOOGLE_MAPS_API_KEY && (
                  <div className="rounded-xl overflow-hidden border border-neutral-200">
                    <MapPicker
                      apiKey={GOOGLE_MAPS_API_KEY}
                      latitude={profile.location?.latitude}
                      longitude={profile.location?.longitude}
                      onLocationSelect={(lat, lng) => {
                        setProfile({
                          ...profile,
                          location: {
                            ...profile.location,
                            latitude: lat,
                            longitude: lng
                          }
                        });
                      }}
                      height="350px"
                    />
                  </div>
                )}

                {/* Address Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Street Address</label>
                    <Input
                      value={profile.location?.address || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          location: { ...profile.location, address: e.target.value },
                        })
                      }
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">City</label>
                    <Input
                      value={profile.location?.city || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          location: { ...profile.location, city: e.target.value },
                        })
                      }
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">State / Province</label>
                    <Input
                      value={profile.location?.state || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          location: { ...profile.location, state: e.target.value },
                        })
                      }
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">ZIP / Postal Code</label>
                    <Input
                      value={profile.location?.zipCode || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          location: { ...profile.location, zipCode: e.target.value },
                        })
                      }
                      placeholder="12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Country</label>
                    <Input
                      value={profile.location?.country || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          location: { ...profile.location, country: e.target.value },
                        })
                      }
                      placeholder="Country"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Latitude (GPS)</label>
                    <Input
                      type="number"
                      step="any"
                      value={profile.location?.latitude || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          location: { ...profile.location, latitude: e.target.value ? parseFloat(e.target.value) : undefined },
                        })
                      }
                      placeholder="e.g., 5.6037"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Longitude (GPS)</label>
                    <Input
                      type="number"
                      step="any"
                      value={profile.location?.longitude || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          location: { ...profile.location, longitude: e.target.value ? parseFloat(e.target.value) : undefined },
                        })
                      }
                      placeholder="e.g., -0.1870"
                    />
                  </div>
                </div>

                {!GOOGLE_MAPS_API_KEY && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> To use the interactive map picker, set your{' '}
                      <code className="bg-yellow-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code>{' '}
                      in the .env file. You can still manually enter latitude and longitude coordinates.
                    </p>
                  </div>
                )}
              </div>
            </div>

          {/* Service Hours */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-100 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Service Hours</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">When your business is open</p>
              </div>
            </div>

            <div className="space-y-4">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!profile.serviceHours?.[day]?.isClosed}
                        onChange={() => handleToggleDay(day)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-neutral-600 peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                    </label>
                    <span className="font-medium text-neutral-900 dark:text-white">{day}</span>
                  </div>
                  {profile.serviceHours?.[day]?.isClosed ? (
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">Closed</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={profile.serviceHours?.[day]?.open || ""}
                        onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                        className="w-28"
                      />
                      <span className="text-neutral-500 dark:text-neutral-400">to</span>
                      <Input
                        type="time"
                        value={profile.serviceHours?.[day]?.close || ""}
                        onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                        className="w-28"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}