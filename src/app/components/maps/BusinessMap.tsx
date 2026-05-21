import { useState, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { MapPin, ExternalLink, Star, Phone, Navigation } from "lucide-react";
import { Button } from "../ui/button";
import { StarRating } from "../StarRating";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const libraries = ["places"];

const containerStyle = {
  width: '100%',
  height: '500px'
};

interface BusinessLocationProps {
  businesses: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
    phone?: string;
    averageRating?: number;
    reviewCount?: number;
  }[];
  centerLatitude: number;
  centerLongitude: number;
  zoomLevel?: number;
  apiKey: string;
  highlightId?: string | null;
}

export function BusinessMap({
  businesses,
  centerLatitude,
  centerLongitude,
  zoomLevel = 12,
  apiKey,
  highlightId
}: BusinessLocationProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<typeof businesses[0] | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Auto-select business when highlightId changes
  useEffect(() => {
    if (highlightId && businesses.length > 0) {
      const business = businesses.find(b => b.id === highlightId);
      if (business) {
        setSelectedBusiness(business);
      }
    }
  }, [highlightId, businesses]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const openInMaps = (lat: number, lng: number, address?: string) => {
    const query = address ? encodeURIComponent(address) : `${lat},${lng}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        window.open(`http://maps.apple.com/?q=${query}`, '_system');
      } else {
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_system');
      }
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const center = {
    lat: centerLatitude,
    lng: centerLongitude
  };

  if (!apiKey) {
    // Fallback static display when no API key
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden">
          <div className="relative w-full h-96 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 p-8">
              <MapPin className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="font-bold text-neutral-900 dark:text-white">Interactive Map</h3>
              <p className="text-sm text-neutral-500 text-center mt-2">
                To display an interactive map with business markers, please add your{' '}
                <code className="bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded text-xs">GOOGLE_MAPS_API_KEY</code>{' '}
                to the frontend .env file.
              </p>
            </div>
          </div>
        </div>

        {/* Business list with static location info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden"
      >
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-700">
            <h3 className="font-bold text-neutral-900 dark:text-white">
              Business Locations ({businesses.length})
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {businesses.map((business) => (
              <div
                key={business.id}
                className={`flex items-center gap-3 p-4 border-b border-neutral-100 dark:border-neutral-700 last:border-none hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer ${
                  selectedBusiness?.id === business.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
                onClick={() => setSelectedBusiness(business)}
              >
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-neutral-900 dark:text-white truncate">{business.name}</h4>
                  {business.address && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{business.address}</p>
                  )}
                  {business.averageRating !== undefined && business.averageRating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <StarRating rating={business.averageRating} size={12} />
                      <span className="text-xs text-neutral-500">({business.reviewCount || 0})</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    openInMaps(business.latitude, business.longitude, business.address);
                  }}
                >
                  <Navigation className="w-4 h-4 text-indigo-500" />
                </Button>
              </div>
          ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden">
        <LoadScript
          googleMapsApiKey={apiKey}
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={{ ...containerStyle, height: '500px' }}
            center={center}
            zoom={zoomLevel}
            onLoad={onMapLoad}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            }}
          >
            {businesses.map((business) => (
              <Marker
                key={business.id}
                position={{ lat: business.latitude, lng: business.longitude }}
                onClick={() => setSelectedBusiness(business)}
                title={business.name}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Selected Business Details */}
      {selectedBusiness && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                {selectedBusiness.name}
              </h3>
              {selectedBusiness.averageRating !== undefined && selectedBusiness.averageRating > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={selectedBusiness.averageRating} size={14} />
                  <span className="text-sm text-neutral-500">
                    ({selectedBusiness.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openInMaps(selectedBusiness.latitude, selectedBusiness.longitude, selectedBusiness.address)}
              className="shrink-0"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
          </div>

          {selectedBusiness.address && (
            <div className="flex items-start gap-2 text-neutral-600 mb-3">
              <MapPin className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
              <span>{selectedBusiness.address}</span>
            </div>
          )}

          {selectedBusiness.phone && (
            <div className="flex items-center gap-2 text-neutral-600">
              <Phone className="w-4 h-4 text-violet-600" />
              <span>{selectedBusiness.phone}</span>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
            <p className="text-xs text-neutral-500">
              Coordinates: {selectedBusiness.latitude.toFixed(6)}, {selectedBusiness.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      {/* Business List */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-700">
          <h3 className="font-bold text-neutral-900 dark:text-white">
            All Business Locations ({businesses.length})
          </h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {businesses.map((business, idx) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              onClick={() => setSelectedBusiness(business)}
              className={`flex items-center gap-3 p-4 border-b border-neutral-100 dark:border-neutral-700 last:border-none hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer ${
                selectedBusiness?.id === business.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500' : ''
              }`}
            >
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-neutral-900 dark:text-white truncate">{business.name}</h4>
                {business.address && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{business.address}</p>
                )}
                {business.averageRating !== undefined && business.averageRating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={business.averageRating} size={12} />
                    <span className="text-xs text-neutral-500">({business.reviewCount || 0})</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  openInMaps(business.latitude, business.longitude, business.address);
                }}
              >
                <ExternalLink className="w-4 h-4 text-indigo-500" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
