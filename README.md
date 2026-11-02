# DeePhysio – Website + Admin (MERN: React + Express + MongoDB)

Client RFP (DeephysiNew Website Proposal) ke hisaab se: glass design website, ek hi admin dashboard,
MongoDB database, JWT login (httpOnly cookies), restricted Staff role.

```
src/        React (Vite + Tailwind v4)  - website + admin
server/     Express API + MongoDB (Mongoose)
deploy/     PM2 + Nginx config (Hostinger VPS)
```

---

## 1. Local par chalana (Antigravity / VS Code)

**Chahiye:** Node.js 20+ aur MongoDB - ya to apne PC par MongoDB Community, ya **MongoDB Atlas** ka free cluster (link copy karo).

```bash
npm install
copy .env.example .env        # Mac/Linux: cp .env.example .env
```

`.env` kholo aur bharo:
- `MONGODB_URI` - local: `mongodb://127.0.0.1:27017/deephysio` ya Atlas ka link
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` - do alag random values:
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` - pehla admin (min 10 characters, letters + numbers)

```bash
npm run seed       # database mein starting content + pehla admin (dobara chalane se data nahi mitta)
npm run dev:all    # website (5173) + API (5000) dono saath
```

Website: http://localhost:5173 · Admin: http://localhost:5173/admin/login (wahi email/password jo .env mein diya).
Seed ke baad `.env` se `ADMIN_PASSWORD` hata do.

> Bina server ke sirf design dekhna ho: `.env` mein `VITE_USE_MOCK=true`, phir `npm run dev`
> (demo login admin@deephysio.co.uk / admin123 - data sirf browser mein).

| Command | Kaam |
|---|---|
| `npm run dev:all` | website + API (development) |
| `npm run dev` / `npm run server` | alag-alag |
| `npm run seed` (`-- --reset`) | starting content / pehla admin (`--reset` = content dobara, users safe) |
| `npm run build` | production website build (`dist/`) |
| `npm start` | production server |

## 2. Login & users
- **Ek hi login page** (`/admin/login`) - Admin aur Staff dono email + password se. Role database se aata hai.
- Admin → **General Settings → Users & roles**: staff ka account banao (naam, email, password, role), band karo (Active hata do -> turant logout), password reset karo.
- Har user: sidebar mein apne naam par click → **My account** → password badlo (baaki devices se logout).
- Staff (Content Editor) - PDF 2.3: page text, images, services, team, contact & hours, enquiries.
  **Nahi:** theme, general settings, logo, users, delete. Ye server par bhi enforced hai (sirf menu chhupana nahi).

## 3. Security (kya-kya laga hai)
| Cheez | Kaise |
|---|---|
| Passwords | bcrypt (cost 12), min 10 chars letters + numbers |
| JWT | access 15 min + refresh 7 din, **httpOnly + SameSite=Strict + Secure** cookies (JS token padh hi nahi sakta) |
| Refresh | har baar naya token (rotation); purana dobara use hua = chori -> us user ke saare sessions band |
| Logout / password / role change / account band | turant saare purane login invalid (tokenVersion) |
| Brute force | login rate-limit (10 / 15 min per IP) + 5 galat password = account 15 min lock |
| CSRF | SameSite=Strict + custom header + Origin check |
| Input | har route par zod validation; extra fields hat jaate hain; NoSQL injection blocked (`sanitizeFilter`) |
| Headers | helmet: CSP, HSTS, nosniff, frame-ancestors none, referrer policy |
| CORS | sirf `CLIENT_ORIGINS` |
| Uploads | sirf JPG/PNG/WebP/GIF, max 5 MB, file ke andar check (sharp), dobara encode (EXIF/GPS + chhupa code hat jata hai), random naam, folder listing nahi |
| Enquiry form | validation + honeypot + rate-limit (5 / ghanta per IP); sirf Name, Email, Phone, Preferred time, Message (PDF 2.4) |
| Enquiry email | authenticated SMTP, sirf plain text (form ka text code nahi ban sakta) |
| Data retention | `ENQUIRY_RETENTION_DAYS` se purani enquiries apne aap delete (UK GDPR) |
| Errors | production mein andar ki details user ko nahi dikhti |
| Secrets | sirf `.env` (Git / zip mein kabhi nahi) |

Tested: 64 API security tests + browser end-to-end tests (login, roles, upload, enquiry, refresh, logout).

