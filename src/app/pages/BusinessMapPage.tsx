import { useState, useEffect } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { BusinessMap } from "../components/maps/BusinessMap";

const API_URL = "https://booqlly.vercel.app";

interface BusinessLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  phone?: string;
  averageRating?: number;
  reviewCount?: number;
}

export function BusinessMapPage() {
  const [businesses, setBusinesses] = useState<BusinessLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number }>({
    latitude: 5.6037, // Default to Ghana coordinates
    longitude: -0.1870
  });

  useEffect(() => {
    fetchBusinessLocations();
  }, []);

  const fetchBusinessLocations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/business-locations`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.businesses && Array.isArray(data.businesses)) {
        // Filter out businesses without valid coordinates
        const validBusinesses = data.businesses
          .filter((b: any) => 
            b.latitude !== undefined && 
            b.longitude !== undefined && 
            b.latitude !== null && 
            b.longitude !== null
          )
           .map((b: any) => ({
             id: b.id,
             name: b.name,
             latitude: Number(b.latitude),
             longitude: Number(b.longitude),
             address: b.address || undefined,
             phone: b.phone || undefined,
             averageRating: b.averageRating,
             reviewCount: b.reviewCount
           }));

        setBusinesses(validBusinesses);
        
        // Update map center to average of all business locations if we have businesses
        if (validBusinesses.length > 0) {
          const avgLat = validBusinesses.reduce((sum, b) => sum + b.latitude, 0) / validBusinesses.length;
          const avgLng = validBusinesses.reduce((sum, b) => sum + b.longitude, 0) / validBusinesses.length;
          setMapCenter({ latitude: avgLat, longitude: avgLng });
        }
      } else {
        setBusinesses([]);
      }
    } catch (err) {
      console.error('Failed to fetch business locations:', err);
      setError('Failed to load business locations. Please try again later.');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchBusinessLocations();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading business locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Unable to Load Map
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            {error}
          </p>
          <Button 
            onClick={handleRefresh}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Find Businesses Near You
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            View business locations on the map and get directions to their shops
          </p>
        </div>

        {businesses.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Business Locations ({businesses.length})
              </h2>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <BusinessMap 
              businesses={businesses} 
              centerLatitude={mapCenter.latitude} 
              centerLongitude={mapCenter.longitude}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-neutral-400 mb-4" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              No Business Locations Available
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              No businesses with location data are currently available.
              Business owners can set their GPS coordinates in their profile settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}