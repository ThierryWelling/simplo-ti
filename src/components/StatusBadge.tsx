"use client";

import { getStatusBadgeClass, getStatusText } from '@/utils/helpers';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span 
      className={`
        px-4 py-2 
        text-sm 
        font-semibold 
        rounded-full 
        ${getStatusBadgeClass(status)}
        transition-all 
        duration-300 
        ease-in-out
        hover:scale-105
        hover:shadow-xl
        backdrop-blur-sm
      `}
    >
      {getStatusText(status)}
    </span>
  );
} 