import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
  Paper
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

  useEffect(() => {
    loadQuiz();
  }, [date]);

  const loadQuiz = async () => {
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
  };

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
        <CircularProgress />
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
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
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
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
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
              mb: { xs: 2, sm: 3 }
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
                    borderColor: answers[question.id] === option ? 'primary.main' : 'grey.200',
                    borderRadius: 2,
                    mb: { xs: 1, sm: 1.5 },
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.light',
                      backgroundColor: 'primary.50'
                    },
                    backgroundColor: answers[question.id] === option ? 'primary.50' : 'transparent'
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
        {/* Progress Dots */}
        <Box
          display="flex"
          justifyContent="center"
          gap={{ xs: 0.5, sm: 1 }}
          mb={{ xs: 2, sm: 3 }}
          flexWrap="wrap"
        >
          {quiz.questions.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: 10, sm: 12 },
                height: { xs: 10, sm: 12 },
                borderRadius: '50%',
                backgroundColor: answers[quiz.questions[index].id]
                  ? 'success.main'
                  : index === currentQuestion
                    ? 'primary.main'
                    : 'grey.300',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.2)'
                }
              }}
              onClick={() => setCurrentQuestion(index)}
            />
          ))}
        </Box>

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
              py: { xs: 1, sm: 1.5 }
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
                fontWeight: 600,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6
                }
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
                fontWeight: 600,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6
                }
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