## 4. Deployment - Hostinger VPS (PDF 2.1 ke hisaab se)
1. **Staging pehle** (`staging.deephysio.co.uk`, password + noindex - `deploy/nginx.conf` mein). Client ki **written approval** ke baad hi live.
2. **Database:** MongoDB Atlas (London/EU region, client ke account mein) → Database user **sirf `deephysio` database ka readWrite**, Network Access mein sirf VPS ka IP.
3. **VPS:** limited user (root nahi), SSH key login.
   ```bash
   # Node 20+, Nginx, PM2, certbot
   git clone ... /var/www/deephysio   # ya SFTP se upload (node_modules ke bina)
   cd /var/www/deephysio && npm ci && npm run build
   cp .env.example .env && nano .env   # NODE_ENV=production, COOKIE_SECURE=true, TRUST_PROXY=true,
                                        # SERVE_CLIENT=true, CLIENT_ORIGINS=https://deephysio.co.uk,https://www.deephysio.co.uk
   npm run seed
   pm2 start deploy/ecosystem.config.cjs && pm2 save && pm2 startup
   sudo cp deploy/nginx.conf /etc/nginx/sites-available/deephysio && sudo ln -s ... && sudo certbot --nginx
   ```
4. **Email:** Brevo / SendGrid / Fasthosts mailbox ke SMTP details `.env` mein; domain DNS mein **SPF + DKIM** (+ DMARC) records.
5. **Backup:** `server/scripts/backup.sh` (mongodump + uploads, 14 din) - cron roz raat 2 baje. **Live karne se pehle purani site ka full backup** (PDF).
6. **Check:** https par mixed content nahi, staging ke URLs nahi (saare URLs relative / `.env` se).
7. Update: `git pull && npm ci && npm run build && pm2 restart deephysio`.

## 5. Client / HR se chahiye
Written approval (MERN) · VPS + limited SSH user · MongoDB Atlas (client account) · DNS access (SSL, staging, SPF/DKIM) ·
SMTP details + enquiry inbox · Admin/Staff ke naam & emails · asli content (logo, practitioners, HCPC no., photos, real reviews,
Privacy/Terms text, hours, Maps link) · purani site ka backup/access · enquiries kitne din rakhni hain ·
handover (cheat-sheet, video, live session, 30-din warranty) ki dates.

---

## Changelog

## v12: Phone numbers General Settings mein
- Admin → **General Settings → Phone & WhatsApp**: Phone number (as displayed), Phone for click-to-call, WhatsApp number - teeno ek jagah.
- Contact & Enquiries → Contact details mein ab sirf email, address, opening hours, map (staff bhi badal sakta hai).
- Phone number sirf Admin badal sakta hai (server par bhi check). Galat click-to-call format par samjhane wala message.

## v11: WhatsApp number dynamic
- Admin → General Settings → **WhatsApp number** (country code ke saath, jaise 447737610615) ab text ke roop mein bhi dikhta hai:
  Home ka contact card, Contact page, Footer + green WhatsApp button (tooltip). Sab jagah click = WhatsApp chat.
- Admin mein type karte hi preview: "Shown on the website as +44 7737 610615". Khali chhodo = har jagah se hat jata hai.

## v10: Backend + database + JWT login
- `server/` Express + MongoDB: saara content (site, clinic, pages, services, team, FAQs, testimonials, media, enquiries, users) database mein.
- Login page: Admin/Staff demo hata diya - ek hi email + password login; staff accounts admin banata hai.
- My account (password change), Users mein Active/Disabled + password reset.
- Security upar table mein. Production mein ek hi Express server website + API + uploads deta hai (Nginx ke peeche).

## v9: Logo admin se badlo
- **Admin → General Settings → Site details → Logo**: upload / library se chuno / link, Remove = default logo wapas.
  Save karte hi header, footer, admin sidebar aur login page par naya logo. (Media / Images mein bhi "Logo" slot - sirf Admin.)
- Staff logo nahi badal sakta (global setting). Logo "In use" rehta hai, library se delete nahi hota.
- Best: transparent PNG, light colour, chauda (wide) shape.

## v8: Poora responsive (280px se 1440px tak test kiya)
- **Header**: chhoti screen par "Book Appointment" -> "Book" -> sirf icon, logo bhi chhota - menu (☰) button kabhi screen se bahar nahi katta.
- Saari grids mein `grid-cols-1` base (pehle lambe content se grid screen se chaudi ho jaati thi).
- Hero / page headings fluid size (`clamp`) + lamba shabd toot jata hai (jaise BIOMECHANICAL).
- Mobile par cards / padding chhote, neeche ka Call/Enquire bar ek line mein.
- **Admin**: dashboard se "Manage the website" hataya (sections sidebar mein hain) - uski jagah poori **Latest enquiries**
  (naam, email, phone, preferred time, message, date). Mobile par admin lists table ki jagah cards, tabs wrap hote hain,
  mobile header mein logo.
