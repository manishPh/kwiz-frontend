import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Pink for Bollywood glamour
      dark: '#c2185b',
      light: '#f06292',
    },
    secondary: {
      main: '#ff9800', // Orange for energy
      dark: '#f57c00',
      light: '#ffb74d',
    },
    gold: {
      main: '#ffd700', // Bollywood gold
      dark: '#ffc107',
      light: '#ffe082',
    },
    background: {
      default: '#1a1a1a', // Lighter dark background
      paper: '#2a2a2a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d0d0d0',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Bebas Neue", "Poppins", sans-serif',
      fontWeight: 400,
      fontSize: '3.5rem',
      letterSpacing: '0.05em',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontFamily: '"Bebas Neue", "Poppins", sans-serif',
      fontWeight: 400,
      fontSize: '3rem',
      letterSpacing: '0.04em',
      '@media (max-width:600px)': {
        fontSize: '2.2rem',
      },
    },
    h3: {
      fontFamily: '"Bebas Neue", "Poppins", sans-serif',
      fontWeight: 400,
      fontSize: '2.5rem',
      letterSpacing: '0.03em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontFamily: '"Bebas Neue", "Poppins", sans-serif',
      fontWeight: 400,
      fontSize: '2rem',
      letterSpacing: '0.02em',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
      '@media (max-width:600px)': {
        fontSize: '0.95rem',
      },
    },
    body2: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Poppins", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 32px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: '0 4px 14px 0 rgba(233, 30, 99, 0.39)',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 100%)',
          border: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 0 rgba(233, 30, 99, 0.5)',
            background: 'linear-gradient(135deg, #c2185b 0%, #f57c00 100%)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '@media (max-width:600px)': {
            padding: '10px 24px',
            fontSize: '0.95rem',
          },
        },
        sizeLarge: {
          padding: '16px 40px',
          fontSize: '1.2rem',
          boxShadow: '0 6px 20px 0 rgba(233, 30, 99, 0.45)',
          '@media (max-width:600px)': {
            padding: '14px 32px',
            fontSize: '1.1rem',
          },
        },
        outlined: {
          background: 'transparent',
          border: '2px solid #e91e63',
          color: '#e91e63',
          boxShadow: 'none',
          '&:hover': {
            background: 'rgba(233, 30, 99, 0.1)',
            border: '2px solid #ff9800',
            color: '#ff9800',
            boxShadow: '0 4px 14px 0 rgba(255, 152, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'linear-gradient(145deg, #2a2a2a 0%, #3a3a3a 100%)',
          border: '1px solid rgba(233, 30, 99, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px 0 rgba(233, 30, 99, 0.3)',
            border: '1px solid rgba(233, 30, 99, 0.4)',
          },
          '@media (max-width:600px)': {
            borderRadius: 16,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 100%)',
          color: '#ffffff',
          border: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
          borderBottom: '2px solid rgba(233, 30, 99, 0.3)',
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#e91e63',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
