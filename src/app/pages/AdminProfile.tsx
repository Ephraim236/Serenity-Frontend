import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { toast } from "sonner";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Upload, 
  X, 
  Save,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getAuthToken, useAuth } from "../contexts/AuthContext";

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

const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return 'https://serenity-gamma-two.vercel.app';
};

const mergeServiceHours = (serverHours: any) => {
  return {
    monday: serverHours?.monday || DEFAULT_SERVICE_HOURS.monday,
    tuesday: serverHours?.tuesday || DEFAULT_SERVICE_HOURS.tuesday,
    wednesday: serverHours?.wednesday || DEFAULT_SERVICE_HOURS.wednesday,
    thursday: serverHours?.thursday || DEFAULT_SERVICE_HOURS.thursday,
    friday: serverHours?.friday || DEFAULT_SERVICE_HOURS.friday,
    saturday: serverHours?.saturday || DEFAULT_SERVICE_HOURS.saturday,
    sunday: serverHours?.sunday || DEFAULT_SERVICE_HOURS.sunday,
  };
};

export function AdminProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile>({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    serviceHours: DEFAULT_SERVICE_HOURS,
    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    businessImages: []
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch current profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${getApiUrl()}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // If user has business data, populate the form
        if (data.businessName || data.businessEmail || data.businessPhone || data.location || data.serviceHours) {
          // Convert relative image paths to full URLs
          const apiUrl = getApiUrl();
          const businessImages = (data.businessImages || []).map((img: string) => {
            if (img && img.startsWith('/uploads/')) {
              return `${apiUrl}${img}`;
            }
            return img;
          });

          setProfile({
            businessName: data.businessName || '',
            businessEmail: data.businessEmail || '',
            businessPhone: data.businessPhone || '',
            location: data.location || {
              address: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            },
            serviceHours: mergeServiceHours(data.serviceHours),
            operatingDays: data.operatingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            businessImages: businessImages
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${getApiUrl()}/api/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      let imageUrl = data.url;
      
      // Add the uploaded image URL to the profile
      setProfile(prev => ({
        ...prev,
        businessImages: [...prev.businessImages, imageUrl]
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setProfile(prev => ({
      ...prev,
      businessImages: prev.businessImages.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const token = getAuthToken();
      const apiUrl = getApiUrl();
      
      // Convert full image URLs back to relative paths for backend storage
      const businessImages = profile.businessImages.map((img: string) => {
        if (img && img.startsWith(apiUrl)) {
          return img.replace(apiUrl, '');
        }
        return img;
      });
      
      // Prepare the profile data - ensure location is properly formatted
      const profileData = {
        businessName: profile.businessName,
        businessEmail: profile.businessEmail,
        businessPhone: profile.businessPhone,
        location: {
          address: profile.location?.address || '',
          city: profile.location?.city || '',
          state: profile.location?.state || '',
          zipCode: profile.location?.zipCode || '',
          country: profile.location?.country || ''
        },
        serviceHours: profile.serviceHours,
        operatingDays: profile.operatingDays,
        businessImages: businessImages
      };
      
      const response = await fetch(`${getApiUrl()}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Profile updated successfully');
        
        // Update user in auth context if needed
        if (data.user) {
          const storedUser = localStorage.getItem('serenity_auth_user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            parsed.businessName = data.user.businessName;
            localStorage.setItem('serenity_auth_user', JSON.stringify(parsed));
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleServiceHoursChange = (day: string, field: 'open' | 'close' | 'isClosed', value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      serviceHours: {
        ...prev.serviceHours,
        [day]: {
          ...(prev.serviceHours[day] || DEFAULT_SERVICE_HOURS[day]),
          [field]: value
        }
      }
    }));
  };

  const toggleOperatingDay = (day: string) => {
    setProfile(prev => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter(d => d !== day)
        : [...prev.operatingDays, day]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Business Profile</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Manage your business information and settings</p>
      </div>

      <div className="space-y-8">
        {/* Business Images */}
        <Card className="p-6 border-none shadow-sm bg-white dark:bg-neutral-800 rounded-3xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600" />
            Business Images
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profile.businessImages.map((img, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden aspect-square bg-neutral-100">
                <ImageWithFallback 
                  src={img} 
                  alt={`Business ${index + 1}`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  placeholder="skeleton"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-neutral-200 rounded-xl flex items-center justify-center aspect-square hover:border-indigo-400 transition-colors">
              <input
                type="file"
                id="profile-image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <label htmlFor="profile-image-upload" className="cursor-pointer flex flex-col items-center p-4">
                {uploadingImage ? (
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                    <span className="text-xs text-neutral-500">Add Image</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </Card>

        {/* Business Details */}
        <Card className="p-6 border-none shadow-sm bg-white dark:bg-neutral-800 rounded-3xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Business Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                placeholder="Your Business Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessEmail">Business Email</Label>
              <Input
                id="businessEmail"
                type="email"
                value={profile.businessEmail}
                onChange={(e) => setProfile({ ...profile, businessEmail: e.target.value })}
                placeholder="business@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Phone Number</Label>
              <Input
                id="businessPhone"
                type="tel"
                value={profile.businessPhone}
                onChange={(e) => setProfile({ ...profile, businessPhone: e.target.value })}
                placeholder="+233 123 456 789"
              />
            </div>
          </div>
        </Card>

        {/* Location */}
        <Card className="p-6 border-none shadow-sm bg-white dark:bg-neutral-800 rounded-3xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            Location
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.location.address}
                onChange={(e) => setProfile({
                  ...profile,
                  location: { ...profile.location, address: e.target.value }
                })}
                placeholder="Street address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profile.location.city}
                onChange={(e) => setProfile({
                  ...profile,
                  location: { ...profile.location, city: e.target.value }
                })}
                placeholder="Accra"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Region</Label>
              <Input
                id="state"
                value={profile.location.state}
                onChange={(e) => setProfile({
                  ...profile,
                  location: { ...profile.location, state: e.target.value }
                })}
                placeholder="Greater Accra"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={profile.location.zipCode}
                onChange={(e) => setProfile({
                  ...profile,
                  location: { ...profile.location, zipCode: e.target.value }
                })}
                placeholder="0000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profile.location.country}
                onChange={(e) => setProfile({
                  ...profile,
                  location: { ...profile.location, country: e.target.value }
                })}
                placeholder="Ghana"
              />
            </div>
          </div>
        </Card>

        {/* Service Hours */}
        <Card className="p-6 border-none shadow-sm bg-white dark:bg-neutral-800 rounded-3xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Service Hours
          </h2>
          
          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                <div className="flex items-center gap-3 min-w-[120px]">
                  <input
                    type="checkbox"
                    id={`${day}-open`}
                    checked={!profile.serviceHours[day]?.isClosed}
                    onChange={(e) => handleServiceHoursChange(day, 'isClosed', !e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`${day}-open`} className="font-medium capitalize text-neutral-900 dark:text-white">
                    {day}
                  </label>
                </div>
                
                <div className="flex items-center gap-2 flex-1">
                  {profile.serviceHours[day]?.isClosed ? (
                    <span className="text-neutral-500">Closed</span>
                  ) : (
                    <>
                      <Input
                        type="time"
                        value={profile.serviceHours[day]?.open || ''}
                        onChange={(e) => handleServiceHoursChange(day, 'open', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-neutral-400">to</span>
                      <Input
                        type="time"
                        value={profile.serviceHours[day]?.close || ''}
                        onChange={(e) => handleServiceHoursChange(day, 'close', e.target.value)}
                        className="w-32"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 rounded-xl text-lg font-bold flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}