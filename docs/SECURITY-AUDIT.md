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
3. **Email spoofing:** DMARC is `p=none`, so anyone can send email that looks like it came from `hello@hollandsvastgoedfonds.com`. Once legitimate mail is confirmed to pass, raise it to `p=quarantine` in Hostinger DNS. Also add a CAA record (`0 issue "letsencrypt.org"`).
4. **Branch protection** on GitHub needs a paid plan. Four people have read access to the repo. That is fine, because there are no secrets in the repo.
5. The production deploy (commits b942f33, fb5c322) keeps every fix, re-tested live. One "SECURITY TEST" notification email reached hello@ on 24 Sep at 02:28 UTC. It came from our testing and can be deleted.

## Notes (not headline issues)

- `api/t.php` (analytics) accepts writes from anyone with no cap, so someone could fill the analytics database. It contains no personal data.
- The new CSP allows Google Tag Manager, Meta, Clarity and Bing. This is fine for marketing, but anyone with access to the GTM container can run code on the site, so keep that access tight.
- Hostinger's CDN can be bypassed by going to the origin IP directly. The security headers still apply there, because they come from `.htaccess`.
