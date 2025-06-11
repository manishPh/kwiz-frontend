import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Schedule as ScheduleIcon,
  Upcoming as UpcomingIcon
} from '@mui/icons-material';

function QuizTimer({ timeUntilRelease, nextQuiz, quizTitle, isAvailable }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [timeLeft, setTimeLeft] = useState(timeUntilRelease || 0);

  useEffect(() => {
    setTimeLeft(timeUntilRelease || 0);
  }, [timeUntilRelease]);

  useEffect(() => {
    if (timeLeft <= 0 || isAvailable) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Quiz should be available now, trigger a refresh
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAvailable]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeMessage = () => {
    if (isAvailable) return null;

    if (timeLeft <= 0) {
      return "Kwiz should be available now! Refreshing...";
    }

    if (timeLeft < 3600) { // Less than 1 hour
      return "Coming very soon!";
    } else if (timeLeft < 86400) { // Less than 24 hours
      return "Coming today!";
    } else {
      return "Coming soon!";
    }
  };

  if (isAvailable) return null;

  return (
    <Card
      elevation={isMobile ? 2 : 3}
      sx={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
        border: '2px solid',
        borderColor: 'primary.light',
        mb: { xs: 2, sm: 3 }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            justifyContent="center"
          >
            <ScheduleIcon color="primary" />
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                fontWeight: 600
              }}
            >
              Next Kwiz Coming Soon
            </Typography>
          </Stack>

          {/* Quiz Title */}
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.4rem' },
              fontWeight: 700,
              color: 'text.primary'
            }}
          >
            {quizTitle || 'Upcoming Kwiz'}
          </Typography>

          {/* Countdown Timer */}
          <Box textAlign="center">
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 800,
                color: 'primary.main',
                fontFamily: 'monospace',
                letterSpacing: 2
              }}
            >
              {formatTime(timeLeft)}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              {getTimeMessage()}
            </Typography>
          </Box>

          {/* Release Info */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <Chip
              icon={<TimeIcon />}
              label="Releases at 12:00 AM IST"
              color="primary"
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
            {nextQuiz && (
              <Chip
                icon={<UpcomingIcon />}
                label={nextQuiz.category}
                color="secondary"
                size={isMobile ? "small" : "medium"}
              />
            )}
          </Stack>

          {/* Encouragement Message */}
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{
              fontStyle: 'italic',
              fontSize: { xs: '0.85rem', sm: '0.9rem' }
            }}
          >
            🎬 Get ready for fresh trivia based on what's happening now!
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default QuizTimer;
