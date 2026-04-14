import React, { useState, useEffect, useRef } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeleton?: boolean;
  blurDataURL?: string;
  placeholder?: 'skeleton' | 'blur' | 'none';
}

export function ImageWithFallback(props: LazyImageProps) {
  const [didError, setDidError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  
  const { 
    src, 
    alt, 
    style, 
    className, 
    placeholder = 'skeleton',
    loading = 'lazy',
    ...rest 
  } = props

  // Check if src is a base64 data URL (should load eagerly)
  const isBase64 = src && src.startsWith('data:');
  
  // For base64 images, load immediately; for URLs, use lazy loading
  const shouldLoadImmediately = isBase64 || loading === 'eager';

  // Handle error state - don't error on base64 images
  const handleError = () => {
    // Base64 images rarely fail, but if they do we still want to show them
    // Only set error for non-base64 images
    if (!isBase64) {
      setDidError(true)
    }
  }

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true)
  }

  // Intersection Observer for lazy loading (only for non-base64 images)
  useEffect(() => {
    if (shouldLoadImmediately) {
      setIsInView(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [shouldLoadImmediately])

  // Don't render image if errored
  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    )
  }

  // Show skeleton while loading
  const showSkeleton = placeholder === 'skeleton' && !isLoaded

  return (
    <div className="relative w-full h-full overflow-hidden" style={style}>
      {/* Skeleton placeholder */}
      {showSkeleton && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse ${className ?? ''}`}
          style={{ 
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}
      
      {/* Actual image - only load when in view (unless it's base64) */}
      <img
        ref={imgRef}
        src={isInView || shouldLoadImmediately ? src : undefined}
        alt={alt}
        className={`${className ?? ''} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={style}
        loading={shouldLoadImmediately ? 'eager' : 'lazy'}
        onError={handleError}
        onLoad={handleLoad}
        {...rest}
      />
      
      {/* Inline styles for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
