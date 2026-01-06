/**
 * Centralized share text generation utility
 * All share text formatting logic lives here
 */

import { DOMAIN, SCORE_EMOJI, SCORE_THRESHOLDS } from '../constants';

export interface ShareTextData {
  score: number;
  total: number;
  percentage: number;
  quiz_date: string;
  quiz_title?: string;
}

/**
 * Get the appropriate emoji based on score percentage
 */
export function getScoreEmoji(percentage: number): string {
  if (percentage >= SCORE_THRESHOLDS.EXCELLENT) return SCORE_EMOJI.EXCELLENT;
  if (percentage >= SCORE_THRESHOLDS.GREAT) return SCORE_EMOJI.GREAT;
  if (percentage >= SCORE_THRESHOLDS.GOOD) return SCORE_EMOJI.GOOD;
  if (percentage >= SCORE_THRESHOLDS.OKAY) return SCORE_EMOJI.OKAY;
  return SCORE_EMOJI.TRY_AGAIN;
}

/**
 * Format date for share text (e.g., "06012026" from "2026-01-06")
 */
export function formatDateForShare(dateString: string): string {
  // Convert "2026-01-06" to "06012026"
  const [year, month, day] = dateString.split('-');
  return `${day}${month}${year}`;
}

/**
 * Generate share text for quiz results
 * This is the single source of truth for share text formatting
 */
export function generateShareText(data: ShareTextData): string {
  const emoji = getScoreEmoji(data.percentage);
  const formattedDate = formatDateForShare(data.quiz_date);
  const quizUrl = `${DOMAIN}/quiz/${data.quiz_date}`;
  
  // Use title if available, otherwise use date format
  const firstLine = data.quiz_title 
    ? `🎬 ${data.quiz_title} 🎬`
    : `🎬 Bollywood Kwiz #${formattedDate} 🎬`;
  
  return `${firstLine}
${emoji} ${data.score}/${data.total} (${data.percentage}%)

Can you beat my score? 🤔

Play now: ${quizUrl}`;
}

