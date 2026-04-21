import * as React from "react";

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  color?: string;
}

export const Progress = ({ value, className = "", color = "bg-blue-600" }: ProgressProps) => {
  return (
    <div className={`w-full bg-gray-100 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div
        className={`${color} h-full transition-all duration-500 ease-out`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};