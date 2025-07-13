import React from 'react';
import { Clock, Users } from 'lucide-react';

const teamColors = {
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  pink: 'bg-pink-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

const statusColors = {
  upcoming: 'bg-blue-100 text-blue-800',
  live: 'bg-red-100 text-red-800',
  finished: 'bg-gray-100 text-gray-800',
};

const statusText = {
  upcoming: 'กำลังจะแข่ง',
  live: 'กำลังแข่ง',
  finished: 'จบแล้ว',
};

export default function MatchCard({ match, isLive = false }) {
  const { teamA, teamB, time, date, status, round, sport, gender } = match;

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 transition-all duration-300 hover:shadow-lg ${
      status === 'live' ? 'border-red-500 animate-pulse' : 'border-gray-300'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">
            {sport.charAt(0).toUpperCase() + sport.slice(1)} - {gender === 'male' ? 'ชาย' : 'หญิง'}
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusText[status]}
        </span>
      </div>

      {/* Round and Time */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">{round} • {time} น.</span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between">
        {/* Team A */}
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-8 h-8 rounded-full ${teamColors[teamA.color]} flex items-center justify-center text-white font-bold text-sm`}>
            {teamA.number}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{teamA.name}</div>
            <div className="text-sm text-gray-600">{teamA.color}</div>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4 px-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${status === 'live' ? 'text-red-600' : 'text-gray-900'}`}>
              {teamA.score}
            </div>
          </div>
          <div className="text-gray-400 font-medium">VS</div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${status === 'live' ? 'text-red-600' : 'text-gray-900'}`}>
              {teamB.score}
            </div>
          </div>
        </div>

        {/* Team B */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="flex-1 text-right">
            <div className="font-medium text-gray-900">{teamB.name}</div>
            <div className="text-sm text-gray-600">{teamB.color}</div>
          </div>
          <div className={`w-8 h-8 rounded-full ${teamColors[teamB.color]} flex items-center justify-center text-white font-bold text-sm`}>
            {teamB.number}
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-500 text-center">{date}</div>
      </div>
    </div>
  );
}