// Google Maps type declarations
// These are provided by @types/google.maps package

declare namespace google.maps {
  namespace maps {
    class Map {}
    class MapOptions {}
    class MapMouseEvent {
      latLng: google.maps.LatLng | null;
    }
    class LatLng {
      lat(): number;
      lng(): number;
    }
    class Marker {}
    class MarkerOptions {}
    class Geocoder {
      geocode(request: { location: { lat: number; lng: number } }, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
    }
    interface GeocoderResult {
      formatted_address: string;
    }
    type GeocoderStatus = 'OK' | 'ZERO_RESULTS' | string;
  }
}

// LoadScript and related components from @react-google-maps/api
declare module '@react-google-maps/api' {
  import { Component } from 'react';
  export const LoadScript: any;
  export const GoogleMap: any;
  export const Marker: any;
  export const useLoadScript: any;
}
