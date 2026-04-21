import React from 'react';

export const CardShell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};