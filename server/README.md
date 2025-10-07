# Yamloki Server

This is a minimal Node/Express backend for the Yamloki site.

Prerequisites
- Node.js 18+
- MongoDB (or MongoDB Atlas)

Setup
1. Copy `.env.example` to `.env` and fill in `MONGODB_URI`, `JWT_SECRET`, SMTP settings and `ADMIN_EMAIL` (skulove21@gmail.com).
2. Install dependencies:
   npm install
3. Start server in dev mode:
   npm run dev

APIs
- POST /api/auth/register { email, password } -> { token }
- POST /api/auth/login { email, password } -> { token }
- POST /api/messages { name, phone, email?, note? } -> creates message, emails admin (if SMTP configured)
- GET /api/messages -> list messages

Notes
- This scaffold is minimal. You should add authentication middleware on /api/messages and secure the admin endpoints before production.

Deployment (quick)
- Railway / Render / Heroku: create a new project and point to this repository. Set environment variables from `.env.example` in the platform's settings. Railway auto-detects Node apps. Ensure you set `MONGODB_URI` to your MongoDB connection string (use MongoDB Atlas or a managed DB).
- Port: platform will set PORT automatically. Use the provided logs to see the server output.
