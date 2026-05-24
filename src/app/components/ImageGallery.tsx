import React from 'react';
import { Trash2, Loader } from 'lucide-react';

interface ImageGalleryProps {
  images: Array<{
    url: string;
    publicId?: string;
    filename: string;
  }>;
  onDelete?: (publicId?: string) => Promise<void>;
  isLoading?: boolean;
  editable?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onDelete,
  isLoading = false,
  editable = false
}) => {
  const [deletingId, setDeletingId] = React.useState<string>();

  const handleDelete = async (publicId?: string) => {
    if (!publicId || !onDelete) return;

    setDeletingId(publicId);
    try {
      await onDelete(publicId);
    } finally {
      setDeletingId(undefined);
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No images uploaded yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.publicId || image.url} className="relative group">
          <img
            src={image.url}
            alt={image.filename}
            className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
          />
          {editable && onDelete && (
            <button
              onClick={() => handleDelete(image.publicId)}
              disabled={isLoading || deletingId === image.publicId}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete image"
            >
              {deletingId === image.publicId ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          )}
          <p className="mt-1 text-xs text-gray-600 truncate">{image.filename}</p>
        </div>
      ))}
    </div>
  );
};
