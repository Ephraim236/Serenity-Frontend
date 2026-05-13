import { MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/button';

interface StaticMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  businessName?: string;
  apiKey: string;
  className?: string;
}

// Generate Google Maps URL for directions
const getDirectionsUrl = (latitude: number, longitude: number, address?: string) => {
  const params = new URLSearchParams({
    api: '1',
    destination: address || `${latitude},${longitude}`
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
};

// Generate Google Static Maps URL
const getStaticMapUrl = (latitude: number, longitude: number, apiKey: string) => {
  const params = new URLSearchParams({
    center: `${latitude},${longitude}`,
    zoom: '15',
    size: '600x300',
    markers: `color:red%7C${latitude},${longitude}`,
    key: apiKey
  });
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
};

export function StaticMap({
  latitude = 5.6037,
  longitude = -0.1870,
  address,
  businessName,
  apiKey,
  className = ''
}: StaticMapProps) {
  const directionsUrl = getDirectionsUrl(latitude, longitude, address);
  const mapImageUrl = apiKey ? getStaticMapUrl(latitude, longitude, apiKey) : null;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm ${className}`}>
      {/* Map Image */}
      {mapImageUrl ? (
        <div className="relative h-64 w-full">
          <img
            src={mapImageUrl}
            alt="Business location"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Show fallback if the static map fails (e.g., invalid API key)
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>
      ) : (
        <div className="h-64 bg-neutral-100 flex items-center justify-center">
          <div className="text-center text-neutral-500">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Location pin</p>
            <p className="text-xs mt-1">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          </div>
        </div>
      )}

      {/* Location Info */}
      <div className="p-4">
        {businessName && (
          <h3 className="font-bold text-lg text-neutral-900 mb-2">{businessName}</h3>
        )}

        {address && (
          <div className="flex items-start gap-2 text-neutral-600 mb-4">
            <MapPin className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <p className="text-sm">{address}</p>
          </div>
        )}

        {/* Get Directions Button */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl gap-2"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </Button>
        </a>
      </div>
    </div>
  );
}
