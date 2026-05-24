import React, { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string, publicId?: string) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  multiple = false,
  maxFiles = 1,
  maxFileSize = 5 * 1024 * 1024 // 5MB
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem('token');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Validate file count
    if (files.length > maxFiles) {
      const err = `Maximum ${maxFiles} file(s) allowed`;
      setError(err);
      onUploadError?.(err);
      return;
    }

    // Validate file sizes
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxFileSize) {
        const err = `File size exceeds ${maxFileSize / 1024 / 1024}MB limit`;
        setError(err);
        onUploadError?.(err);
        return;
      }
    }

    // Create previews
    const previews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          previews.push(event.target.result as string);
          if (previews.length === files.length) {
            setPreview(previews);
          }
        }
      };
      reader.readAsDataURL(files[i]);
    }

    setError('');
    await uploadFiles(files);
  };

  const uploadFiles = async (files: FileList) => {
    if (!token) {
      const err = 'Authentication required';
      setError(err);
      onUploadError?.(err);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    try {
      if (multiple) {
        // Upload multiple images
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/upload/images`,
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
        data.images?.forEach((img: any) => {
          onUploadSuccess(img.url, img.publicId);
        });
      } else {
        // Upload single image
        formData.append('image', files[0]);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/upload/image`,
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
        onUploadSuccess(data.url, data.publicId);
      }

      setError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setPreview([]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMsg);
      onUploadError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const clearPreview = () => {
    setPreview([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple={multiple}
          disabled={isLoading}
          className="hidden"
          aria-label="Upload image"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Click to upload images</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {preview.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {preview.map((src, index) => (
              <div key={index} className="relative group">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={clearPreview}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {!isLoading && (
            <button
              onClick={clearPreview}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Clear previews
            </button>
          )}
        </div>
      )}
    </div>
  );
};
