# AI-Powered E‑commerce App

Full-stack e‑commerce dashboard with AI search, Stripe payments, seller dashboard, and order management.

## Structure

- **`client/`** – Next.js 16 frontend (React 19, Tailwind, shadcn/ui)
- **`server/`** – Express API (TypeScript, Prisma, Neon), Stripe, Resend, Azure OpenAI, Pinecone

## Features

- **Storefront** – Product listing, categories, cart, checkout (Stripe)
- **Auth** – Email/password and Google OAuth, JWT
- **AI search** – Text and image search via `/ai-search` (vision + vector search)
- **Chat** – RAG assistant and store-setup flow (Azure OpenAI, Pinecone)
- **Sellers** – Dashboard, products, orders, status updates, AI product generation from images
- **Orders** – My orders, cancel-before-ship, refunds (Stripe + email)

## Quick start

1. **Server** (from repo root):

   ```bash
   cd server
   cp .env.example .env   # if present, then edit
   npm install
   npx prisma generate
   npx prisma migrate dev   # or deploy migrations for production
   npm run dev
   ```

   API: [http://localhost:3001](http://localhost:3001) (or `PORT` in `.env`).

2. **Client** (from repo root):

   ```bash
   cd client
   npm install
   npm run dev
   ```

   App: [http://localhost:3000](http://localhost:3000).

3. Set `NEXT_PUBLIC_API_URL` in the client (e.g. `http://localhost:3001`) if the API is not on the same host.

## Environment

- **Server** – See `server/README.md` and `server/.env.example` (if added) for `DATABASE_URL`, Stripe, Resend, Azure OpenAI, Pinecone, Cloudinary, etc.
- **Client** – `NEXT_PUBLIC_API_URL` (and any other `NEXT_PUBLIC_*` vars) in `.env.local`.

## Scripts

| Location | Command        | Description              |
|----------|----------------|--------------------------|
| `server/`| `npm run dev`  | API with tsx watch       |
| `server/`| `npm run build`| Compile TypeScript       |
| `server/`| `npm start`    | Run compiled `dist/`     |
| `client/`| `npm run dev`  | Next.js dev server       |
| `client/`| `npm run build`| Next.js production build |
| `client/`| `npm start`    | Next.js production server|

## Docs

- [Client README](client/README.md) – Frontend setup and scripts
- [Server README](server/README.md) – API, database, and env
