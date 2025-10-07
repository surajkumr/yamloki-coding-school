# Yamloki Frontend (Next.js)

Quick start:

1. cd frontend
2. npm install
3. Create `.env.local` with NEXT_PUBLIC_API_URL (e.g. http://localhost:4000)
4. npm run dev

This scaffold includes pages: index, courses, contact (POSTs to backend), signin (calls /api/auth/login), messages (calls /api/messages). It's minimal — replace with richer UI as you like.

Deployment
- Vercel: import this folder as a new Vercel project (or link the repo and pick the `frontend/` folder as the root). Set `NEXT_PUBLIC_API_URL` in Vercel Environment Variables to your server URL (e.g. https://yamloki-server.railway.app).
- After deployment, the site will be live and will communicate with your server.
