# Kwiz Frontend

React frontend for the Kwiz Bollywood trivia app.

## Features
- Daily Bollywood trivia quizzes
- Timer system (Wordle-style daily releases)
- Local storage for user statistics
- Social media sharing
- Material-UI design
- Mobile-responsive interface

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Production (Netlify)
1. Build the app: `npm run build`
2. Deploy `build/` folder to Netlify
3. Configure environment variables for API URL

## Environment Variables
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8000  # Development
REACT_APP_API_URL=https://your-backend.railway.app  # Production
```

## Key Features
- **Daily Quiz**: New quiz every day with timer
- **Statistics**: Track performance with localStorage
- **Sharing**: Social media integration
- **Responsive**: Works on mobile and desktop

## Tech Stack
- React 18
- Material-UI
- React Router
- Axios for API calls
- localStorage for persistence

## Deployment
- **Recommended**: Netlify (auto-deploys from GitHub)
- **Alternative**: Vercel, GitHub Pages
kwiz-frontend
