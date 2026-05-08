import { useState } from "react";
import { MapPin, ExternalLink, Star } from "lucide-react";
import { Button } from "../ui/button";
import { StarRating } from "../StarRating";

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
}

export function BusinessMap({ 
  businesses, 
  centerLatitude, 
  centerLongitude, 
  zoomLevel = 12 
}: BusinessLocationProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<typeof businesses[0] | null>(null);

  const openInMaps = (lat: number, lng: number, address?: string) => {
    // Construct maps URL with optional address query
    const query = address ? encodeURIComponent(address) : `${lat},${lng}`;
    
    // Detect if we're on mobile and likely iOS/Android
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile, use platform-specific maps URL
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        // Apple Maps
        window.open(`http://maps.apple.com/?q=${query}`, '_system');
      } else {
        // Google Maps for Android
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_system');
      }
    } else {
      // For desktop, open in new tab
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const getInitialViewState = () => ({
    latitude: centerLatitude,
    longitude: centerLongitude,
    zoom: zoomLevel,
  });

  return (
    <div className="rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden">
      {/* Map Container - Using static map image for simplicity */}
      <div className="relative w-full h-96 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
        {/* Placeholder for actual map implementation */}
        <div className="absolute inset-0 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="font-bold text-neutral-900 dark:text-white">Interactive Map</h3>
            <p className="text-neutral-500">
              Business locations will appear here when Google Maps API is integrated
            </p>
          </div>
        </div>
        
        {/* Business List */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-800/90 backdrop-blur-sm p-4">
          <div className="space-y-3">
            {businesses.map((business) => (
              <div 
                key={business.id} 
                onClick={() => setSelectedBusiness(business)}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer ${
                  selectedBusiness?.id === business.id ? 'border-l-4 border-indigo-500' : ''
                }`}
              >
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                 <div className="flex-1">
                   <h4 className="font-medium text-neutral-900 dark:text-white">{business.name}</h4>
                   {business.address && (
                     <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{business.address}</p>
                   )}
                   {business.averageRating !== undefined && business.averageRating > 0 && (
                     <div className="flex items-center gap-1 mt-1">
                       <StarRating rating={business.averageRating} size={12} />
                       <span className="text-xs text-neutral-500">
                         ({business.reviewCount || 0})
                       </span>
                     </div>
                   )}
                 </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="p-2 hover:bg-indigo-50 dark:hover:bg-neutral-700/50"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering business selection
                    openInMaps(business.latitude, business.longitude, business.address);
                  }}
                >
                  <ExternalLink className="w-4 h-4 text-indigo-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Business Details */}
      {selectedBusiness && (
        <div className="mt-6 p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              {selectedBusiness.name}
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                openInMaps(selectedBusiness.latitude, selectedBusiness.longitude, selectedBusiness.address);
              }}
            >
              Open in Maps
            </Button>
          </div>
          
          {selectedBusiness.address && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-600" />
                <span className="text-neutral-600">{selectedBusiness.address}</span>
              </div>
            </div>
          )}
          
          {selectedBusiness.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-violet-600" />
              <span className="text-neutral-600">{selectedBusiness.phone}</span>
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
            <span>Coordinates:</span>
            <span className="font-mono">
              {selectedBusiness.latitude.toFixed(6)}, {selectedBusiness.longitude.toFixed(6)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}