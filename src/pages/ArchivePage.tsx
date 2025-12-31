import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { quizAPI } from '../services/api';

function ArchivePage(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArchive();
  }, []);

  const loadArchive = async (): Promise<void> => {
    try {
      setLoading(true);
      const archiveData = await quizAPI.getArchive();
      setQuizzes(archiveData);
      setError(null);
    } catch (err: any) {
      setError(err.error || 'Failed to load quiz archive');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayQuiz = (date: string): void => {
    navigate(`/quiz/${date}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      const diffTime = today.getTime() - date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days ago`;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(40, 40, 45, 0.75)',
        backdropFilter: 'blur(10px)',
        borderRadius: { xs: 2, sm: 3 },
        p: { xs: 2, sm: 3, md: 4 },
        border: '1px solid rgba(233, 30, 99, 0.3)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Header */}
      <Box mb={4}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          Kwiz Archive
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Play previous Bollywood kwizzes and test your knowledge
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {quizzes.length === 0 ? (
        <Card elevation={2}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No archived kwizzes available
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Check back later for more kwizzes to play
            </Typography>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.date}>
              <Card
                elevation={isMobile ? 1 : 2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  borderRadius: { xs: 2, sm: 3 },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isMobile ? 3 : 6
                  }
                }}
              >
                <CardContent sx={{
                  flexGrow: 1,
                  p: { xs: 2, sm: 3 }
                }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                    spacing={{ xs: 1, sm: 2 }}
                    mb={{ xs: 2, sm: 3 }}
                  >
                    <Chip
                      label={getRelativeDate(quiz.date)}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      icon={<TimeIcon />}
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.8rem' }
                      }}
                    />
                    <Chip
                      label={quiz.category_name}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' }
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      fontWeight: 600,
                      lineHeight: 1.3,
                      mb: { xs: 1, sm: 2 }
                    }}
                  >
                    {quiz.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      mb: { xs: 2, sm: 3 }
                    }}
                  >
                    {formatDate(quiz.date)}
                  </Typography>

                  <Box mt="auto">
                    {quiz.is_available ? (
                      <Button
                        variant="contained"
                        startIcon={<PlayIcon />}
                        onClick={() => handlePlayQuiz(quiz.date)}
                        fullWidth
                        size={isMobile ? "medium" : "large"}
                        sx={{
                          py: { xs: 1, sm: 1.5 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontWeight: 600,
                          borderRadius: 2,
                          boxShadow: 2,
                          '&:hover': {
                            boxShadow: 4
                          }
                        }}
                      >
                        Play Kwiz
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        disabled
                        fullWidth
                        size={isMobile ? "medium" : "large"}
                        sx={{
                          py: { xs: 1, sm: 1.5 },
                          borderRadius: 2
                        }}
                      >
                        Coming Soon
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Navigation */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}

export default ArchivePage;
