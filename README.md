# SaaS Application

A full-stack web application with React + Tailwind CSS frontend and Node.js + Express backend.

## Project Structure

```
e:\Saas
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   └── index.js         # Server entry point
│   └── package.json
│
└── frontend/                # React + Vite + Tailwind CSS
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── App.jsx          # Main App component
    │   ├── main.jsx         # React entry point
    │   └── index.css        # Tailwind CSS
    ├── index.html
    ├── vite.config.js       # Vite configuration with proxy
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Run Backend (Terminal 1)
```bash
cd backend
npm start
# Server runs on http://localhost:3001
```

### 4. Run Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/hello` - Returns Hello World message from backend

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express, CORS
