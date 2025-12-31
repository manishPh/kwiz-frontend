import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Divider,
  useTheme,
  Theme
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  EmojiEvents as TrophyIcon,
  Category as CategoryIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { UserStats, ScoreDistribution } from '../utils/statsManager';

interface StatsDisplayProps {
  stats: UserStats | null;
  compact?: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

interface ScoreBarChartProps {
  scoreDistribution: ScoreDistribution;
  recentScore?: number;
  totalPlayed: number;
}

function StatsDisplay({ stats, compact = false }: StatsDisplayProps): React.JSX.Element {
  const theme: Theme = useTheme();

  if (!stats || stats.totalPlayed === 0) {
    return (
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <AnalyticsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No statistics yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete your first kwiz to see your stats!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const StatCard = ({ icon, title, value, subtitle, color = 'primary' }: StatCardProps): React.JSX.Element => (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette[color].light}15 0%, ${theme.palette[color].main}10 100%)`,
        border: `1px solid ${theme.palette[color].light}30`
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, textAlign: 'center' }}>
        <Box sx={{ color: `${color}.main`, mb: 1 }}>
          {icon}
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 700,
            color: `${color}.main`,
            mb: 0.5
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontWeight: 600, mb: subtitle ? 0.5 : 0 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const ScoreBarChart = ({ scoreDistribution, recentScore, totalPlayed }: ScoreBarChartProps): React.JSX.Element => {
    const scores: Array<keyof ScoreDistribution> = ['0-5', '6', '7', '8', '9', '10'];
    const maxCount = Math.max(...Object.values(scoreDistribution), 1);

    const getBarColor = (score: keyof ScoreDistribution): string => {
      // Check if this bar represents the recent score
      const scoreNum = score === '0-5' ? 5 : parseInt(score);
      const recentScoreNum = recentScore || 0;

      if (score === '0-5' && recentScoreNum <= 5) return theme.palette.primary.main; // Pink for recent
      if (scoreNum === recentScoreNum) return theme.palette.primary.main; // Pink for recent

      // Default colors based on performance
      if (score === '10') return theme.palette.success.main;
      if (score === '9') return theme.palette.success.light;
      if (score === '8') return theme.palette.info.main;
      if (score === '7') return theme.palette.warning.main;
      if (score === '6') return theme.palette.warning.light;
      return theme.palette.error.light;
    };

    const getScoreLabel = (score: keyof ScoreDistribution): string => {
      if (score === '0-5') return '≤5';
      return score;
    };

    return (
      <Box>
        <Stack direction="row" alignItems="end" spacing={1} sx={{ height: 120, mb: 2 }}>
          {scores.map((score) => {
            const count = scoreDistribution[score] || 0;
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const isRecent = (score === '0-5' && (recentScore || 0) <= 5) ||
              (score !== '0-5' && parseInt(score) === recentScore);

            return (
              <Box key={score} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Bar */}
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 40,
                    height: `${Math.max(height, 5)}%`,
                    backgroundColor: getBarColor(score),
                    borderRadius: '4px 4px 0 0',


                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: isRecent ? `0 0 8px ${theme.palette.primary.main}40` : 'none',
                    border: isRecent ? `2px solid ${theme.palette.primary.main}` : 'none',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 4px 12px ${getBarColor(score)}40`
                    }
                  }}
                >
                  {/* Count label on top of bar */}
                  {count > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        top: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontWeight: 600,
                        color: isRecent ? theme.palette.primary.main : 'text.secondary',
                        fontSize: '0.75rem'
                      }}
                    >
                      {count}
                    </Typography>
                  )}
                </Box>

                {/* Score label */}
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontWeight: isRecent ? 700 : 500,
                    color: isRecent ? theme.palette.primary.main : 'text.secondary',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {getScoreLabel(score)}
                </Typography>
              </Box>
            );
          })}
        </Stack>

        {/* Legend */}
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Score out of 10
          </Typography>
        </Box>
      </Box>
    );
  };

  if (compact) {
    return (
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AnalyticsIcon color="primary" />
            Your Kwiz Stats
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h5" color="primary.main" fontWeight={700}>
                  {stats.totalPlayed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Played
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h5" color="success.main" fontWeight={700}>
                  {stats.accuracy}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accuracy
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h5" color="warning.main" fontWeight={700}>
                  {stats.currentStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Streak
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h5" color="error.main" fontWeight={700}>
                  {stats.perfectScores}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Perfect
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <AnalyticsIcon color="primary" />
        Your Kwiz Statistics
      </Typography>

      {/* Main Stats Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<TrendingIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />}
            title="Kwizzes Played"
            value={stats.totalPlayed}
            color="primary"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<StarIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />}
            title="Accuracy"
            value={`${stats.accuracy}%`}
            subtitle={`${stats.totalCorrect}/${stats.totalQuestions} correct`}
            color="success"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<TrophyIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />}
            title="Current Streak"
            value={stats.currentStreak}
            subtitle={`Best: ${stats.maxStreak}`}
            color="warning"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<StarIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />}
            title="Perfect Scores"
            value={stats.perfectScores}
            subtitle="10/10 kwizzes"
            color="error"
          />
        </Grid>
      </Grid>


      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Score Distribution */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Score Distribution
              </Typography>
              <ScoreBarChart
                scoreDistribution={stats.scoreDistribution}
                recentScore={stats.recentScore}
                totalPlayed={stats.totalPlayed}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Category Performance */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon />
                Category Performance
              </Typography>

              {Object.keys(stats.categoryStats).length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  No category data yet
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {Object.entries(stats.categoryStats)
                    .sort(([, a], [, b]) => b.accuracy - a.accuracy)
                    .map(([category, catStats]) => (
                      <Box key={category}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body1" fontWeight={600}>
                            {category}
                          </Typography>
                          <Chip
                            label={`${catStats.accuracy}%`}
                            size="small"
                            color={catStats.accuracy >= 80 ? 'success' : catStats.accuracy >= 60 ? 'warning' : 'error'}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {catStats.played} kwizzes • Avg: {catStats.avgScore}/10
                        </Typography>
                        {category !== Object.keys(stats.categoryStats)[Object.keys(stats.categoryStats).length - 1] && (
                          <Divider sx={{ mt: 1.5 }} />
                        )}
                      </Box>
                    ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Stats */}
      <Card elevation={1} sx={{ mt: 3, background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TimerIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Avg Score
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {stats.averageScore}/10
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CategoryIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Categories
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {Object.keys(stats.categoryStats).length}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TrophyIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Best Category
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {stats.bestCategory || 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <StarIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Perfect Rate
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {stats.totalPlayed > 0 ? Math.round((stats.perfectScores / stats.totalPlayed) * 100) : 0}%
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default StatsDisplay;
