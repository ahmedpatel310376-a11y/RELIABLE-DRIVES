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

Default seed values come from `server/.env`:

```text
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@12345
```

5. Start the backend and frontend in separate terminals:

```bash
npm run dev:server
npm run dev:client
```

Open `http://localhost:5173`.

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

Backend:

- Deploy `server/` to Render or Railway.
- Set `MONGO_URI` to MongoDB Atlas.
- Set a strong `JWT_SECRET`.
- Set `CLIENT_URL` to your frontend domain.
- Run `npm run seed:admin` once from the provider shell or locally against Atlas.

## Production Notes

- Replace the placeholder logo text in `client/src/components/Layout.jsx` with an uploaded logo image when ready.
- Change the seller phone number in `Home.jsx` and `CarDetails.jsx`.
- Keep `JWT_SECRET` private and long.
- Use Cloudinary in production so uploaded images persist across deploys.
