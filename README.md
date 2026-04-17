# Orion Solutions — Website (2026 Rebuild)

Production-ready Next.js 15 website for [orionesolutions.com](https://www.orionesolutions.com).

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Prisma · MySQL · Resend · Linode (Akamai Cloud)

---

## Prerequisites

Install these before you begin:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 20 LTS or higher | [nodejs.org](https://nodejs.org) |
| Git | any | [git-scm.com](https://git-scm.com) |
| MySQL | 8.0+ | Local, [PlanetScale](https://planetscale.com), [Railway](https://railway.app), or [AWS RDS](https://aws.amazon.com/rds/) |

---

## Quick Start

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

Open `.env.local` and fill in your values (see [Environment Variables](#environment-variables) below).

### 4. Set up the database

```bash
# Push the schema to your MySQL database
npm run db:push

# Generate the Prisma client
npm run db:generate

# (Optional) Seed with sample data
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site is running.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in each value:

### Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string — `mysql://user:password@host:3306/orion_db` |

### Email (Resend)

Sign up free at [resend.com](https://resend.com). Required for contact form and newsletter emails.

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Your Resend API key — starts with `re_` |
| `CONTACT_EMAIL` | Email address that receives contact form submissions |

### reCAPTCHA (optional in dev)

Sign up at [google.com/recaptcha](https://www.google.com/recaptcha). If not set, reCAPTCHA is skipped in development.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Public key (used in the browser) |
| `RECAPTCHA_SECRET_KEY` | Secret key (used server-side) |

### Other (optional)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://www.orionesolutions.com` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID (`G-XXXXXXXXXX`) |
| `ADMIN_IP_ALLOWLIST` | Comma-separated IPs allowed to access `/admin` routes. Leave blank to disable. |

---

## Database Setup

This project uses **Prisma ORM** with **MySQL**.

### Hosted MySQL options (recommended)

| Provider | Free tier | Notes |
|----------|-----------|-------|
| Linode MySQL (same server) | — | Run MySQL on the same Linode — simplest setup |
| [Railway](https://railway.app) | Yes | Simple managed MySQL, good for dev |
| [PlanetScale](https://planetscale.com) | Yes | Serverless MySQL |
| AWS RDS / Azure MySQL | Paid | For multi-server production setups |

### Connection string format

```
DATABASE_URL=mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME
```

For PlanetScale add `?sslaccept=strict` at the end.

### Database commands

```bash
npm run db:push          # Create/update tables from schema (no migration files)
npm run db:migrate       # Create a migration file and apply it
npm run db:generate      # Regenerate Prisma client after schema changes
npm run db:seed          # Populate database with sample data
npm run db:studio        # Open Prisma Studio (visual DB browser)
npm run db:reset         # Drop and recreate all tables (destructive!)
```

---

## Project Structure

```
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home page
│   ├── about/                  # About, Culture, Certifications, CSR
│   ├── services/               # Services index + [slug] detail pages
│   ├── industries/             # Industries index + [slug] detail pages
│   ├── portfolio/              # Portfolio index + [slug] case studies
│   ├── blog/                   # Blog index + [slug] post pages
│   ├── resources/              # Resources index + [slug] detail pages
│   ├── contact/                # Contact page with form
│   ├── careers/                # Careers page
│   ├── partners/               # Partners & certifications
│   ├── privacy-policy/         # Privacy policy
│   ├── terms-of-service/       # Terms of service
│   ├── cookie-policy/          # Cookie policy
│   ├── sitemap-page/           # HTML sitemap
│   └── api/
│       ├── contact/            # Contact form submission endpoint
│       └── newsletter/         # Subscribe / confirm / unsubscribe
│
├── components/
│   ├── layout/                 # Header, Footer
│   ├── sections/               # Hero, Stats, Features, CTA, etc.
│   ├── ui/                     # Button, Card, Badge, Container, etc.
│   ├── forms/                  # ContactForm
│   └── seo/                    # JSON-LD structured data components
│
├── lib/
│   ├── data/                   # Static content (services, blog, portfolio, etc.)
│   ├── constants.ts            # Site config, nav links, footer links
│   ├── db.ts                   # Prisma client singleton
│   ├── seo.ts                  # generateMetadata helper
│   ├── utils.ts                # cn, formatDate, slugify, etc.
│   └── validations.ts          # Zod schemas
│
├── prisma/
│   ├── schema.prisma           # Database schema (MySQL)
│   └── seed.ts                 # Database seed script
│
├── public/
│   └── assets/images/          # Static images (team, blog, portfolio, etc.)
│
├── middleware.ts               # Admin IP allowlist + request ID header
├── next.config.ts              # Security headers, image optimization
├── tailwind.config.ts          # Brand colors, custom tokens
└── .env.example                # Environment variable template
```

---

## Updating Content

All site content lives in `lib/data/` as TypeScript files — no CMS required.

| File | What it controls |
|------|-----------------|
| `lib/constants.ts` | Site name, phone, address, social links, nav/footer links |
| `lib/data/services.ts` | 6 service pages |
| `lib/data/industries.ts` | 8 industry pages |
| `lib/data/portfolio.ts` | Case studies / portfolio items |
| `lib/data/blog.ts` | Blog posts |
| `lib/data/team.ts` | Leadership team + site stats |
| `lib/data/partners.ts` | Technology partners + certifications |
| `lib/data/resources.ts` | Whitepapers, guides, webinars |

Edit the relevant file, save, and the page updates instantly in dev (hot reload).

---

## Build for Production

```bash
npm run build    # Build and generate sitemap
npm run start    # Start the production server
```

---

## Deploying to Linode

Recommended setup: **Linode Nanode or Shared CPU** running Ubuntu 22.04 LTS, with Nginx as a reverse proxy and PM2 as the process manager.

---

### Step 1 — Create the Linode

1. Log in to [cloud.linode.com](https://cloud.linode.com)
2. Click **Create → Linode**
3. Choose:
   - **Image:** Ubuntu 22.04 LTS
   - **Region:** closest to your users
   - **Plan:** Nanode 1GB (minimum) or Shared CPU 2GB (recommended for production)
4. Set a strong root password, then click **Create Linode**

---

### Step 2 — Initial server setup

SSH into your new server:

```bash
ssh root@YOUR_LINODE_IP
```

Create a deploy user and install dependencies:

```bash
# Create a non-root user
adduser deploy
usermod -aG sudo deploy

# Switch to deploy user
su - deploy

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx

# Install MySQL
sudo apt-get install -y mysql-server
sudo mysql_secure_installation
```

---

### Step 3 — Create MySQL database

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

### Step 4 — Clone and build the app

```bash
cd /var/www
sudo git clone https://github.com/devopsca85/Orion-Web-2026.git orion-web
sudo chown -R deploy:deploy /var/www/orion-web
cd /var/www/orion-web

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
nano .env.local   # fill in all values (see Environment Variables section)

# Set up the database
npm run db:push
npm run db:generate
npm run db:seed   # optional

# Build the app
npm run build
```

---

### Step 5 — Run with PM2

```bash
# Start the app
pm2 start npm --name "orion-web" -- start

# Save PM2 config so it restarts on reboot
pm2 save
pm2 startup   # follow the printed command to enable auto-start
```

Check it's running:

```bash
pm2 status
pm2 logs orion-web
```

The app is now running on port **3000**.

---

### Step 6 — Configure Nginx reverse proxy

```bash
sudo nano /etc/nginx/sites-available/orion-web
```

Paste this config (replace `www.orionesolutions.com` with your domain):

```nginx
server {
    listen 80;
    server_name www.orionesolutions.com orionesolutions.com;

    # Security
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Static assets — long cache
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /assets/ {
        root /var/www/orion-web/public;
        add_header Cache-Control "public, max-age=31536000";
    }

    # Everything else to Next.js
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

Enable and test:

```bash
sudo ln -s /etc/nginx/sites-available/orion-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 7 — SSL certificate (HTTPS)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d www.orionesolutions.com -d orionesolutions.com
```

Certbot auto-renews. Verify renewal works:

```bash
sudo certbot renew --dry-run
```

---

### Step 8 — Point your domain to Linode

In your DNS provider (or Linode DNS Manager), set:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `YOUR_LINODE_IP` |
| A | `www` | `YOUR_LINODE_IP` |

Wait for DNS to propagate (up to 30 min), then visit `https://www.orionesolutions.com`.

---

### Deploying updates

```bash
cd /var/www/orion-web
git pull origin main
npm install
npm run build
pm2 restart orion-web
```

Or set up a simple deploy script:

```bash
# /var/www/orion-web/deploy.sh
#!/bin/bash
set -e
cd /var/www/orion-web
git pull origin main
npm install --production=false
npm run build
pm2 restart orion-web
echo "Deploy complete"
```

```bash
chmod +x deploy.sh
./deploy.sh   # run this whenever you push changes
```

---

## Adding Real Images

Place images in `public/assets/images/` following this structure:

```
public/assets/images/
├── team/           # e.g. john-smith.jpg
├── blog/           # e.g. cloud-migration.jpg
├── portfolio/      # e.g. fintech-platform.jpg
├── partners/       # e.g. aws.svg, azure.svg
└── resources/      # e.g. cloud-guide-cover.jpg
```

Image paths in the data files already reference these locations (e.g. `/assets/images/team/john.jpg`).

---

## Security Features

- Content Security Policy (CSP) headers
- HSTS, X-Frame-Options, X-Content-Type-Options
- Rate limiting on contact form API (3 req/min per IP)
- reCAPTCHA v3 on contact form
- IP allowlist for `/admin` routes (via `ADMIN_IP_ALLOWLIST`)
- Input validation with Zod on all API routes
- Unique request ID on every response (`X-Request-ID`)

---

## Need Help?

Open an issue at [github.com/devopsca85/Orion-Web-2026/issues](https://github.com/devopsca85/Orion-Web-2026/issues) or email [support@orionesolutions.com](mailto:support@orionesolutions.com).
