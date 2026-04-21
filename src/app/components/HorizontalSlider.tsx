import { useRef, ReactNode, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";

interface HorizontalSliderProps {
  children: ReactNode[];
  itemsPerPageMobile?: number;
  itemsPerPageDesktop?: number;
  className?: string;
}

export function HorizontalSlider({ 
  children, 
  itemsPerPageMobile = 1,
  itemsPerPageDesktop = 3,
  className = "" 
}: HorizontalSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Fix #1: SSR safe - only use window after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const scroll = (direction: "left" | "right") => {
    // Fix #2: Safe null checks for all property access
    if (containerRef?.current) {
      const container = containerRef.current;
      const itemsPerPage = isClient && window?.innerWidth < 768 
        ? itemsPerPageMobile 
        : itemsPerPageDesktop;
      
      // Safely access clientWidth with optional chaining
      const itemWidth = container?.clientWidth ? container.clientWidth / itemsPerPage : 0;
      
      container.scrollBy({
        left: direction === "right" ? itemWidth : -itemWidth,
        behavior: "smooth"
      });
    }
  };

  // Fix #3: Safe window access for width calculation
  const itemsPerPage = isClient && window?.innerWidth < 768 
    ? itemsPerPageMobile 
    : itemsPerPageDesktop;

  return (
    <div className={`relative group ${className}`}>
      {/* Left Arrow */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* Slider Container */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-start"
            style={{ 
              width: isClient ? `calc(${100 / itemsPerPage}% - ${itemsPerPage - 1} * 1rem)` : "100%"
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Right Arrow (for mobile) */}
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg md:hidden"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}