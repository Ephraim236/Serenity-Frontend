import { useRef, ReactNode } from "react";
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

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemWidth = container.clientWidth / 
        (window.innerWidth < 768 ? itemsPerPageMobile : itemsPerPageDesktop);
      
      container.scrollBy({
        left: direction === "right" ? itemWidth : -itemWidth,
        behavior: "smooth"
      });
    }
  };

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
              width: `calc(${100 / (window.innerWidth < 768 ? itemsPerPageMobile : itemsPerPageDesktop)}% - ${(window.innerWidth < 768 ? itemsPerPageMobile : itemsPerPageDesktop) - 1} * 1rem)` 
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
