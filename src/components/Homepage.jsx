import React, { useState, useEffect } from 'react';
import { Trophy, Wifi, WifiOff } from 'lucide-react';
import MatchCard from './MatchCard';
import SportTabs from './SportTabs';
import GenderFilter from './GenderFilter';
import StatusFilter from './StatusFilter';
import socketService from '../utils/socket';
import { apiService } from '../utils/api';

export default function Homepage() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const sports = ['football', 'basketball', 'volleyball', 'petanque'];

  useEffect(() => {
    // Initialize socket connection
    socketService.connect();
    
    // Set up socket event listeners
    socketService.on('match-data', (data) => {
      setMatches(data);
      setLoading(false);
      setIsConnected(true);
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

    // Fallback to API if socket fails
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

    // Fetch initial data
    fetchMatches();

    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    let filtered = matches;

    if (selectedSport !== 'all') {
      filtered = filtered.filter(match => match.sport === selectedSport);
    }

    if (selectedGender !== 'all') {
      filtered = filtered.filter(match => match.gender === selectedGender);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(match => match.status === selectedStatus);
    }

    setFilteredMatches(filtered);
  }, [matches, selectedSport, selectedGender, selectedStatus]);

  const liveMatches = filteredMatches.filter(match => match.status === 'live');
  const otherMatches = filteredMatches.filter(match => match.status !== 'live');

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
    <div className="min-h-screen bg-gradient-to-r from-green-500 via-white to-red-500">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 via-white to-red-500 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Pibul Live Score - กีฬาภายในโรงเรียน
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm text-gray-600">
                {isConnected ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ'}
              </span>
            </div>
          </div>
        </div>
      </header>

      
      {/* Banner Section */}
      <div className="relative">
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-200 overflow-hidden">
          {/* Replace the src below with your banner image URL */}
         <img 
             src="/images/image.png"
            alt="กีฬาสี 2568 Banner" 
             className="w-full h-full object-cover"
          />

          {/* Optional overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Optional banner text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                ยินดีต้อนรับสู่กีฬาภายในโรงเรียน ประจำปี2568
              </h3>
              <p className="text-lg md:text-xl drop-shadow-lg">
                
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <SportTabs
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
            sports={sports}
          />
          
          <div className="flex flex-wrap gap-4">
            <GenderFilter
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
            />
            <StatusFilter
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>
        </div>

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              การแข่งขันที่กำลังดำเนินอยู่
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {liveMatches.map((match) => (
                <MatchCard key={match.matchId} match={match} isLive={true} />
              ))}
            </div>
          </div>
        )}

        {/* Other Matches */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            การแข่งขันทั้งหมด
          </h3>
          {otherMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {otherMatches.map((match) => (
                <MatchCard key={match.matchId} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">ไม่มีการแข่งขันที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}