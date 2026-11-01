# DeePhysio – Frontend (React + Vite + Tailwind CSS v4)

Client ke RFP PDF ("DeephysiNew Website Proposal") ke hisaab se bana hua frontend.
Layout / animation reference: mingaramed.com.au. Backend (Express + MongoDB + JWT) agla step hai;
tab tak **demo mode** mein data browser ke localStorage mein save hota hai.

## Chalane ka tarika (Antigravity / VS Code)

```bash
npm install
copy .env.example .env      # Windows   (Mac/Linux: cp .env.example .env)
npm run dev
```
Browser: `http://localhost:5173` · Admin: `http://localhost:5173/admin/login`

| Role | Email | Password |
|---|---|---|
| Admin | admin@deephysio.co.uk | admin123 |
| Content Editor (reception) | editor@deephysio.co.uk | editor123 |

---

## PDF requirement → kahan bana hai

| PDF point | Implementation |
|---|---|
| 1. Phone-first website | Mobile-first Tailwind, neeche fixed **Call Now / Enquire** bar |
| 1. Reception staff text, hours, contact khud badle | Admin → **Page content**, **Clinic details & hours** (Content Editor bhi use kar sakta hai) |
| 2.2 (1) Homepage: hero with conditions treated, practitioner credentials, Book / Enquire CTAs | `pages/Home.jsx` hero |
| 2.2 (2) About & Team: qualifications, named practitioners, HCPC / CSP badges | `pages/About.jsx` + Admin → Team |
| 2.2 (3) Services: structured, describes care, no unsubstantiated claims (CAP/ASA) | `pages/Services.jsx`, `pages/ServiceDetail.jsx` (live site ke same URLs) |
| 2.2 (4) Contact: enquiry form, click-to-call, opening hours, Google Map | `pages/Contact.jsx` |
| 2.3 Zero hardcoded content | Saara text / phone / email / hours / images API se aata hai (`site`, `clinic`, `pages`, `services`, `team`) |
| 2.3 Restricted Content Editor role | Editor: page copy, media, services, team, hours/contact, enquiries. **Nahi kar sakta:** users, site settings, delete |
| 2.4 Data minimisation | Form mein sirf Name, Email/Phone, Preferred contact time, Message. Koi medical dropdown / pain slider nahi |
| 2.4 Enquiry delivery to clinic email | **Backend ka kaam**: Nodemailer + authenticated SMTP (Brevo/SendGrid/Gmail app password) |
| 3.1 Lightweight animations (scroll reveals, subtle hover) | `index.css` + `components/Reveal.jsx` (neeche list) |
| 3.1 Cross-browser, mobile-first | Tested 390px mobile aur 1440px desktop par, koi horizontal scroll nahi |

### Pages (6 + service pages)
Home · About & Team · Services · 6 Service pages (Manipulation, Mobilisation, Electrotherapy,
Exercise Therapy, Traction, Biomechanical Assessment) · Contact & Booking Enquiry · Privacy Policy

### Animations (Mingara / Elementor style)
- Hero photo slow zoom-out (Ken Burns), hero text ek-ek karke fade/zoom in
- Scroll reveal: fade-up, slide-left/right, zoom (IntersectionObserver, koi library nahi)
- Service cards: lift on hover, photo zoom, number badge rotate
- Sticky header jo scroll par chhota hota hai, nav underline hover, dropdown fade
- WhatsApp button soft pulse, scroll-to-top button
- `prefers-reduced-motion` par sab animation band (accessibility)

---

## PDF se alag kya hai (batana zaroori)

**Rakha hai (client ke order form ya legal wajah se):**
- Facebook / Instagram / WhatsApp icons + WhatsApp chat button → client ke order form mein maanga tha
- Privacy Policy page → enquiry form ke consent ke liye UK GDPR mein zaroori
- Admin mein Enquiries list → email fail ho jaye to backup copy. Chaho to hata sakte hain

**Hata diya (PDF mein nahi tha):** online booking calendar, FAQ page, reviews section, fees section

**Optional - client chahe to add kar sakte hain:**
- Fees / pricing section (current site par hai)
- Cookie consent banner (Google Maps embed cookies set karta hai, UK PECR)
- Online booking system / OpenEMR patient portal link
- Google reviews section (sirf asli reviews)

**PDF ke WordPress-specific points (MERN mein lagu nahi / backend+deployment ke time):**
- WordPress + Gutenberg, Fasthosts shared hosting → MERN ke liye Node hosting chahiye (VPS, jaise Hostinger VPS jo PDF mein future plan hai)
- Staging-first, scoped SFTP/DB user, serialization-safe migration → deployment ke time
- Training video, reception cheat-sheet, live handover, 30-day warranty → delivery ke time

---

## Content & photos
- Text clinic ki current site deephysio.co.uk se liya hai (PDF mein copy nahi thi), CAP-safe wording mein
- **Placeholder:** team ke naam, HCPC numbers, bio, photos; Facebook/Instagram links; privacy policy text
- Photos Unsplash (free, commercial use allowed) - `src/data/images.js`. Admin se upload/URL se badlo

## Folder structure
```
src/
  api/        axios.js (JWT interceptor) · endpoints.js (saari APIs + backend routes list) · mockDb.js
  context/    AuthContext (login, roles) · SiteContext (site + clinic + pages content)
  components/ TopBar, Navbar, Footer, MobileCallBar, FloatingActions, Reveal, ServiceCard,
              PageHeader, CrudPage, DocForm, MediaInput, ProtectedRoute, Logo ...
  layouts/    PublicLayout, AdminLayout
  pages/      Home, About, Services, ServiceDetail, Contact, Privacy, NotFound
  pages/admin Login, Dashboard, Enquiries, PageContent, ContentPages (Services/Team/Users),
              ClinicDetails, SiteSettings
  data/       seed.js (starting content) · images.js
```

## Backend se jodna (next step)
1. `src/api/endpoints.js` ke top par likhe routes Express mein banao
2. `.env` mein `VITE_USE_MOCK=false`
3. Backend port 5000 par - `vite.config.js` ka proxy `/api` wahan bhejega
