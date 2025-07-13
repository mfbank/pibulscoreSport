const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiService = {
  async getAllMatches() {
    try {
      const response = await fetch(`${API_BASE_URL}/matches`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      return await response.json();
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  },

  async getMatchesBySport(sport) {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${sport}`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      return await response.json();
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  },

  async updateScore(matchId, teamAScore, teamBScore) {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${matchId}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamA: teamAScore,
          teamB: teamBScore,
        }),
      });
      if (!response.ok) throw new Error('Failed to update score');
      return await response.json();
    } catch (error) {
      console.error('Error updating score:', error);
      throw error;
    }
  },

  async updateStatus(matchId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${matchId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return await response.json();
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },
};