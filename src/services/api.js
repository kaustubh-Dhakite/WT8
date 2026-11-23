const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// API client functions
export const api = {
  // Authentication
  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async logout() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email: user.email, name: user.name })
      });
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Users
  async getUserProfile() {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async updateUserProfile(data) {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Games
  async getGames() {
    const res = await fetch(`${API_BASE_URL}/games`);
    return res.json();
  },

  // Questions
  async getQuestions(gameTitle) {
    const url = gameTitle
      ? `${API_BASE_URL}/questions?gameTitle=${encodeURIComponent(gameTitle)}`
      : `${API_BASE_URL}/questions`;
    const res = await fetch(url);
    return res.json();
  },

  async createQuestion(questionData) {
    const res = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData)
    });
    return res.json();
  },

  async deleteQuestion(id) {
    const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Game Records (Save game results)
  async saveGameRecord(recordData) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const payload = {
      ...recordData,
      userEmail: user.email || 'guest@littlelearners.com',
      userName: user.name || 'Little Explorer'
    };

    const res = await fetch(`${API_BASE_URL}/gamerecords`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getMyHistory() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const res = await fetch(`${API_BASE_URL}/gamerecords/my-history?email=${encodeURIComponent(user.email || '')}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Game Stats
  async getGameStats() {
    const res = await fetch(`${API_BASE_URL}/gamestats`);
    return res.json();
  },

  async getPlatformOverview() {
    const res = await fetch(`${API_BASE_URL}/gamestats/overview`);
    return res.json();
  },

  // Achievements
  async getAllAchievements() {
    const res = await fetch(`${API_BASE_URL}/achievements`);
    return res.json();
  },

  async getMyAchievements() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const res = await fetch(`${API_BASE_URL}/achievements/my?email=${encodeURIComponent(user.email || '')}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Rankings
  async getRankings() {
    const res = await fetch(`${API_BASE_URL}/rankings`);
    return res.json();
  },

  // Feedback
  async getFeedback() {
    const res = await fetch(`${API_BASE_URL}/feedback`);
    return res.json();
  },

  async submitFeedback(feedbackData) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const payload = {
      ...feedbackData,
      userEmail: user.email || feedbackData.userEmail || 'guest@littlelearners.com',
      userName: user.name || feedbackData.userName || 'Parent / Learner'
    };

    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async deleteFeedback(id) {
    const res = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const res = await fetch(`${API_BASE_URL}/notifications?email=${encodeURIComponent(user.email || '')}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // Streaks
  async getMyStreak() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const res = await fetch(`${API_BASE_URL}/streaks/my?email=${encodeURIComponent(user.email || '')}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};

// Text-to-speech utility for toddler pronunciation
export const speakWord = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // slightly slower for young children
    utterance.pitch = 1.1; // friendly tone
    window.speechSynthesis.speak(utterance);
  }
};
