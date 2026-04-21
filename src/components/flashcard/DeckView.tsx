import React from 'react';
import { BookOpen } from 'lucide-react';

interface DeckViewProps {
  title: string;
  count: number;
  due: number;
}

export const DeckView = ({ title, count, due }: DeckViewProps) => {
  return (
    <div className="relative group">
      {/* Decorative stacked card effect */}
      <div className="absolute inset-0 bg-white border border-gray-100 rounded-[24px] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300"></div>
      
      <div className="relative bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
          <BookOpen className="text-blue-600 group-hover:text-white transition-colors" size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{title}</h3>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase">Total</span>
            <span className="text-lg font-bold text-gray-700">{count}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase">Due</span>
            <span className="text-lg font-bold text-orange-500">{due}</span>
          </div>
        </div>
      </div>
    </div>
  );
};