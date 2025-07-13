import React, { useState, useEffect } from 'react';
import { Settings, Plus, Minus, Play, Pause, CheckCircle, Clock } from 'lucide-react';
import { apiService } from '../utils/api';
import socketService from '../utils/socket';

const statusIcons = {
  upcoming: Clock,
  live: Play,
  finished: CheckCircle,
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

export default function AdminPanel() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    socketService.connect();
    
    // Set up socket event listeners
    socketService.on('match-data', (data) => {
      setMatches(data);
      setLoading(false);
    });

    socketService.on('score-updated', (updatedMatch) => {
      setMatches(prev => prev.map(match => 
        match.matchId === updatedMatch.matchId ? updatedMatch : match
      ));
    });

    socketService.on('status-changed', (updatedMatch) => {
      setMatches(prev => prev.map(match => 
        match.matchId === updatedMatch.matchId ? updatedMatch : match
      ));
    });

    // Fetch initial data
    fetchMatches();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await apiService.getAllMatches();
      setMatches(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      setLoading(false);
    }
  };

  const updateScore = async (matchId, team, increment) => {
    const match = matches.find(m => m.matchId === matchId);
    if (!match) return;

    setUpdating(`${matchId}-${team}`);
    
    try {
      const newTeamAScore = team === 'A' ? 
        Math.max(0, match.teamA.score + increment) : 
        match.teamA.score;
      const newTeamBScore = team === 'B' ? 
        Math.max(0, match.teamB.score + increment) : 
        match.teamB.score;

      await apiService.updateScore(matchId, newTeamAScore, newTeamBScore);
    } catch (error) {
      console.error('Failed to update score:', error);
    } finally {
      setUpdating(null);
    }
  };

  const updateStatus = async (matchId, newStatus) => {
    setUpdating(`${matchId}-status`);
    
    try {
      await apiService.updateStatus(matchId, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusCycle = ['upcoming', 'live', 'finished'];
    const currentIndex = statusCycle.indexOf(currentStatus);
    return statusCycle[(currentIndex + 1) % statusCycle.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Admin Panel - จัดการคะแนน
              </h1>
            </div>
            <a
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ดูหน้าหลัก
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match) => {
            const StatusIcon = statusIcons[match.status];
            
            return (
              <div key={match.matchId} className="bg-white rounded-lg shadow-md p-6">
                {/* Match Info */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {match.sport.charAt(0).toUpperCase() + match.sport.slice(1)} - {match.gender === 'male' ? 'ชาย' : 'หญิง'}
                    </h3>
                    <p className="text-sm text-gray-600">{match.round} • {match.time} น.</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[match.status]}`}>
                    {statusText[match.status]}
                  </span>
                </div>

                {/* Teams and Score Controls */}
                <div className="space-y-4">
                  {/* Team A */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-${match.teamA.color}-500 flex items-center justify-center text-white font-bold text-sm`}>
                        {match.teamA.number}
                      </div>
                      <div>
                        <div className="font-medium">{match.teamA.name}</div>
                        <div className="text-sm text-gray-600">{match.teamA.color}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateScore(match.matchId, 'A', -1)}
                        disabled={updating === `${match.matchId}-A` || match.teamA.score <= 0}
                        className="w-12 h-12 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      
                      <div className="w-16 text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {match.teamA.score}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => updateScore(match.matchId, 'A', 1)}
                        disabled={updating === `${match.matchId}-A`}
                        className="w-12 h-12 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-${match.teamB.color}-500 flex items-center justify-center text-white font-bold text-sm`}>
                        {match.teamB.number}
                      </div>
                      <div>
                        <div className="font-medium">{match.teamB.name}</div>
                        <div className="text-sm text-gray-600">{match.teamB.color}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateScore(match.matchId, 'B', -1)}
                        disabled={updating === `${match.matchId}-B` || match.teamB.score <= 0}
                        className="w-12 h-12 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      
                      <div className="w-16 text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {match.teamB.score}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => updateScore(match.matchId, 'B', 1)}
                        disabled={updating === `${match.matchId}-B`}
                        className="w-12 h-12 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Control */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => updateStatus(match.matchId, getNextStatus(match.status))}
                    disabled={updating === `${match.matchId}-status`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <StatusIcon className="h-5 w-5" />
                    เปลี่ยนสถานะ → {statusText[getNextStatus(match.status)]}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}