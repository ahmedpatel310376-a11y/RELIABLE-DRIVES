# Reliable Drives

Full-stack second-hand car marketplace with a React/Vite frontend, Node/Express API, MongoDB/Mongoose persistence, JWT admin authentication, image uploads, filters, pagination, wishlist, and an admin inventory dashboard.

## Structure

```text
reliable-drives/
  client/   React, Vite, Tailwind CSS, Framer Motion
  server/   Express, MongoDB, Mongoose, JWT, Multer, Cloudinary-ready uploads
```

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Start MongoDB locally or with Docker:

```bash
docker compose up mongo
```

4. Seed the admin user:

```bash
npm run seed:admin
```

Set a private owner username and a strong password in `server/.env` before seeding:

```text
ADMIN_USERNAME=your-private-owner-username
ADMIN_PASSWORD=your-strong-unique-password
```

5. Start the backend and frontend in separate terminals:

```bash
npm run dev:server
npm run dev:client
```

Open `http://localhost:5173`.

The owner dashboard is intentionally omitted from public navigation. Its path comes from `VITE_ADMIN_PATH` and still requires valid JWT authentication. A custom path is not a replacement for a strong password.

## API

```text
POST   /api/auth/login
GET    /api/cars
GET    /api/cars/:id
POST   /api/cars        protected, multipart images[]
PUT    /api/cars/:id    protected, multipart images[]
DELETE /api/cars/:id    protected
```

`GET /api/cars` supports `brand`, `fuelType`, `location`, `minPrice`, `maxPrice`, `status`, `sort`, `page`, and `limit`.

## Uploads

Local uploads work by default and are served from `/uploads`.

To use Cloudinary, set these in `server/.env`:

```text
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Deployment

Frontend:

- Deploy `client/` to Vercel or Netlify.
- Set `VITE_API_URL=https://your-api-domain.com/api`.
- Build command: `npm run build`.
- Publish directory: `dist`.
- SPA fallback files are included for Vercel, Netlify, and nginx Docker so direct routes work after refresh.

Backend:

- Deploy `server/` to Render or Railway.
- Set `MONGO_URI` to MongoDB Atlas.
- Set a random `JWT_SECRET` containing at least 32 characters.
- Set `CLIENT_URL` to your frontend domain.
- Set a unique `ADMIN_USERNAME` and strong `ADMIN_PASSWORD`.
- Run `npm run seed:admin` once from the provider shell or locally against Atlas.

## Production Notes

- See `DEPLOYMENT_CHECKLIST.md` before launch.
- The seller number is configured with `VITE_SELLER_PHONE`.
- The private dashboard route is configured with `VITE_ADMIN_PATH`.
- Keep `JWT_SECRET` private and long.
- Use Cloudinary in production so uploaded images persist across deploys.
- Use the regular `npm start` API in production. `npm run preview:api` is an in-memory local demonstration API and must not be deployed.
- Configure HTTPS, a custom domain, database backups, uptime monitoring, analytics, and error reporting before launch.
