import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  Check as SubmitIcon,
  ArrowBack as BackIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import { quizAPI } from '../services/api';
import { updateStatsAfterQuiz } from '../utils/statsManager';

function QuizPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const quizData = await quizAPI.getDailyQuiz(date);
      setQuiz(quizData);
      setError(null);
    } catch (err) {
      setError(err.error || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        question_id: questionId,
        selected_option: selectedOption
      }));

      const results = await quizAPI.submitQuiz({
        date: date,
        answers: formattedAnswers
      });

      // Mark quiz as completed for today and store results
      localStorage.setItem(`quiz_completed_${date}`, 'true');
      localStorage.setItem(`quiz_results_${date}`, JSON.stringify({
        score: results.score,
        total: results.total,
        percentage: results.percentage,
        completedAt: new Date().toISOString()
      }));

      // Update comprehensive stats
      const updatedStats = updateStatsAfterQuiz(results, date, quiz.category_name);
      console.log(`Marked quiz as completed for ${date} with score ${results.score}/${results.total}`);
      console.log('Updated stats:', updatedStats);

      // Navigate to results page with data
      navigate('/results', {
        state: {
          results,
          quiz,
          answers
        }
      });
    } catch (err) {
      setError(err.error || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <Alert severity="info">
        No questions available for this quiz.
      </Alert>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const allQuestionsAnswered = quiz.questions.every(q => answers[q.id]);

  return (
    <Box>
      {/* Quiz Header */}
      <Paper
        elevation={isMobile ? 1 : 2}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          borderRadius: { xs: 2, sm: 3 },
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          color: 'white'
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' },
            fontWeight: 600,
            mb: { xs: 1, sm: 2 }
          }}
        >
          {quiz.title}
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={{ xs: 1, sm: 2 }}
          mb={{ xs: 2, sm: 3 }}
        >
          <Chip
            label={quiz.category_name}
            color="primary"
            size={isMobile ? "small" : "medium"}
            icon={<QuizIcon />}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.875rem' },
              fontWeight: 500
            }}
          >
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: { xs: 6, sm: 8 },
            borderRadius: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: 'linear-gradient(90deg, #e91e63 0%, #ff9800 100%)'
            }
          }}
        />
      </Paper>

      {/* Question Card */}
      <Card
        elevation={isMobile ? 2 : 3}
        sx={{
          mb: { xs: 3, sm: 4 },
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          color: 'white'
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
              fontWeight: 600,
              lineHeight: 1.4,
              mb: { xs: 2, sm: 3 },
              color: 'white'
            }}
          >
            {question.text}
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              sx={{ gap: { xs: 0.5, sm: 1 } }}
            >
              {question.options.map((option, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    border: '2px solid',
                    borderColor: answers[question.id] === option ? 'primary.main' : 'grey.700',
                    borderRadius: 2,
                    mb: { xs: 1, sm: 1.5 },
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: answers[question.id] === option ? 'rgba(233, 30, 99, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      borderColor: 'primary.light',
                      backgroundColor: answers[question.id] === option ? 'rgba(233, 30, 99, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <FormControlLabel
                    value={option}
                    control={
                      <Radio
                        sx={{
                          ml: { xs: 1, sm: 2 },
                          '& .MuiSvgIcon-root': {
                            fontSize: { xs: '1.2rem', sm: '1.5rem' }
                          }
                        }}
                      />
                    }
                    label={option}
                    sx={{
                      width: '100%',
                      m: 0,
                      py: { xs: 1.5, sm: 2 },
                      pr: { xs: 2, sm: 3 },
                      '& .MuiFormControlLabel-label': {
                        fontSize: { xs: '0.95rem', sm: '1.1rem' },
                        fontWeight: 500,
                        lineHeight: 1.4,
                        flex: 1
                      }
                    }}
                  />
                </Paper>
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Paper
        elevation={isMobile ? 1 : 2}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: { xs: 2, sm: 3 },
          position: 'sticky',
          bottom: { xs: 16, sm: 24 },
          backgroundColor: 'background.paper',
          zIndex: 10
        }}
      >
        {/* Navigation Buttons */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            size={isMobile ? "medium" : "large"}
            sx={{
              minWidth: { xs: 80, sm: 120 },
              py: { xs: 1, sm: 1.5 },
              borderColor: '#e91e63',
              borderWidth: 2,
              color: '#e91e63',
              backgroundColor: 'rgba(233, 30, 99, 0.1)',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#ff9800',
                borderWidth: 2,
                color: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.4)'
              },
              '&:disabled': {
                borderColor: 'grey.700',
                color: 'grey.600',
                backgroundColor: 'transparent'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {isMobile ? 'Back' : 'Previous'}
          </Button>

          {isLastQuestion ? (
            <Button
              variant="contained"
              startIcon={<SubmitIcon />}
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || submitting}
              size={isMobile ? "medium" : "large"}
              sx={{
                minWidth: { xs: 100, sm: 140 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 700,
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                color: '#ffffff !important',
                border: 'none',
                boxShadow: '0 4px 14px 0 rgba(76, 175, 80, 0.5)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                  boxShadow: '0 6px 20px 0 rgba(76, 175, 80, 0.6)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #424242 0%, #616161 100%) !important',
                  color: '#9e9e9e !important',
                  boxShadow: 'none',
                  opacity: 0.6
                },
                '& .MuiButton-startIcon': {
                  color: '#ffffff'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {submitting ? 'Submitting...' : (isMobile ? 'Submit' : 'Submit Kwiz')}
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<NextIcon />}
              onClick={handleNext}
              disabled={!answers[question.id]}
              size={isMobile ? "medium" : "large"}
              sx={{
                minWidth: { xs: 80, sm: 120 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 700,
                background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 100%)',
                color: '#ffffff !important',
                border: 'none',
                boxShadow: '0 4px 14px 0 rgba(233, 30, 99, 0.5)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c2185b 0%, #f57c00 100%)',
                  boxShadow: '0 6px 20px 0 rgba(233, 30, 99, 0.6)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #424242 0%, #616161 100%) !important',
                  color: '#9e9e9e !important',
                  boxShadow: 'none',
                  opacity: 0.6
                },
                '& .MuiButton-endIcon': {
                  color: '#ffffff'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {isMobile ? 'Next' : 'Next'}
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

export default QuizPage;
