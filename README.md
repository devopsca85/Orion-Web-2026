# Orion eSolutions — Website (2026 Rebuild).

Production-ready Next.js 15 website for [orionesolutions.com](https://www.orionesolutions.com), with a built-in CMS admin panel for daily content management.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Prisma · MySQL · NextAuth v5 · Resend · Linode (Akamai Cloud)

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20 LTS or higher |
| Git | any |
| MySQL | 8.0+ |

---

## Quick Start (Local Development)

### 1. Clone the repo

```bash
git clone https://github.com/devopsca85/Orion-Web-2026.git
cd Orion-Web-2026
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` — see [Environment Variables](#environment-variables) below.
The minimum required for local dev:

```env
DATABASE_URL=mysql://orion:password@localhost:3306/orion_db
AUTH_SECRET=any-random-string-at-least-32-chars
AUTH_URL=http://localhost:3000
```

### 4. Set up the database

```bash
npx prisma db push       # Create tables from schema
npx prisma generate      # Generate Prisma client types
npx prisma db seed       # Seed sample data + create admin user
```

### 5. Run the development server

```bash
npm run dev
```

- **Website:** [http://localhost:3000](http://localhost:3000)
- **Admin panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Admin CMS Panel

The site includes a full content management system at `/admin`.

### Default login credentials

| Field | Value |
|-------|-------|
| URL | `/admin` |
| Email | `admin@orionesolutions.com` |
| Password | `Admin@2026!` |

> **Change the default password immediately** after first login via Users → Edit.

### Admin features

| Section | What you can do |
|---------|-----------------|
| **Dashboard** | Live stats: total posts, portfolio items, new contacts, subscribers |
| **Blog Posts** | Create, edit, delete posts · Draft / Published / Archived status · SEO fields |
| **Portfolio** | Case studies with client, industry, metrics, technologies |
| **Team** | Manage team member profiles, bio, LinkedIn, sort order |
| **Services** | Edit service page content, features, benefits, technologies |
| **Resources** | Whitepapers, guides, webinars — gated or open access |
| **Contacts** | View form submissions, update status, add internal notes |
| **Subscribers** | Newsletter subscriber list |
| **Job Applications** | View all career applications with status tracking |
| **Users** | Create/edit users, assign roles, activate/deactivate accounts |
| **Media** | Browse all images in `/public/assets/images`, copy paths |

### User roles

| Role | Permissions |
|------|-------------|
| `SUPER_ADMIN` | Full access — manage everything including other admins |
| `ADMIN` | Full content + user management |
| `EDITOR` | All content CRUD, view contacts/subscribers, no user management |
| `AUTHOR` | Create and edit own blog posts only |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

### Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string — `mysql://user:password@host:3306/orion_db` |
| `AUTH_SECRET` | Random secret for NextAuth JWT signing — generate with `openssl rand -base64 32` |
| `AUTH_URL` | Your site's full URL — `https://www.orionesolutions.com` (or `http://localhost:3000` for dev) |

### Email (Resend)

Sign up free at [resend.com](https://resend.com). Required for contact form and newsletter emails.

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Your Resend API key — starts with `re_` |
| `CONTACT_EMAIL` | Email address that receives contact form submissions |

### reCAPTCHA (optional)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Public key (used in the browser) |
| `RECAPTCHA_SECRET_KEY` | Secret key (used server-side) |

### Other (optional)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://www.orionesolutions.com` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID (`G-XXXXXXXXXX`) |

---

## Project Structure

```
├── app/
│   ├── (public)/                   # Public-facing website
│   │   ├── layout.tsx              # Wraps Header + Footer
│   │   ├── page.tsx                # Home page
│   │   ├── about/                  # About, Culture, Certifications, CSR
│   │   ├── services/               # Services index + [slug] detail pages
│   │   ├── industries/             # Industries index + [slug] detail pages
│   │   ├── portfolio/              # Portfolio index + [slug] case studies
│   │   ├── blog/                   # Blog index + [slug] post pages
│   │   ├── resources/              # Resources index + [slug] detail pages
│   │   ├── contact/                # Contact page with form
│   │   ├── careers/                # Careers page
│   │   ├── partners/               # Partners & certifications
│   │   └── (legal pages)           # Privacy, Terms, Cookie policy, Sitemap
│   │
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin shell (sidebar + auth guard)
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── blog/               # Blog CRUD
│   │   │   ├── portfolio/          # Portfolio CRUD
│   │   │   ├── team/               # Team CRUD
│   │   │   ├── services/           # Services CRUD
│   │   │   ├── resources/          # Resources CRUD
│   │   │   ├── contacts/           # Contact submissions viewer
│   │   │   ├── subscribers/        # Newsletter subscribers
│   │   │   ├── applications/       # Job applications viewer
│   │   │   ├── users/              # User & role management
│   │   │   └── media/              # Image browser
│   │   └── (auth)/admin/login/     # Login page (no sidebar)
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth v5 handler
│   │   ├── contact/                # Contact form submission
│   │   └── newsletter/             # Subscribe / confirm / unsubscribe
│   │
│   ├── layout.tsx                  # Root layout (html/body shell only)
│   └── globals.css
│
├── components/
│   ├── admin/                      # Sidebar, AdminTopBar, DeleteForm, MediaGrid
│   ├── layout/                     # Header, Footer
│   ├── sections/                   # Hero, Stats, Features, CTA, etc.
│   ├── ui/                         # Button, Card, Badge, Container, etc.
│   └── seo/                        # JSON-LD structured data
│
├── lib/
│   ├── admin/
│   │   ├── actions.ts              # Server actions — all content CRUD
│   │   └── auth-actions.ts         # Sign-in / sign-out server actions
│   ├── data/                       # Static fallback content (services, blog, etc.)
│   ├── auth.ts                     # NextAuth v5 config (JWT + credentials)
│   ├── prisma.ts                   # Prisma client singleton
│   ├── constants.ts                # Site config, nav/footer links
│   ├── seo.ts                      # generateMetadata helper
│   └── utils.ts                    # cn, formatDate, etc.
│
├── prisma/
│   ├── schema.prisma               # Full DB schema (MySQL)
│   └── seed.ts                     # Seed script — imports static data + creates admin user
│
├── public/
│   ├── assets/
│   │   ├── images/                 # Organised images (team/, blog/, portfolio/, etc.)
│   │   └── uploads/                # WordPress image dump (source for import script)
│
├── scripts/
│   └── import-wp-images.sh         # WordPress image migration script
│
├── middleware.ts                   # Auth-based route protection for /admin
├── next-auth.d.ts                  # NextAuth type extensions (id, role on session)
├── next.config.ts                  # Security headers, image optimisation
├── tailwind.config.ts              # Brand colours, custom tokens
└── .env.example                    # Environment variable template
```

---

## Database Schema

The Prisma schema covers all content and transactional data:

| Model | Purpose |
|-------|---------|
| `User` | Admin panel users with roles |
| `BlogPost` | Blog posts with author, status, tags, SEO |
| `Author` | Blog post authors |
| `PortfolioItem` | Case studies / portfolio |
| `Service` | Service page content |
| `TeamMember` | Leadership profiles |
| `Resource` | Whitepapers, guides, webinars |
| `ContactSubmission` | Contact form leads |
| `NewsletterSubscriber` | Email subscribers |
| `JobApplication` | Career applications |
| `SiteStat` | Homepage statistics |

### Database commands

```bash
npm run db:push          # Create/update tables (no migration files)
npm run db:migrate       # Create migration file and apply
npm run db:generate      # Regenerate Prisma client after schema changes
npm run db:seed          # Seed sample data + default admin user
npm run db:studio        # Open Prisma Studio (visual DB browser)
npm run db:reset         # Drop and recreate all tables (destructive!)
```

---

## WordPress Image Migration

If migrating from WordPress, place the `wp-content/uploads` folder contents into:

```
public/assets/uploads/
```

Then run the import script (on the server):

```bash
bash scripts/import-wp-images.sh
```

**What the script does:**
1. Creates all required subfolders under `public/assets/images/`
2. Bulk-copies **all** images from `uploads/` → `images/` preserving folder structure
3. Resolves specific filenames expected by the Next.js code (logo, team photos, blog images, etc.) by keyword-matching

Any files the script can't match are reported as `✗ not found` — rename those files to include the expected keyword and re-run.

---

## Build for Production

```bash
npm run build    # TypeScript check + build + generate sitemap
npm run start    # Start the production server (port 3000)
```

---

## Deploying to Linode

Recommended setup: **Ubuntu 22.04 LTS** with Nginx (reverse proxy) and PM2 (process manager).

### Step 1 — Create the Linode

1. Log in to [cloud.linode.com](https://cloud.linode.com)
2. **Create → Linode** → Ubuntu 22.04 LTS
3. Plan: Nanode 1GB (minimum) or Shared CPU 2GB (recommended for production)

---

### Step 2 — Server setup

```bash
ssh root@YOUR_LINODE_IP

# Create deploy user
adduser deploy && usermod -aG sudo deploy
su - deploy

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2, Nginx, MySQL
sudo npm install -g pm2
sudo apt-get install -y nginx mysql-server
sudo mysql_secure_installation
```

---

### Step 3 — MySQL database

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE orion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'orion'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON orion_db.* TO 'orion'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### Step 4 — Clone, configure and build

```bash
cd /var/www
sudo git clone https://github.com/devopsca85/Orion-Web-2026.git orion-web
sudo chown -R deploy:deploy /var/www/orion-web
cd /var/www/orion-web

npm install

# Create environment file
cp .env.example .env.local
nano .env.local
```

Minimum required values in `.env.local`:

```env
DATABASE_URL=mysql://orion:STRONG_PASSWORD_HERE@localhost:3306/orion_db
AUTH_SECRET=<output of: openssl rand -base64 32>
AUTH_URL=https://your-domain.com
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=support@orionesolutions.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

```bash
# Database setup
npx prisma generate
npx prisma db push
npx prisma db seed       # Creates tables + default admin user

# Build
npm run build
```

---

### Step 5 — Run with PM2

```bash
pm2 start npm --name "orion-web" -- start
pm2 save
pm2 startup              # Follow the printed command to enable auto-start on reboot
```

---

### Step 6 — Nginx reverse proxy

```bash
sudo nano /etc/nginx/sites-available/orion-web
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /assets/ {
        root /var/www/orion-web/public;
        add_header Cache-Control "public, max-age=31536000";
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/orion-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 7 — SSL (HTTPS)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo certbot renew --dry-run    # Verify auto-renewal works
```

---

### Step 8 — DNS records

| Type | Name | Value |
|------|------|-------|
| A | `@` | `YOUR_LINODE_IP` |
| A | `www` | `YOUR_LINODE_IP` |

---

### Deploying updates

```bash
cd /var/www/orion-web
git pull origin develop
npm install
npx prisma generate          # Only needed if schema changed
npx prisma db push           # Only needed if schema changed
npm run build
pm2 restart orion-web
```

Or use the included deploy script:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Security Features

- NextAuth v5 JWT authentication for admin panel
- WordPress-style role-based access control (SUPER_ADMIN / ADMIN / EDITOR / AUTHOR)
- Content Security Policy (CSP) headers on all routes
- HSTS, X-Frame-Options, X-Content-Type-Options
- Server Actions with role guards — no direct API exposure for admin mutations
- Input validation with Zod on all public API routes
- Unique request ID on every response (`X-Request-ID`)
- reCAPTCHA v3 support on contact form

---

## Need Help?

Open an issue at [github.com/devopsca85/Orion-Web-2026/issues](https://github.com/devopsca85/Orion-Web-2026/issues) or email [support@orionesolutions.com](mailto:support@orionesolutions.com).
