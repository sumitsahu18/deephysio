# DeePhysio – Frontend (React + Vite + Tailwind v4)

Glass design website + ek admin dashboard. Data backend API (`/api`) se aata hai.

```bash
npm install
npm run dev        # http://localhost:5173  -> /api aur /uploads backend (localhost:5000) par jaate hain
npm run build      # production files -> dist/
```

| Setting | File | Kaam |
|---|---|---|
| `VITE_USE_MOCK=false` | `.env.development` (local) | asli backend se data |
| `VITE_USE_MOCK=true` | Netlify env / `.env.development` | demo: bina server, data sirf browser mein (login admin@deephysio.co.uk / admin123) |
| `VITE_API_URL` | | backend address, default `/api` |

```
src/
  api/        axios (cookies + auto refresh), endpoints (saari API calls), mockDb (demo mode)
  context/    AuthContext (login, roles), SiteContext (content + theme colours)
  components/ Navbar, Footer, GlassBackground, CrudPage, MediaPicker ...
  layouts/    PublicLayout, AdminLayout
  pages/      website pages · pages/admin: dashboard sections
  lib/permissions.js   roles (copy backend/lib mein bhi)
  data/seed.js         demo mode ka starting content (copy backend/data mein bhi)
```

**Netlify:** Base directory `frontend` · Build `npm run build` · Publish `dist`.