- Test: har width par koi button / text screen ya apne box se bahar nahi (Playwright).

## v7: Sidebar hata, saaf header, ONE admin dashboard (client brief ke hisaab se)
**Website**
- Landing page se **left sidebar hata diya** - ab full-width glass layout.
- **Header**: 3 saaf hisse, beech mein barabar jagah -> `[Logo]  [Home · About & Team · Services ▾ · FAQ · Contact]  [Log In] [Book Appointment]`.
  Mobile par header ke neeche slide-down glass menu (sidebar nahi). Height fixed - scroll par nahi hilta.
- Enquiry form: **Name, Email, Phone, Preferred contact time, Message** (email ya phone mein se kam se kam ek zaroori).
  Koi medical dropdown / pain-scale nahi.

**Admin - ek hi dashboard (glass look mein), sidebar:**
| Section | Andar kya hai | Staff? |
|---|---|---|
| Dashboard | ginti, sab sections ke shortcut, latest enquiries, Preview website | ✅ |
| Homepage & Pages | Homepage text/buttons/photos · Testimonials · FAQ · FAQ page text · Privacy Policy | ✅ |
| About & Team | Team members (photo, qualification, HCPC/CSP) · About page text | ✅ |
| Services | Services add/edit (delete sirf admin) · Services page text | ✅ |
| Contact & Enquiries | Enquiries (name, email, phone, time, message, delete) · Phone/email/address/hours/Google Map · Contact page text | ✅ |
| Media / Images | Website ki har photo yahin se **Replace** · Upload · jo photo use nahi ho rahi wo Delete | ✅ (delete ❌) |
| Theme Settings | Primary, secondary, accent, button, button text, background, text colour - colour picker + live preview + Reset | ❌ admin only |
| General Settings | Clinic/company details, footer text, social links · Users & roles | ❌ admin only |

- Har form par **Save changes**, upar **Preview website** button.
- Theme colours CSS variables hain (`index.css` `@theme` + `SiteContext.applyTheme`) - save karte hi poori website + admin par lagte hain.
- Upload: sirf JPG/PNG/WebP/GIF, max 8 MB. Demo mode mein photo browser mein hi chhoti (1600px) ho jaati hai.
- Admin ka glass look: `index.css` ke end mein `.admin-glass` - purane admin tokens (card, input, btn-primary...) glass mein remap.

**Agle step (abhi nahi kiya):** Express + MongoDB backend (routes `src/api/endpoints.js` mein likhe hain), SMTP enquiry email,
Terms & Conditions page, Home par "Why Choose Us" section, hero buttons ka text/link admin se.

## v6: Fluid Glassmorphism design (HR ka "Style 2")
Poori public website naye look mein (admin panel same, sirf login page glass):
- **Peeche ki layer**: clinic photo + dheere chalte teal / purple / coral gradients (`components/GlassBackground.jsx`).
  Photo badalni ho to **Admin → Page content → Home → Website background photo**.
- **Frosted glass cards** (blur + halka white border + inner glow) - `index.css` mein `glass`, `glass-soft`,
  `glass-dark`, `glow-hover`, `grad-aurora`, `grad-sunset`, `grad-lagoon`, `btn-white`, `btn-glass`, `input-glass`.
- ~~Layout: left glass sidebar~~ (v7 mein hata diya - ab full-width header).
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
  components/ GlassBackground, Navbar (glass header + mobile menu), SectionTitle, MediaInput, MediaPicker, Footer, MobileCallBar, FloatingActions, Reveal, ServiceCard,
              PageHeader, CrudPage, DocForm, MediaInput, ProtectedRoute, Logo ...
  layouts/    PublicLayout, AdminLayout
  pages/      Home, About, Services, ServiceDetail, FAQ, Contact, Privacy, NotFound
  pages/admin Login, Dashboard, Sections (Homepage/About/Services/Contact/General tabs), Media, Theme,
              Enquiries, PageContent, ContentPages (Services/Team/FAQs/Testimonials/Users),
              ClinicDetails, SiteSettings
  data/       seed.js (starting content) · images.js
```

## Backend se jodna (next step)
1. `src/api/endpoints.js` ke top par likhe routes Express mein banao
2. `.env` mein `VITE_USE_MOCK=false`
3. Backend port 5000 par - `vite.config.js` ka proxy `/api` wahan bhejega
