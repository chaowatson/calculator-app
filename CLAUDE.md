# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Run Commands

### Installation
```bash
npm install                 # Install backend dependencies
npm run install-client      # Install frontend dependencies
```

### Development
```bash
npm run dev                 # Run backend (port 5001) AND frontend (port 3000) concurrently
npm start                   # Start backend only
npm run client              # Start React frontend only
```

### Testing
```bash
cd client && npm test       # Run React tests (Jest/Testing Library)
```

### Production Build
```bash
npm run build               # Build React frontend to client/build/
```

## Architecture

This is a calculator app with a Node.js/Express backend and React frontend, deployed to AWS Lambda.

### Backend (server.js)
- Express server on port 5001 (configurable via `PORT` env var)
- Single POST endpoint: `/api/calculate` - accepts `{ expression: string }`, returns `{ result: string }`
- Calculator logic: validates input, converts × to *, ÷ to /, handles percentages (`50%` → `(50/100)`)
- Uses `Function` constructor with strict input validation for safe evaluation
- In production (`NODE_ENV=production`), serves static React build files

### Frontend (client/)
- React 19 app created with Create React App
- Main component: `Calculator.js` - handles UI state and API calls
- API URL hardcoded to AWS Lambda endpoint: `https://e2aap70m1h.execute-api.us-east-2.amazonaws.com/Test/api/calculate`

### API Communication
- Frontend POSTs `{ expression: "5+3×2" }` to backend
- Backend returns `{ result: "11" }` or `{ error: "..." }`

## Key Files

- `server.js` - Backend entry point with calculation logic and input validation
- `client/src/Calculator.js` - Main React component with calculator state and API calls
- `client/src/Calculator.css` - UI styles (CSS Grid, responsive design)

## Troubleshooting

If `react-scripts: command not found`:
```bash
cd client && rm -rf node_modules package-lock.json && npm install
```

Requires Node.js v14 or higher.
