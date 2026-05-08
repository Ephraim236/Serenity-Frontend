import { Star, StarHalf } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showValue?: boolean;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 16, 
  showValue = false,
  onRate,
  interactive = false,
  className = ""
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const fullStars = Math.floor(hoverRating || rating);
  const hasHalfStar = (hoverRating || rating) % 1 >= 0.5;

  const handleClick = (starIndex: number) => {
    if (interactive && onRate) {
      onRate(starIndex);
    }
  };

  const handleMouseEnter = (starIndex: number) => {
    if (interactive) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          let starContent: React.ReactNode;

          if (starValue <= fullStars) {
            starContent = <Star className="fill-amber-400 text-amber-400" size={size} />;
          } else if (starValue === fullStars + 1 && hasHalfStar) {
            starContent = <StarHalf className="fill-amber-400 text-amber-400" size={size} />;
          } else {
            starContent = <Star className="text-neutral-300 dark:text-neutral-600" size={size} />;
          }

          return (
            <span
              key={index}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
            >
              {starContent}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}