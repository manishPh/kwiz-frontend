import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const QUIZ_API_URL = `${API_BASE_URL}/api/quiz`;

const api = axios.create({
  baseURL: QUIZ_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizAPI = {
  // Get daily quiz for a specific date
  getDailyQuiz: async (date) => {
    try {
      const response = await api.get(`/daily/${date}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Submit quiz answers
  submitQuiz: async (quizData) => {
    try {
      const response = await api.post('/submit/', quizData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get quiz archive
  getArchive: async () => {
    try {
      const response = await api.get('/archive/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get quiz status and timer information
  getQuizStatus: async (date = null) => {
    try {
      const url = date ? `/status/${date}/` : '/status/';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default quizAPI;
