"use client";

import { getPrioridadeBadgeClass } from '@/utils/helpers';

interface PriorityBadgeProps {
  priority: string;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span 
      className={`
        px-4 py-2 
        text-sm 
        font-semibold 
        rounded-full 
        ${getPrioridadeBadgeClass(priority)}
        transition-all 
        duration-300 
        ease-in-out
        hover:scale-105
        hover:shadow-xl
        backdrop-blur-sm
      `}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
} 