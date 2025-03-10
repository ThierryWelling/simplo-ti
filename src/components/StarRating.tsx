"use client";

import { useState } from 'react';

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
  initialRating = 0,
  totalStars = 5,
  onChange,
  readOnly = false,
  size = 'md',
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index: number) => {
    if (readOnly) return;
    
    const newRating = index + 1;
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xl';
      case 'lg':
        return 'text-3xl';
      case 'md':
      default:
        return 'text-2xl';
    }
  };

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isActive = (hoverRating || rating) >= starValue;
        
        return (
          <span
            key={index}
            className={`${getSizeClass()} cursor-pointer ${
              isActive ? 'text-yellow-400' : 'text-gray-300'
            } ${readOnly ? 'cursor-default' : 'hover:text-yellow-400'}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            ★
          </span>
        );
      })}
    </div>
  );
} 