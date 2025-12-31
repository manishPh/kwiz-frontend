import axios, { AxiosError } from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL: string = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const QUIZ_API_URL: string = `${API_BASE_URL}/api/quiz`;

const api = axios.create({
  baseURL: QUIZ_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type definitions for API responses and requests

export interface Question {
  id: number;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  order: number;
  options: string[];
}

export interface NextQuizInfo {
  date: string;
  title: string;
  category: string;
  time_until_release: number;
}

export interface DailyQuiz {
  date: string;
  title: string;
  description: string;
  category_name: string;
  questions: Question[];
  time_until_release?: number;
  next_quiz?: NextQuizInfo | null;
}

export interface QuizNotAvailableResponse {
  error: string;
  quiz_date: string;
  quiz_title: string;
  time_until_release: number;
  next_quiz: NextQuizInfo | null;
  message: string;
}

export interface QuizAnswer {
  question_id: string | number;
  selected_option: string;
}

export interface QuizSubmission {
  date: string;
  answers: QuizAnswer[];
}

export interface QuestionResult {
  question_id: number;
  question_text: string;
  selected_option: string;
  correct_answer: string;
  is_correct: boolean;
}

export interface QuizSubmissionResponse {
  score: number;
  total: number;
  percentage: number;
  results: QuestionResult[];
  share_text: string;
}

export interface ArchiveQuiz {
  date: string;
  title: string;
  description: string;
  category_name: string;
  is_available: boolean;
}

export interface QuizStatus {
  quiz_date: string;
  quiz_title: string;
  category: string;
  is_available: boolean;
  time_until_release: number;
  next_quiz: NextQuizInfo | null;
  release_time: string;
  error?: string;
}

export interface APIError {
  error: string;
  [key: string]: any;
}

// API service object
export const quizAPI = {
  // Get daily quiz for a specific date
  getDailyQuiz: async (date: string): Promise<DailyQuiz> => {
    try {
      const response = await api.get<DailyQuiz>(`/daily/${date}/`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Submit quiz answers
  submitQuiz: async (quizData: QuizSubmission): Promise<QuizSubmissionResponse> => {
    try {
      const response = await api.post<QuizSubmissionResponse>('/submit/', quizData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get quiz archive
  getArchive: async (): Promise<ArchiveQuiz[]> => {
    try {
      const response = await api.get<ArchiveQuiz[]>('/archive/');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get quiz status and timer information
  getQuizStatus: async (date: string | null = null): Promise<QuizStatus> => {
    try {
      const url = date ? `/status/${date}/` : '/status/';
      const response = await api.get<QuizStatus>(url);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      throw axiosError.response?.data || axiosError.message;
    }
  },
};

export default quizAPI;

