import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Scissors } from "lucide-react";

interface PreloadScreenProps {
  children: React.ReactNode;
  images?: string[];
}

// Common images to preload across the app
const COMMON_IMAGES = [
  "/Serenity Pics/young-african-american-man-visiting-barbershop.jpg",
  "/Serenity Pics/african-american-man-guy-sitting-chair-barber-works-with-beard (1).jpg",
  "/Serenity Pics/man-woman-doing-beauty-treatment-home.jpg",
  "/Serenity Pics/medium-shot-man-living-as-digital-nomad.jpg",
  "/Serenity Pics/stylist-woman-taking-care-her-client-afro-hair.jpg",
  "/Serenity Pics/woman-getting-her-hair-done-salon.jpg",
];

export function PreloadScreen({ children, images = COMMON_IMAGES }: PreloadScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);

  const totalImages = images.length;

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        setLoadedCount((prev) => prev + 1);
        resolve();
      };
      img.onerror = () => {
        // Even if image fails, count it as loaded to prevent hanging
        setLoadedCount((prev) => prev + 1);
        resolve();
      };
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const preloadAllImages = async () => {
      // Start with 10% progress for initial setup
      setProgress(10);
      
      // Small delay for smooth animation
      await new Promise(resolve => setTimeout(resolve, 300));

      // Preload all images
      for (let i = 0; i < images.length; i++) {
        await preloadImage(images[i]);
        // Calculate progress: 10% to 90% based on images loaded
        const imageProgress = Math.round(((i + 1) / totalImages) * 80);
        setProgress(10 + imageProgress);
      }

      // Final 10% for completing initialization
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(100);

      // Brief delay to show 100% before transitioning out
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsLoading(false);
    };

    preloadAllImages();
  }, [images, preloadImage, totalImages]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-violet-800"
          >
            <div className="text-center">
              {/* Logo Animation */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Scissors className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Serenity
                </h1>
              </motion.div>

              {/* Progress Bar */}
              <div className="w-64 mx-auto mb-4">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              {/* Progress Text */}
              <motion.p
                key={progress}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/80 text-lg font-medium"
              >
                {progress < 100 ? `Loading... ${progress}%` : "Ready!"}
              </motion.p>

              {/* Loading Tips */}
              {progress < 50 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="text-white/50 text-sm mt-4"
                >
                  Preparing your experience...
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        {children}
      </div>
    </>
  );
}
