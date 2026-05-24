import { useState, useCallback } from 'react';

interface UploadedImage {
  url: string;
  publicId?: string;
  filename: string;
  size: number;
  provider: 'cloudinary' | 'base64';
}

interface UseImageUploadOptions {
  maxFiles?: number;
  maxFileSize?: number;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const uploadImage = useCallback(
    async (file: File, multiple: boolean = false): Promise<UploadedImage[]> => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      setIsLoading(true);
      setError('');

      try {
        const formData = new FormData();
        formData.append(multiple ? 'images' : 'image', file);

        const endpoint = multiple ? '/api/upload/images' : '/api/upload/image';
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${endpoint}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          }
        );

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        const uploadedImages = multiple ? data.images : [data];

        setImages((prev) => [...prev, ...uploadedImages]);
        return uploadedImages;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to upload image';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteImage = useCallback(async (publicId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/upload/image/${publicId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setImages((prev) => prev.filter((img) => img.publicId !== publicId));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete image';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setError('');
  }, []);

  return {
    images,
    isLoading,
    error,
    uploadImage,
    deleteImage,
    clearImages,
    setImages
  };
};
