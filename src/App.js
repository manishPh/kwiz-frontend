import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import ArchivePage from './pages/ArchivePage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      flexGrow: 1,
      minHeight: '100vh',
      backgroundColor: 'background.default'
    }}>
      <AppBar
        position="sticky"
        sx={{
          mb: { xs: 2, sm: 3 },
          boxShadow: { xs: 1, sm: 2 }
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <MovieIcon sx={{ mr: { xs: 1, sm: 2 } }} />
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              fontWeight: 600
            }}
          >
            {isMobile ? 'Kwiz.com' : 'Kwiz.com - Daily Fresh Trivia'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 3, sm: 4 }
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
  );
}

export default App;
