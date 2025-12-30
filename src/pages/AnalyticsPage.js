import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Fade,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatsDisplay from '../components/StatsDisplay';
import { getFormattedStats } from '../utils/statsManager';

function AnalyticsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const userStats = getFormattedStats();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Fade in timeout={600}>
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
          {/* Breadcrumbs */}
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              mb: { xs: 2, sm: 3 },
              '& .MuiBreadcrumbs-separator': {
                color: 'text.secondary'
              }
            }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              <HomeIcon fontSize="small" />
              Home
            </Link>
            <Typography
              color="text.primary"
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: 600
              }}
            >
              <AnalyticsIcon fontSize="small" />
              Analytics
            </Typography>
          </Breadcrumbs>

          {/* Header */}
          <Box
            sx={{
              mb: { xs: 3, sm: 4 },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Your Kwiz Analytics
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 400,
                mb: { xs: 2, sm: 3 }
              }}
            >
              Comprehensive insights into your Bollywood trivia performance
            </Typography>

            {/* Quick Actions */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                flexWrap: 'wrap'
              }}
            >
              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={() => navigate(-1)}
                size={isMobile ? "medium" : "large"}
                sx={{
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
                size={isMobile ? "medium" : "large"}
                sx={{
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #c2185b 0%, #f57c00 100%)',
                  }
                }}
              >
                Today's Kwiz
              </Button>
            </Box>
          </Box>

          {/* Stats Display - Full Mode */}
          <StatsDisplay stats={userStats} compact={false} />

          {/* Bottom Navigation */}
          <Box
            sx={{
              mt: { xs: 4, sm: 6 },
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
                minWidth: { xs: 'auto', sm: 140 }
              }}
            >
              Home
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/archive')}
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
                minWidth: { xs: 'auto', sm: 140 },
                background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c2185b 0%, #f57c00 100%)',
                }
              }}
            >
              Browse Kwizzes
            </Button>
          </Box>

          {/* Footer Note */}
          <Box
            sx={{
              mt: 4,
              textAlign: 'center',
              py: 2
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              Your statistics are stored locally on your device and are not shared with anyone.
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
}

export default AnalyticsPage;
