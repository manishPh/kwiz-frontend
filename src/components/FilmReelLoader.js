import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

// Film reel spinning animation
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Film strip sliding animation
const slideFilm = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
`;

// Fade in/out animation for text
const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

function FilmReelLoader({ message = "Loading your Bollywood challenge..." }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        gap: 3,
      }}
    >
      {/* Film Reel Container */}
      <Box
        sx={{
          position: 'relative',
          width: '120px',
          height: '120px',
        }}
      >
        {/* Outer Film Reel */}
        <Box
          sx={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '8px solid #e91e63',
            borderTop: '8px solid #ff9800',
            borderRight: '8px solid #ffd700',
            animation: `${spin} 2s linear infinite`,
          }}
        />
        
        {/* Inner Film Reel */}
        <Box
          sx={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '6px solid #ff9800',
            borderTop: '6px solid #e91e63',
            animation: `${spin} 1.5s linear infinite reverse`,
          }}
        />
        
        {/* Center Circle */}
        <Box
          sx={{
            position: 'absolute',
            top: '45px',
            left: '45px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 100%)',
          }}
        />
        
        {/* Film Holes (decorative) */}
        {[0, 60, 120, 180, 240, 300].map((angle, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ffd700',
              top: '56px',
              left: '56px',
              transform: `rotate(${angle}deg) translateY(-50px)`,
            }}
          />
        ))}
      </Box>

      {/* Film Strip Animation */}
      <Box
        sx={{
          width: '60px',
          height: '80px',
          background: 'linear-gradient(to bottom, transparent 0%, transparent 45%, #e91e63 45%, #e91e63 55%, transparent 55%, transparent 100%)',
          backgroundSize: '100% 20px',
          animation: `${slideFilm} 1s ease-in-out infinite alternate`,
          borderLeft: '3px solid #333',
          borderRight: '3px solid #333',
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            width: '6px',
            height: '6px',
            backgroundColor: '#333',
            borderRadius: '50%',
            left: '-6px',
          },
          '&::before': {
            top: '10px',
          },
          '&::after': {
            bottom: '10px',
          },
        }}
      />

      {/* Loading Text */}
      <Typography
        variant="h6"
        sx={{
          color: 'text.secondary',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          animation: `${pulse} 2s ease-in-out infinite`,
          textAlign: 'center',
          px: 2,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}

export default FilmReelLoader;

