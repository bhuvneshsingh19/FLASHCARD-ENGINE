import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'orange' | 'green' | 'red' | 'gray';
}

export const Badge = ({ children, variant = 'gray' }: BadgeProps) => {
  const styles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
    gray: "bg-gray-50 text-gray-700 border-gray-100",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[variant]}`}>
      {children}
    </span>
  );
};