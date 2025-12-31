import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  Paper
} from '@mui/material';
import {
  Home as HomeIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import StatsDisplay from '../components/StatsDisplay';
import { getFormattedStats } from '../utils/statsManager';
import { QuestionResult } from '../services/api';
import {
  DOMAIN,
  SHARE_TEXT_SUFFIX,
  SHARE_TEXT_INSTAGRAM_SUFFIX,
  SHARE_CLIPBOARD_SUCCESS,
  SHARE_INSTAGRAM_INSTRUCTION,
  SOCIAL_MEDIA,
  SCORE_EMOJI,
  SCORE_THRESHOLDS
} from '../constants';

function ResultsPage(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { results, quiz } = (location.state as any) || {};
  const userStats = getFormattedStats();

  if (!results || !quiz) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          No results data found. Please take a kwiz first.
        </Alert>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
      </Box>
    );
  }

  const getScoreColor = (percentage: number): 'success' | 'warning' | 'error' => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const getScoreEmoji = (percentage: number): string => {
    if (percentage >= SCORE_THRESHOLDS.EXCELLENT) return SCORE_EMOJI.EXCELLENT;
    if (percentage >= SCORE_THRESHOLDS.GREAT) return SCORE_EMOJI.GREAT;
    if (percentage >= SCORE_THRESHOLDS.GOOD) return SCORE_EMOJI.GOOD;
    if (percentage >= SCORE_THRESHOLDS.OKAY) return SCORE_EMOJI.OKAY;
    return SCORE_EMOJI.TRY_AGAIN;
  };

  const shareOnWhatsApp = (): void => {
    const text = encodeURIComponent(results.share_text + SHARE_TEXT_SUFFIX);
    const url = `${SOCIAL_MEDIA.WHATSAPP.SHARE_URL}${text}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = (): void => {
    const text = encodeURIComponent(results.share_text + SHARE_TEXT_SUFFIX);
    const url = `${SOCIAL_MEDIA.FACEBOOK.SHARE_URL}u=${DOMAIN}&quote=${text}`;
    window.open(url, '_blank');
  };

  const shareOnInstagram = (): void => {
    // Instagram doesn't support direct text sharing via URL, so we copy to clipboard
    const text = results.share_text + SHARE_TEXT_INSTAGRAM_SUFFIX;
    navigator.clipboard.writeText(text);
    alert(SHARE_INSTAGRAM_INSTRUCTION);
  };

  const copyToClipboard = (): void => {
    const text = results.share_text + SHARE_TEXT_SUFFIX;
    navigator.clipboard.writeText(text);
    alert(SHARE_CLIPBOARD_SUCCESS);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(40, 40, 45, 0.75)',
        backdropFilter: 'blur(10px)',
        borderRadius: { xs: 2, sm: 3 },
        p: { xs: 2, sm: 3, md: 4 },
        border: '1px solid rgba(233, 30, 99, 0.3)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        '@keyframes celebrationPop': {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        '@keyframes slideUp': {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Results Header */}
      <Card
        elevation={isMobile ? 2 : 3}
        sx={{
          mb: { xs: 2, sm: 3 },
          textAlign: 'center',
          animation: 'celebrationPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 50%, #ffd700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Kwiz Complete! {getScoreEmoji(results.percentage)}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {quiz.title}
          </Typography>

          <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={3}>
            <Typography variant="h2" color={getScoreColor(results.percentage) + '.main'}>
              {results.score}/{results.total}
            </Typography>
            <Box>
              <Chip
                label={`${results.percentage}%`}
                color={getScoreColor(results.percentage)}
                size="medium"
              />
            </Box>
          </Box>

          <Typography variant="body1" color="text.secondary" mt={2}>
            {results.percentage >= 80 ? 'Excellent! You\'re a Bollywood expert!' :
              results.percentage >= 60 ? 'Good job! You know your Bollywood!' :
                'Keep watching more Bollywood movies!'}
          </Typography>
        </CardContent>
      </Card>

      {/* Social Sharing */}
      <Card
        elevation={isMobile ? 1 : 2}
        sx={{
          mb: { xs: 2, sm: 3 },
          borderRadius: { xs: 2, sm: 3 },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 600
            }}
          >
            Share Your Results
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              backgroundColor: 'grey.50',
              borderRadius: 2,
              mb: { xs: 2, sm: 3 }
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.875rem' },
                fontFamily: 'monospace',
                textAlign: 'center'
              }}
            >
              {results.share_text}
            </Typography>
          </Paper>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={shareOnWhatsApp}
              size={isMobile ? "medium" : "large"}
              fullWidth={isMobile}
              sx={{
                backgroundColor: SOCIAL_MEDIA.WHATSAPP.COLOR,
                color: 'white',
                borderRadius: 2,
                py: { xs: 1.5, sm: 2 },
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: SOCIAL_MEDIA.WHATSAPP.HOVER_COLOR
                }
              }}
            >
              WhatsApp
            </Button>
            <Button
              variant="contained"
              startIcon={<FacebookIcon />}
              onClick={shareOnFacebook}
              size={isMobile ? "medium" : "large"}
              fullWidth={isMobile}
              sx={{
                backgroundColor: SOCIAL_MEDIA.FACEBOOK.COLOR,
                color: 'white',
                borderRadius: 2,
                py: { xs: 1.5, sm: 2 },
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: SOCIAL_MEDIA.FACEBOOK.HOVER_COLOR
                }
              }}
            >
              Facebook
            </Button>
            <Button
              variant="contained"
              startIcon={<InstagramIcon />}
              onClick={shareOnInstagram}
              size={isMobile ? "medium" : "large"}
              fullWidth={isMobile}
              sx={{
                background: 'linear-gradient(45deg, #F56040 0%, #E1306C 25%, #C13584 50%, #833AB4 75%, #5851DB 100%)',
                color: 'white',
                borderRadius: 2,
                py: { xs: 1.5, sm: 2 },
                fontWeight: 600,
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              Instagram
            </Button>
            {!isMobile && (
              <Button
                variant="outlined"
                startIcon={<CopyIcon />}
                onClick={copyToClipboard}
                size="large"
                sx={{
                  borderRadius: 2,
                  py: 2,
                  minWidth: 100
                }}
              >
                Copy
              </Button>
            )}
          </Stack>

          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={copyToClipboard}
              size="medium"
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1.5,
                mt: 1.5,
                fontWeight: 500
              }}
            >
              Copy to Clipboard
            </Button>
          )}
        </CardContent>
      </Card>

      {/* User Statistics */}
      <StatsDisplay stats={userStats} compact={true} />

      {/* Question Review */}
      <Typography variant="h6" gutterBottom>
        Question Review
      </Typography>

      {results.results.map((result: any, index: number) => {
        const question = quiz.questions.find((q: any) => q.id === result.question_id);
        if (!question) return null;

        // Backend returns user_answer and correct_answer as actual values, not option letters
        const userAnswer = result.user_answer || result.selected_option || '';
        const correctAnswer = result.correct_answer;
        const isCorrect = result.correct !== undefined ? result.correct : result.is_correct;

        return (
          <Card key={result.question_id} elevation={1} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="flex-start" gap={2}>
                {isCorrect ? (
                  <CorrectIcon color="success" />
                ) : (
                  <WrongIcon color="error" />
                )}

                <Box flex={1}>
                  <Typography variant="subtitle1" gutterBottom>
                    Q{index + 1}: {question.text}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Your answer:
                      </Typography>
                      <Typography
                        variant="body1"
                        color={isCorrect ? 'success.main' : 'error.main'}
                      >
                        {userAnswer || 'Not answered'}
                      </Typography>
                    </Grid>

                    {!isCorrect && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Correct answer:
                        </Typography>
                        <Typography variant="body1" color="success.main">
                          {correctAnswer}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}

      <Divider sx={{ my: 3 }} />

      {/* Navigation */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
        >
          Home
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/archive')}
        >
          More Kwizzes
        </Button>
      </Box>
    </Box>
  );
}

export default ResultsPage;
