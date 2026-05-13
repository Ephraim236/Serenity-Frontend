import { useRef, useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, useJsApiLoader, useLoadScript } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

interface MapPickerProps {
  apiKey: string;
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
}

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

const containerStyle = {
  width: '100%',
  borderRadius: '12px',
  border: '2px solid #e5e7eb'
};

const defaultCenter = {
  lat: 5.6037, // Ghana center
  lng: -0.1870
};

export function MapPicker({
  apiKey,
  latitude,
  longitude,
  onLocationSelect,
  height = '300px',
  className = ''
}: MapPickerProps) {
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // If no API key, show a fallback with coordinates input
  if (!apiKey) {
    return (
      <div className={`p-6 bg-neutral-100 rounded-lg border border-neutral-300 ${className}`} style={{ height }}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="font-bold text-neutral-700 mb-2">Map Picker Unavailable</h3>
          <p className="text-sm text-neutral-500 mb-4">
            To use the interactive map, add a Google Maps API key to your .env file.
          </p>
          <div className="text-xs text-neutral-400">
            Current coordinates:{' '}
            {latitude && longitude ? `${latitude}, ${longitude}` : 'Not set'}
          </div>
        </div>
      </div>
    );
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMap(map);

    if (latitude && longitude) {
      map.panTo({ lat: latitude, lng: longitude });
      map.setZoom(15);
    }
  }, [latitude, longitude]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setSelectedPosition({ lat, lng });
    onLocationSelect(lat, lng);

    // Add reverse geocoding to get address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        console.log('Selected address:', results[0].formatted_address);
      }
    });
  }, [onLocationSelect]);

  if (loadError) {
    return (
      <div className={`p-4 bg-red-50 text-red-600 rounded-lg ${className}`}>
        <p>Error loading Google Maps. Please check your API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-neutral-500">Loading map...</p>
        </div>
      </div>
    );
  }

  const center = selectedPosition || (latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter);

  return (
    <div className={`relative ${className}`}>
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height }}
        center={center}
        zoom={selectedPosition || (latitude && longitude) ? 15 : 8}
        onLoad={onMapLoad}
        onClick={onMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {selectedPosition && (
          <Marker
            position={selectedPosition}
            draggable
            onDragEnd={(e) => {
              const lat = e.latLng?.lat() || 0;
              const lng = e.latLng?.lng() || 0;
              setSelectedPosition({ lat, lng });
              onLocationSelect(lat, lng);
            }}
          />
        )}
      </GoogleMap>

      {selectedPosition && (
        <div className="absolute bottom-3 left-3 right-3 bg-white px-3 py-2 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="w-4 h-4 text-violet-600" />
            <span>
              {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
