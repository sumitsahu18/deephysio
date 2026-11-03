# DeePhysio – Backend (Express + MongoDB + JWT)

```
index.js        server start (DB connect, daily jobs: purane tokens / enquiries saaf)
app.js          Express app: security headers, CORS, CSRF, routes, /uploads
config.js       .env check (galat value = server start nahi hota)
db.js           MongoDB connection (NoSQL-injection protection)
models/         User, RefreshToken, Setting (site/clinic/pages), content (Service, TeamMember, Faq, Testimonial, Media, Enquiry)
routes/         auth, users, content, enquiries, media (uploads)
middleware/     auth (JWT + roles), security (helmet, rate-limit, CSRF), errors
lib/            tokens (JWT cookies), schemas (validation), mailer (SMTP), permissions (roles)
data/           starting content (npm run seed)
scripts/        seed.js, reset-admin.js, backup.sh
deploy/         PM2 + Nginx config
```

## Chalana
```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env  - phir values bharo
npm run seed              # pehli baar
npm run dev               # http://localhost:5000  (file badlo to apne aap restart)
```
| Command | Kaam |
|---|---|
| `npm run dev` | development (auto-restart) |
| `npm start` | production |
| `npm run seed` (`-- --reset`) | starting content + pehla admin (`--reset` = content dobara, users safe) |
| `npm run reset-admin` | `.env` ke ADMIN_EMAIL ka password ADMIN_PASSWORD par reset (lock bhi hat jata hai) |

## API
`GET /api/health` · auth: `POST /api/auth/login|refresh|logout|change-password`, `GET /api/auth/me` ·
`GET|PUT /api/site|clinic|pages` · `GET|POST|PUT|DELETE /api/services|team|faqs|testimonials` ·
`POST /api/enquiries` (public), `GET|PUT|DELETE /api/enquiries` · `GET|POST|PUT|DELETE /api/users` (admin) ·
`POST /api/uploads`, `GET /api/media`, `DELETE /api/media/:id`

⚠️ `lib/permissions.js` aur `data/seed.js` ki ek copy frontend mein bhi hai - roles badlo to dono jagah badlo.

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
1. **Staging pehle** (`staging.deephysio.co.uk`, password + noindex - `backend/deploy/nginx.conf` mein). Client ki **written approval** ke baad hi live.
2. **Database:** MongoDB Atlas (London/EU region, client ke account mein) → Database user **sirf `deephysio` database ka readWrite**, Network Access mein sirf VPS ka IP.
3. **VPS:** limited user (root nahi), SSH key login.
   ```bash
   # Node 20+, Nginx, PM2, certbot
   git clone ... /var/www/deephysio   # ya SFTP se upload (node_modules ke bina)
   cd /var/www/deephysio && npm run install:all && npm run build   # frontend build
   cd backend && cp .env.example .env && nano .env   # NODE_ENV=production, COOKIE_SECURE=true, TRUST_PROXY=true,
                                        # SERVE_CLIENT=true, CLIENT_ORIGINS=https://deephysio.co.uk,https://www.deephysio.co.uk
   npm run seed
   pm2 start deploy/ecosystem.config.cjs   # backend folder mein && pm2 save && pm2 startup
   sudo cp backend/deploy/nginx.conf /etc/nginx/sites-available/deephysio && sudo ln -s ... && sudo certbot --nginx
   ```
4. **Email:** Brevo / SendGrid / Fasthosts mailbox ke SMTP details `.env` mein; domain DNS mein **SPF + DKIM** (+ DMARC) records.
5. **Backup:** `backend/scripts/backup.sh` (mongodump + uploads, 14 din) - cron roz raat 2 baje. **Live karne se pehle purani site ka full backup** (PDF).
6. **Check:** https par mixed content nahi, staging ke URLs nahi (saare URLs relative / `.env` se).
7. Update: `git pull && npm run install:all && npm run build && pm2 restart deephysio`.


