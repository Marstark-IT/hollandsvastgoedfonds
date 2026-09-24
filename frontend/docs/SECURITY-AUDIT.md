# Security audit: hollandsvastgoedfonds.com

**Date:** 24 September 2026
**Scope:** the repo, the live site, the Hostinger account (shell access, no root) and the GitHub repo. There are no containers or servers of our own, so container and host-hardening checks do not apply.

## Verdict

**The site was in good shape. The two real problems were in the lead form backend, and both are fixed and live.**
A stranger cannot read your leads, break into the server through the site, or plant code in it. We confirmed this by actually trying the attacks. Reading the code alone was not enough.

## What we found

| # | Gap | Severity | Fixed? |
|---|-----|----------|--------|
| 1 | **Poisoned spreadsheet export.** Anyone filling in the form could put an Excel formula in their name or message. When you opened the leads CSV, clicking that cell could send other sellers' details to the attacker. This affected both `leads.php` and the new CSV backup. | Medium | Yes. Such cells are now exported as plain text. |
| 2 | **Spam limit could be bypassed.** The "6 leads per visitor per 10 minutes" limit trusted a header the visitor controls. It could be skipped, and it stored a fake IP as consent evidence. With the new confirmation email this would have let anyone send unlimited mail from your domain, containing their own text, to any inbox. | Medium | Yes. The real IP is used now, the confirmation email no longer repeats links or addresses, and it pauses above 30 leads per hour. |
| 3 | The export password was sent in the URL, which leaks it into logs and browser history. | Low | Yes. The browser now asks for it in a login prompt. |
| 4 | The site revealed its PHP version. The leads database could be read by other programs on the account. A PHP error log would have been publicly downloadable. | Low | Yes |
| 5 | The deploy pipeline trusted the server's identity on every run, used movable action versions and had no explicit permissions. | Low | Yes. The server key and action versions are pinned, and the pipeline has read-only permissions. |

**Already safe (tested):** only ports 80 and 443 are open. TLS is 1.2/1.3 only with a valid certificate until 22 Dec 2026. All security headers are present, including a CSP that blocks injected loaders. The form rejects cross-site submissions, SQL injection and bad input. The leads database is outside the website folder. No passwords or keys appear anywhere in the git history. All 100 dependencies have 0 known vulnerabilities and verified signatures. Every browser gets the same bytes, so there is no hidden malware. The new dashboard (`/api/stats.php`) needs the export password, escapes everything it shows, and ignores status changes sent from other websites. We re-tested this after the production deploy.

## Still needs you

1. **Second SSH key on the hosting account:** `shifatsikder@…sonsbidding` has full access to all five sites and to the leads. If Shifat should not have that, remove the key in hPanel → SSH Access.
2. **Shared account:** four WordPress sites (klaverhorst, levenlily, marstark, tamzidmolla) run as the same user as this site. If one WordPress plugin is hacked, the attacker can read the Hollands leads. For seller data, a separate hosting account is the right fix. At minimum, keep those WordPress sites and plugins updated.
3. **Email spoofing:** done on 24 Sep (see re-audit below): DMARC is now `p=quarantine`. A CAA record is still optional.
4. **Branch protection:** the repo is now public, so GitHub branch protection is free. Turn on "require a pull request" for `main` if more people get write access. There are no secrets in the repo.
5. The production deploy (commits b942f33, fb5c322) keeps every fix, re-tested live. One "SECURITY TEST" notification email reached hello@ on 24 Sep at 02:28 UTC. It came from our testing and can be deleted.

## Notes (not headline issues)

- `api/t.php` (analytics) accepts writes from anyone. This is fine, because it stores no personal data and is now capped at 200 hits per visit per day and 50,000 per day site-wide.
- The dashboard's own strict CSP is replaced by the site-wide one from `.htaccess`. Risk is low because every value is escaped. The one-line fix has been handed to the developer.
- The new CSP allows Google Tag Manager, Meta, Clarity and Bing. This is fine for marketing, but anyone with access to the GTM container can run code on the site, so keep that access tight.
- Hostinger's CDN can be bypassed by going to the origin IP directly. The security headers still apply there, because they come from `.htaccess`.


---

## Re-audit, 24 September 2026 (CRM API, unified form, mail)

**Verdict: safe to run.** The new CRM API holds up against every attack we tried. Two real gaps were found and fixed the same day, and both fixes were re-tested by attacking again.

| # | Finding | Severity | Fixed? |
|---|---|---|---|
| 1 | Lead emails were sent with plain PHP `mail()`: no DKIM signature, DMARC **fail**. Notifications and seller confirmations landed in spam, and with DMARC at `p=none` anyone could spoof hello@. | Medium | Yes. Mail now goes through the mailbox over authenticated SMTP (DKIM, SPF and DMARC all pass, lands in the inbox). DMARC raised to `p=quarantine` with reports to hello@. |
| 2 | Webhook URL check (SSRF protection) resolved the host once, then curl resolved it again (DNS-rebinding window, no IPv6 check), and any port was accepted (port probing through the test endpoint). Needs the CRM API key. | Low | Yes. Connections are pinned to the validated IPv4 address, port 443 only. |

**Already safe (tested live):** API refuses no key, empty key, partial key, key in the URL, Basic auth and direct `.php` access (401). SQL injection on every parameter is neutralised (integer casts, allow-lists, 422 on bad dates). Private, loopback, link-local, metadata (169.254.169.254) and encoded addresses (`2130706433`, `[::1]`) are refused as webhook targets. Webhooks are signed (HMAC-SHA256 with timestamp) and verified by a test receiver. `_crm.php` and `_mail.php` return 403. No CORS headers are reflected. Plain HTTP is redirected before PHP runs, even at the origin. TLS 1.0/1.1 refused. Every browser gets the same bytes. 0 vulnerable dependencies, 100 of 100 npm signatures verified. The workflow cannot be triggered by outside pull requests and uses pinned actions with read-only permissions. The handoff file with the live keys is git-ignored and `chmod 600`.

**Still needs you:**
1. Mark one "Nieuwe aanvraag" email as **Not spam** in webmail. The mailbox files mail it sends to itself as junk even though it now passes DKIM/DMARC.
2. The shared hosting account (point 2 above) is still the biggest risk: `marstark.com` and `tamzidmolla.com` run WordPress 6.9.9 (older than the 7.x on the other sites). Update them, or move Hollands to its own account.
3. Port 3306 (MySQL) is open on the shared server IP `77.37.52.88`. That is Hostinger's shared database server; this site has no MySQL database, so nothing of ours is exposed. Keep "Remote MySQL" in hPanel empty.
