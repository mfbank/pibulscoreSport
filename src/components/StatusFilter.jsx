import React from 'react';
import { Clock, Play, CheckCircle } from 'lucide-react';

export default function StatusFilter({ selectedStatus, onStatusChange }) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onStatusChange('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedStatus === 'all'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <CheckCircle className="h-4 w-4" />
        ทั้งหมด
      </button>
      
      <button
        onClick={() => onStatusChange('upcoming')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedStatus === 'upcoming'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Clock className="h-4 w-4" />
        กำลังจะแข่ง
      </button>
      
      <button
        onClick={() => onStatusChange('live')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedStatus === 'live'
            ? 'bg-red-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Play className="h-4 w-4" />
        กำลังแข่ง
      </button>
      
      <button
        onClick={() => onStatusChange('finished')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedStatus === 'finished'
            ? 'bg-gray-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <CheckCircle className="h-4 w-4" />
        จบแล้ว
      </button>
    </div>
  );
}