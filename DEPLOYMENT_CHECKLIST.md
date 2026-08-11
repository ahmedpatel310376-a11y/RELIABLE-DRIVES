# Reliable Drives Production Checklist

## 1. Database

- Create a MongoDB Atlas database for production.
- Set `MONGO_URI` on the backend host.
- Enable regular backups in Atlas.

## 2. Upload Storage

- Configure Cloudinary on the backend host:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Do not rely on local `/uploads` storage in production unless the server has persistent disk.

## 3. Backend

- Deploy the `server/` folder.
- Install command: `npm ci --omit=dev`
- Start command: `npm start`
- Required environment:
  - `NODE_ENV=production`
  - `MONGO_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN=7d`
  - `CLIENT_URL=https://your-frontend-domain.com`
- Confirm `GET /api/health` returns `{"status":"ok"}`.

## 4. Admin Account

- Set a private `ADMIN_USERNAME` and strong `ADMIN_PASSWORD` on the backend host.
- Run `npm run seed:admin` once against the production database.
- Remove or rotate temporary admin credentials after launch.

## 5. Frontend

- Deploy the `client/` folder.
- Build command: `npm run build`
- Output directory: `dist`
- Required environment:
  - `VITE_API_URL=https://your-api-domain.com/api`
  - `VITE_SELLER_PHONE=7045352593`
  - `VITE_ADMIN_PATH=/secure-inventory`
- SPA fallbacks are included for Vercel, Netlify, and nginx Docker.

## 6. Domain And SSL

- Point the frontend domain to the frontend host.
- Point the API domain or subdomain to the backend host.
- Enable HTTPS on both domains.
- Update backend `CLIENT_URL` after the frontend domain is final.
- Update frontend `VITE_API_URL` after the API domain is final.

## 7. Final Smoke Test

- Open the homepage.
- Open `/cars`.
- Open `/secure-inventory/login`.
- If you forget the private path, `/admin/login` redirects to the admin login and `/admin` redirects to the dashboard path.
- Login as admin.
- Create a test car with photos.
- Confirm photos still load after refreshing the page.
- Delete the test car.
