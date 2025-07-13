import React from 'react';
import { Trophy, Target, Dumbbell, Zap } from 'lucide-react';

const sportIcons = {
  football: Trophy,
  basketball: Dumbbell,
  volleyball: Zap,
  petanque: Target,
};

const sportNames = {
  football: 'ฟุตบอล',
  basketball: 'บาสเกตบอล',
  volleyball: 'วอลเลย์บอล',
  petanque: 'เปตอง',
};

export default function SportTabs({ selectedSport, onSportChange, sports }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSportChange('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedSport === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Trophy className="h-4 w-4" />
        ทั้งหมด
      </button>
      
      {sports.map((sport) => {
        const Icon = sportIcons[sport];
        return (
          <button
            key={sport}
            onClick={() => onSportChange(sport)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedSport === sport
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {sportNames[sport]}
          </button>
        );
      })}
    </div>
  );
}