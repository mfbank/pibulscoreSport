import React from 'react';
import { Users, UserCheck } from 'lucide-react';

export default function GenderFilter({ selectedGender, onGenderChange }) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onGenderChange('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedGender === 'all'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Users className="h-4 w-4" />
        ทั้งหมด
      </button>
      
      <button
        onClick={() => onGenderChange('male')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedGender === 'male'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <UserCheck className="h-4 w-4" />
        ชาย
      </button>
      
      <button
        onClick={() => onGenderChange('female')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedGender === 'female'
            ? 'bg-pink-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <UserCheck className="h-4 w-4" />
        หญิง
      </button>
    </div>
  );
}