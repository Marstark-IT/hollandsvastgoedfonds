# Hollands Vastgoedfonds

Website for hollandsvastgoedfonds.com. Dutch first, English at `/en/`.

## Layout

```
frontend/                Next.js 16 (App Router, JSX, Tailwind 3), static export
  src/app/(site)/        Dutch pages (root layout, html lang="nl")
  src/app/(en)/en/       English pages (root layout, html lang="en")
  src/components/        layout/ sections/ forms/ ui/ views/
  src/data/              site.js (routes, company), content.js (all copy, nl + en)
  src/lib/               seo.js (metadata, JSON-LD), api.js, i18n.js
  public/api/lead.php    lead intake (PHP on Hostinger), leads.php CSV export
  public/.htaccess       HTTPS, redirects, security headers, caching
docs/                    competitor analysis
.github/workflows/       deploy on push to main
```

## Develop

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in frontend/out
```

## Deploy

Push to `main`. GitHub Actions builds the static export and rsyncs `frontend/out/`
to `~/domains/hollandsvastgoedfonds.com/public_html` on Hostinger over SSH.

Repository secrets: `SSH_HOST`, `SSH_PORT`, `SSH_USER`, `SSH_KEY` (private deploy key).

## Leads

The form posts to `/api/lead.php`. Each lead is stored in
`~/hollands_data/leads.sqlite` (outside the web root) and emailed to
`hello@hollandsvastgoedfonds.com`. Settings live in `~/hollands_data/config.php`:

```php
<?php return [
  'notify_to'  => 'hello@hollandsvastgoedfonds.com',
  'mail_from'  => 'noreply@hollandsvastgoedfonds.com',
  'export_key' => '<long random string>',
];
```

Download all leads as CSV: `https://hollandsvastgoedfonds.com/api/leads.php?key=<export_key>`.
