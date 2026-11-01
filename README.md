# DeePhysio – Frontend (React + Vite + Tailwind CSS v4)

Physiotherapy clinic website + admin panel. Backend (Express + MongoDB + JWT) baad mein banega;
tab tak **demo mode** mein sab kuch browser ke localStorage se chalta hai.

## Antigravity mein kaise chalayein

1. Zip extract karo, jaise `D:\projects\deephysio-frontend`
2. Antigravity kholo → **Open Folder** → ye folder select karo
3. Terminal kholo (Terminal → New Terminal) aur chalao:
   ```bash
   npm install
   copy .env.example .env      # Windows (Mac/Linux: cp .env.example .env)
   npm run dev
   ```
4. Browser mein `http://localhost:5173` kholo

Node.js 20+ chahiye (`node -v` se check karo).

## Pages

| Public | Admin (JWT protected) |
|---|---|
| `/` Home | `/admin/login` Login |
| `/about` About & Team | `/admin` Dashboard |
| `/services` Treatments | `/admin/enquiries` Enquiries |
| `/services/:slug` Treatment detail | `/admin/services` Treatments CRUD |
| `/faq` FAQ | `/admin/team` Team CRUD |
| `/contact` Contact + enquiry form + map | `/admin/faqs` FAQs CRUD |
| `/privacy` Privacy policy | `/admin/settings` Clinic settings (admin only) |
| | `/admin/users` Users & roles (admin only) |

**Demo logins** (sirf mock mode):
- Admin: `admin@deephysio.co.uk` / `admin123`
- Editor (reception staff): `editor@deephysio.co.uk` / `editor123`

Editor role settings, users aur delete nahi kar sakta (RFP ka "restricted Content Editor role").

## Folder structure

```
src/
  api/
    axios.js        -> axios instance + JWT interceptor (Bearer token, 401 par logout)
    endpoints.js    -> saari API calls + backend routes ki list
    mockDb.js       -> fake backend (localStorage) jab tak Express nahi bana
  context/
    AuthContext.jsx -> login/logout, user, role permissions
    SiteContext.jsx -> clinic settings (phone, hours, address) – kuch hardcoded nahi
  components/       -> Navbar, Footer, MobileCallBar, Reveal, ServiceCard, CrudPage, ProtectedRoute...
  layouts/          -> PublicLayout, AdminLayout
  pages/            -> public pages
  pages/admin/      -> admin pages
  data/seed.js      -> starting data (MongoDB seed ke liye bhi use karna)
```

## Backend se connect karna (next step)

1. Express backend banao jo `src/api/endpoints.js` ke top par likhe routes de
2. `.env` mein `VITE_USE_MOCK=false` kar do
3. Backend port 5000 par chalao – `vite.config.js` ka proxy `/api` ko wahan bhej dega

Backend ke liye zaroori cheezein:
- Models: User (name, email, passwordHash, role: admin|editor), Settings (single doc), Service, TeamMember, Faq, Enquiry
- `bcryptjs` (password hash), `jsonwebtoken` (JWT), middleware `protect` + `allowRoles('admin')`
- `express-rate-limit` enquiry route par, `helmet`, `cors`
- Enquiry aane par clinic email par notification (Nodemailer + SMTP / Brevo / Resend)

## TODO (client se lena hai)

- Practitioners ke asli naam, photos, HCPC numbers, bio
- Logo aur clinic photos (hero section mein abhi illustration hai)
- Asli privacy policy text
