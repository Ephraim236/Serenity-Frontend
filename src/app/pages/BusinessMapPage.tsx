import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { BusinessMap } from "../components/maps/BusinessMap";

const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'https://booqlly.vercel.app';
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export function BusinessMapPage() {
  const [searchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number }>({
    latitude: 5.6037,
    longitude: -0.1870
  });
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const highlightBusiness = searchParams.get('highlight');

  useEffect(() => {
    fetchBusinessLocations();
  }, []);

  // Effect to highlight business after data loads
  useEffect(() => {
    if (highlightBusiness && businesses.length > 0) {
      const business = businesses.find(b => b.id === highlightBusiness);
      if (business) {
        setHighlightedId(highlightBusiness);
        setMapCenter({ latitude: business.latitude, longitude: business.longitude });
      }
    }
  }, [highlightBusiness, businesses]);

  const fetchBusinessLocations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getApiUrl()}/api/auth/business-locations`, {
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
            address: b.location ? buildAddress(b) : undefined,
            phone: b.businessPhone || undefined,
            averageRating: b.averageRating,
            reviewCount: b.reviewCount
          }));

        setBusinesses(validBusinesses);

        // Update map center to average of all business locations if we have businesses
        if (validBusinesses.length > 0) {
          // If no highlight, center on average; otherwise center on highlighted business
          if (!highlightBusiness) {
            const avgLat = validBusinesses.reduce((sum, b) => sum + b.latitude, 0) / validBusinesses.length;
            const avgLng = validBusinesses.reduce((sum, b) => sum + b.longitude, 0) / validBusinesses.length;
            setMapCenter({ latitude: avgLat, longitude: avgLng });
          }
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

  // Helper to build full address from location parts
  const buildAddress = (b: any) => {
    const parts = [];
    if (b.location?.address) parts.push(b.location.address);
    if (b.location?.city) parts.push(b.location.city);
    if (b.location?.state) parts.push(b.location.state);
    if (b.location?.country) parts.push(b.location.country);
    return parts.join(', ');
  };

  const handleRefresh = async () => {
    await fetchBusinessLocations();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading business locations...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <MapPin className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Unable to Load Map
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            {error}
          </p>
          <Button
            onClick={handleRefresh}
             className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-3 rounded-lg transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Find Businesses Near You
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            View business locations on the map and get directions to their shops
          </p>
        </motion.div>

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
               apiKey={GOOGLE_MAPS_API_KEY}
               highlightId={highlightedId}
             />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <MapPin className="w-16 h-16 text-neutral-400 mb-4" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              No Business Locations Available
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              No businesses with location data are currently available.
              Business owners can set their GPS coordinates in their profile settings.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}