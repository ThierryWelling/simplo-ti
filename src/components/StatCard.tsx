"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatCard({ title, value, icon, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <p className="mt-1 text-3xl font-semibold text-primary">{value}</p>
        </div>
        {icon && <div className="text-primary text-2xl">{icon}</div>}
      </div>
    </div>
  );
} 