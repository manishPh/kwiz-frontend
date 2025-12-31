import React from 'react';
import { Box, Stack } from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import {
  SOCIAL_MEDIA,
  SHARE_TEXT_SUFFIX,
  SHARE_TEXT_INSTAGRAM_SUFFIX,
  SHARE_CLIPBOARD_SUCCESS,
  SHARE_INSTAGRAM_INSTRUCTION
} from '../constants';

interface ShareButtonsProps {
  shareText: string;
  iconSize?: number;
  spacing?: number;
}

function ShareButtons({ shareText, iconSize = 38, spacing = 3 }: ShareButtonsProps): React.JSX.Element {
  const shareOnWhatsApp = (): void => {
    const text = encodeURIComponent(shareText + SHARE_TEXT_SUFFIX);
    const url = `${SOCIAL_MEDIA.WHATSAPP.SHARE_URL}${text}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = (): void => {
    const text = encodeURIComponent(shareText + SHARE_TEXT_SUFFIX);
    const url = `${SOCIAL_MEDIA.FACEBOOK.SHARE_URL}u=${encodeURIComponent(window.location.origin)}&quote=${text}`;
    window.open(url, '_blank');
  };

  const shareOnInstagram = (): void => {
    // Copy to clipboard and open Instagram
    const text = shareText + SHARE_TEXT_INSTAGRAM_SUFFIX;
    navigator.clipboard.writeText(text).then(() => {
      // Open Instagram in a new tab
      const instagramWindow = window.open(SOCIAL_MEDIA.INSTAGRAM.URL, '_blank');
      if (instagramWindow) {
        // Show alert after opening Instagram
        alert(SHARE_INSTAGRAM_INSTRUCTION);
      } else {
        // Popup was blocked
        alert('Please allow popups to open Instagram. Text has been copied to clipboard!');
      }
    });
  };

  const copyToClipboard = (): void => {
    const text = shareText + SHARE_TEXT_SUFFIX;
    navigator.clipboard.writeText(text);
    alert(SHARE_CLIPBOARD_SUCCESS);
  };

  return (
    <Stack
      direction="row"
      spacing={spacing}
      justifyContent="center"
      alignItems="center"
    >
      <Box
        onClick={shareOnWhatsApp}
        sx={{
          cursor: 'pointer',
          color: SOCIAL_MEDIA.WHATSAPP.COLOR,
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(1.2)',
            color: SOCIAL_MEDIA.WHATSAPP.HOVER_COLOR
          }
        }}
      >
        <WhatsAppIcon sx={{ fontSize: iconSize }} />
      </Box>
      <Box
        onClick={shareOnFacebook}
        sx={{
          cursor: 'pointer',
          color: SOCIAL_MEDIA.FACEBOOK.COLOR,
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(1.2)',
            color: SOCIAL_MEDIA.FACEBOOK.HOVER_COLOR
          }
        }}
      >
        <FacebookIcon sx={{ fontSize: iconSize }} />
      </Box>
      <Box
        onClick={shareOnInstagram}
        sx={{
          cursor: 'pointer',
          color: SOCIAL_MEDIA.INSTAGRAM.COLOR,
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(1.2)',
            color: SOCIAL_MEDIA.INSTAGRAM.HOVER_COLOR
          }
        }}
      >
        <InstagramIcon sx={{ fontSize: iconSize }} />
      </Box>
      <Box
        onClick={copyToClipboard}
        sx={{
          cursor: 'pointer',
          color: 'grey.400',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(1.2)',
            color: 'grey.300'
          }
        }}
      >
        <CopyIcon sx={{ fontSize: iconSize }} />
      </Box>
    </Stack>
  );
}

export default ShareButtons;

