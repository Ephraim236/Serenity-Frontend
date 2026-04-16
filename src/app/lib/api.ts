/**
 * Centralized API utilities
 * Provides consistent API URL resolution, fetch wrappers with timeout,
 * and image upload helpers with progress tracking.
 */

// Get backend API URL based on environment
export const getApiUrl = (): string => {
  if (typeof window === 'undefined') {
    // During SSR or Node context, use production URL
    return 'https://serenity-gamma-two.vercel.app';
  }
  
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://serenity-gamma-two.vercel.app';
};

// Fetch with timeout and abort support
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'include' as RequestCredentials, // for cookies if needed
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Safe auth token retrieval
export const getAuthTokenSafe = (): string | null => {
  // Try both storage keys
  return localStorage.getItem('serenity_auth_token') || 
         localStorage.getItem('serenity_auth_user');
};

// NEW: XMLHttpRequest-based upload with progress
export const uploadImageWithProgress = (
  file: File,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal
): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
    const token = getAuthTokenSafe();
    if (!token) {
      reject(new Error('Authentication required'));
      return;
    }

    const xhr = new XMLHttpRequest();
    const apiUrl = getApiUrl();
    
    // Progress tracking
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    // Response handling
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (e) {
          reject(new Error('Invalid server response'));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error || 'Upload failed'));
        } catch {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      }
    });

    // Error & timeout handling
    xhr.addEventListener('error', () => reject(new Error('Network error')));
    xhr.addEventListener('timeout', () => reject(new Error('Upload timeout')));
    
    if (signal) {
      signal.addEventListener('abort', () => xhr.abort());
    }

    xhr.timeout = 60000; // 60 second timeout
    xhr.open('POST', `${apiUrl}/api/upload/image`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(file);
  });
};

// Multiple image upload
export const uploadMultipleImages = async (
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<{ url: string }[]> => {
  const token = getAuthTokenSafe();
  if (!token) throw new Error('Authentication required');
  
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  
  const response = await fetchWithTimeout(`${getApiUrl()}/api/upload/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }
  
  const data = await response.json();
  onProgress?.(files.length, files.length);
  return data.images;
};

// Normalized image URL: converts relative to absolute for frontend display
export const normalizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Relative path from backend
  if (url.startsWith('/uploads/')) {
    return `${getApiUrl()}${url}`;
  }
  
  // Data URL (base64) - return as-is
  if (url.startsWith('data:')) {
    return url;
  }
  
  // Unknown format - return as-is
  return url;
};

// API helper class for organized calls
export const api = {
  get(url: string, options?: RequestInit) {
    const token = getAuthTokenSafe();
    return fetchWithTimeout(`${getApiUrl()}${url}`, {
      ...options,
      headers: {
        ...options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
  },
  
  post(url: string, data: any, options?: RequestInit) {
    const token = getAuthTokenSafe();
    return fetchWithTimeout(`${getApiUrl()}${url}`, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
  },
  
  put(url: string, data: any, options?: RequestInit) {
    const token = getAuthTokenSafe();
    return fetchWithTimeout(`${getApiUrl()}${url}`, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
  },
  
  delete(url: string, options?: RequestInit) {
    const token = getAuthTokenSafe();
    return fetchWithTimeout(`${getApiUrl()}${url}`, {
      ...options,
      method: 'DELETE',
      headers: {
        ...options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
  }
};
