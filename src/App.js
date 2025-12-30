import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box, useTheme, useMediaQuery, IconButton, Tooltip } from '@mui/material';
import {
  Movie as MovieIcon,
  Home as HomeIcon,
  Archive as ArchiveIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import ArchivePage from './pages/ArchivePage';
import AnalyticsPage from './pages/AnalyticsPage';
import { DOMAIN, APP_FULL_NAME } from './constants';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'background.default',
      position: 'relative',
      // Background image
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/kwiz_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        opacity: 0.9,
        zIndex: 0,
        pointerEvents: 'none',
      },
      // Lighter overlay for better readability
      '&::after': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.5) 0%, rgba(40, 40, 45, 0.6) 100%)',
        zIndex: 0,
        pointerEvents: 'none',
      }
    }}>
      <AppBar
        position="static"
        sx={{
          boxShadow: { xs: 1, sm: 2 },
          zIndex: 1100,
          flexShrink: 0,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <MovieIcon sx={{
            mr: { xs: 1, sm: 2 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
            color: '#ffd700',
          }} />
          <Typography
            variant={isMobile ? "h6" : "h4"}
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: '"Bebas Neue", sans-serif',
              letterSpacing: '0.05em',
              background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 50%, #ffd700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            {isMobile ? DOMAIN : APP_FULL_NAME}
          </Typography>

          {/* Navigation Icons */}
          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
            <Tooltip title="Home" arrow>
              <IconButton
                onClick={() => navigate('/')}
                sx={{
                  color: location.pathname === '/' ? '#ffd700' : 'white',
                  '&:hover': {
                    color: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <HomeIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Archive" arrow>
              <IconButton
                onClick={() => navigate('/archive')}
                sx={{
                  color: location.pathname === '/archive' ? '#ffd700' : 'white',
                  '&:hover': {
                    color: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ArchiveIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Analytics" arrow>
              <IconButton
                onClick={() => navigate('/analytics')}
                sx={{
                  color: location.pathname === '/analytics' ? '#ffd700' : 'white',
                  '&:hover': {
                    color: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <AnalyticsIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          zIndex: 1,
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(233, 30, 99, 0.6)',
            borderRadius: '5px',
            '&:hover': {
              background: 'rgba(233, 30, 99, 0.8)',
            },
          },
          // Firefox scrollbar
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(233, 30, 99, 0.6) rgba(255, 255, 255, 0.05)',
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz/:date" element={<QuizPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
