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
Browser: `http://localhost:5173` · Admin: header ke last mein **Staff Login** button (ya `http://localhost:5173/admin/login`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@deephysio.co.uk | admin123 |
| Staff / Content Editor (reception) | editor@deephysio.co.uk | editor123 |

Login page par **Admin demo / Staff demo** button hain - click karo, details apne aap bhar jaati hain.

## v6: Fluid Glassmorphism design (HR ka "Style 2")
Poori public website naye look mein (admin panel same, sirf login page glass):
- **Peeche ki layer**: clinic photo + dheere chalte teal / purple / coral gradients (`components/GlassBackground.jsx`).
  Photo badalni ho to **Admin → Page content → Home → Website background photo**.
- **Frosted glass cards** (blur + halka white border + inner glow) - `index.css` mein `glass`, `glass-soft`,
  `glass-dark`, `glow-hover`, `grad-aurora`, `grad-sunset`, `grad-lagoon`, `btn-white`, `btn-glass`, `input-glass`.
- **Layout**: desktop par left glass sidebar (menu + aaj open/closed + phone + Staff Login), upar glass top bar
  (links, phone, social, Log In, **Book Appointment**). Mobile par left se slide hone wala glass drawer.
- **Home**: glass hero card photo ke upar → contact / notice / hours cards → services bento grid (gradient cards)
  → enquiry band → About / Home-visit cards → **Patient Testimonials**.
- **Testimonials**: Admin → Testimonials (staff bhi add/edit). Ek SAMPLE card hai - client ke asli Google reviews
  aate hi use delete karna (fake reviews UK CAP Code / ASA ke khilaf hain). List khali = section chhup jata hai.
- Glow hover sirf shadow/border badalta hai, cards hilte nahi. Header height fixed. `prefers-reduced-motion` par gradients ruk jaate hain.
- Fonts: headings **Outfit**, body **Roboto** (Google Fonts, `index.html`).

## v5 mein kya naya / fix hua
- **FAQ page** (`/faq`) - menu aur footer mein link. Sawal/jawab **Admin → FAQs** se add/edit (staff bhi), delete sirf Admin.
  FAQ page ka heading/intro/photo **Admin → Page content → FAQ** se.
- **Header ke last mein Staff Login** button (mobile menu mein bhi). Login ho to "Dashboard" dikhata hai.
- **Login page** Alka version jaisa: logo, "Back to website", Admin/Staff demo switch.
- **Admin panel**: sidebar mein logo + user card, top par Admin/Staff badge, View site, Logout. FAQs menu + dashboard card.
- **Header hilna fix**: pehle scroll par header 118px -> 80px chhota hota tha, usse page jhatke khata tha. Ab height fixed, sirf shadow.
- **Mobile par page side mein hilna fix**: slide animations page ko screen se chauda kar rahe the (`overflow-x-clip` wrapper).
  Header/footer/topbar ke hover "uchhalne" wale effects hataye, ab sirf colour badalta hai.
- Mobile menu ab page ke upar overlay hai (content ko neeche nahi dhakelta), khula ho to peeche scroll band.

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
| 2.3 Restricted Content Editor role | Editor: page copy, media, services, team, FAQs, hours/contact, enquiries. **Nahi kar sakta:** users, site settings, delete |
| 2.4 Data minimisation | Form mein sirf Name, Email/Phone, Preferred contact time, Message. Koi medical dropdown / pain slider nahi |
| 2.4 Enquiry delivery to clinic email | **Backend ka kaam**: Nodemailer + authenticated SMTP (Brevo/SendGrid/Gmail app password) |
| 3.1 Lightweight animations (scroll reveals, subtle hover) | `index.css` + `components/Reveal.jsx` (neeche list) |
| 3.1 Cross-browser, mobile-first | Tested 390px mobile aur 1440px desktop par, koi horizontal scroll nahi |

### Pages (6 + service pages)
Home · About & Team · Services · FAQ · 6 Service pages (Manipulation, Mobilisation, Electrotherapy,
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

**Hata diya (PDF mein nahi tha):** online booking calendar, reviews section, fees section  
**Client ke kehne par add kiya:** FAQ page

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
  components/ GlassBackground, SideNav, Navbar (glass top bar + mobile drawer), SectionTitle, Footer, MobileCallBar, FloatingActions, Reveal, ServiceCard,
              PageHeader, CrudPage, DocForm, MediaInput, ProtectedRoute, Logo ...
  layouts/    PublicLayout, AdminLayout
  pages/      Home, About, Services, ServiceDetail, FAQ, Contact, Privacy, NotFound
  pages/admin Login, Dashboard, Enquiries, PageContent, ContentPages (Services/Team/FAQs/Testimonials/Users),
              ClinicDetails, SiteSettings
  data/       seed.js (starting content) · images.js
```

## Backend se jodna (next step)
1. `src/api/endpoints.js` ke top par likhe routes Express mein banao
2. `.env` mein `VITE_USE_MOCK=false`
3. Backend port 5000 par - `vite.config.js` ka proxy `/api` wahan bhejega
