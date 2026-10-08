import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, reviewsCount = null, size = 'sm', showScore = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= fullStars;
          const isHalf = !isFilled && starIndex === fullStars + 1 && hasHalfStar;

          return (
            <span key={starIndex} className="relative inline-block">
              {isFilled ? (
                <Star className={`${starSize} fill-amber-400 text-amber-400`} />
              ) : isHalf ? (
                <div className="relative">
                  <Star className={`${starSize} text-neutral-300`} />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className={`${starSize} fill-amber-400 text-amber-400`} />
                  </div>
                </div>
              ) : (
                <Star className={`${starSize} text-neutral-300`} />
              )}
            </span>
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs font-semibold text-neutral-800 ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}

      {reviewsCount !== null && (
        <span className="text-xs text-neutral-500">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
