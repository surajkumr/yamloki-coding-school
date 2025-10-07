# Yamloki Coding School — Fullstack (Node + Next.js)

This repository contains a minimal fullstack project for the Yamloki coding site.

Structure
- server/ — Node.js + Express backend (MongoDB, JWT auth, mail sending)
- frontend/ — Next.js frontend (React) with pages to view courses, contact form, sign-in, and messages

Quick start (local)
1. Backend
   - cd server
   - npm install
   - copy `.env.example` -> `.env` and set `MONGODB_URI`, `JWT_SECRET`, SMTP settings, `ADMIN_EMAIL=skulove21@gmail.com`
   - npm run dev

2. Frontend
   - cd frontend
   - npm install
   - create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:4000`
   - npm run dev

Notes
- The backend sends emails using SMTP (nodemailer). Configure SMTP credentials in `server/.env`.
- The messages listing is JWT-protected and only accessible to the admin email defined by `ADMIN_EMAIL`.

Next steps
- Deploy backend (Railway/Render/Vercel server functions) and frontend (Vercel). See `server/README.md` and `frontend/README.md` for details.
