# Handoff: makminaret.com

**Read this first, then `MASTERPLAN.md` and `HANDOVER.md` (both local only, gitignored).**

The site is **built, deployed and live**. The build phase is over. The work
from here is **replacing placeholder content with real information**, one entry
at a time, and switching the site to `live` when that is finished.

---

## Where things stand

|            |                                                                             |
| ---------- | --------------------------------------------------------------------------- |
| Live       | https://makminaret.com (apex; `www` 308s to it)                             |
| Repo       | https://github.com/MR-checks/makminaret                                     |
| Host       | Vercel, project `makminaret`, region `fra1`, auto-deploys on push to `main` |
| DNS        | Natro. Apex `A → 216.198.79.1`, `www CNAME → …vercel-dns-017.com`           |
| Mode       | `SITE_MODE=unlisted` — looks finished, still `noindex, nofollow`            |
| Lighthouse | Performance 92, Accessibility 100                                           |
| Routes     | 44 internal URLs, all 200                                                   |

### Commands

```bash
npm run dev                       # local
npm run build                     # prebuild runs the placeholder gate + content validation
npm run lint                      # eslint + the design-constraint linter
npx tsx scripts/seed-content.ts   # regenerate scholarships, stories, articles, countries, services
npx tsx scripts/seed-fields.ts    # regenerate fields and their subject lists
npx tsx scripts/seed-pages.ts     # regenerate pages, courses, FAQs, offices
```

**The seed scripts wipe and rewrite their collections.** Once real content is
being edited through Keystatic, stop running them or you will overwrite it.

---

## The three site modes

`SITE_MODE` in Vercel env. Only `live` is indexable, and `live` fails the build
while any placeholder remains, so nothing unfinished can reach Google by
accident.

| Mode                     | Preview bar | Indexable | Placeholders                  |
| ------------------------ | ----------- | --------- | ----------------------------- |
| `showcase`               | shown       | no        | allowed                       |
| `unlisted` **← current** | hidden      | no        | allowed                       |
| `live`                   | hidden      | **yes**   | build **fails** if any remain |

To go live: empty `content/PLACEHOLDERS.md`, then
`npx vercel env add SITE_MODE production` → `live`.

---

## What is left, in priority order

### 1. `RESEND_API_KEY` is not set. Forms send nothing.

**This is the most important item.** Submissions return a reference code and a
result screen, and no email reaches anybody. Every enquiry is currently lost.

```bash
npx vercel env add RESEND_API_KEY production    # from resend.com → API Keys
npx vercel deploy --prod --yes
```

That alone makes forms work via Resend's test sender. For real delivery, verify
**`send.makminaret.com`** (a subdomain, so a deliverability problem cannot touch
the `info@` mailbox), add its MX/SPF/DKIM records at Natro, then set
`RESEND_FROM` to `Minaret <notify@send.makminaret.com>`. Add DMARC at
`_dmarc.makminaret.com` starting `p=none`.

**Never touch the apex `mx-01` / `mx-02.kurumsaleposta.com` records.** They
route `info@makminaret.com`, which is where lead notifications land.

### 2. Four confirmed values are still missing

In `content/settings.json`, listed under `placeholderFields`:

- `legalName` (confirm "MAK Minaret")
- `registrationNumber` (MERSİS)
- `officeAddress` (Ankara street address)
- `officePhone` (+90 landline)

These four unlock the footer, the utility bar and `/about/offices`. Cheapest
win available.

### 3. Content pass

`content/PLACEHOLDERS.md` is the checklist, regenerated on every build. Edit via
Keystatic, replace the text, untick **Placeholder**, save.

### 4. Keystatic GitHub mode

`/keystatic` cannot save on Vercel until four GitHub App variables exist. Visit
`https://makminaret.com/keystatic`, follow the setup flow, paste the values into
Vercel env, redeploy. The config switches itself automatically.

### 5. CI workflow commit is stuck

One local commit adds `.github/workflows/ci.yml`. Pushing it needs the
**`workflow`** scope on the GitHub token. Add it, then `git push`.

---

## Decisions that are settled. Do not undo them.

- **No university is named anywhere.** Only institutions with a signed written
  agreement may appear. The `universities` collection is intentionally empty.
- **No fabricated anything.** No invented team members, no stock photo captioned
  as a student, no unevidenced partner logos, no made-up counts or ratings.
  `team` and `partners` are intentionally empty and their pages say why.
- **Nothing that expires.** No live rates, no countdowns, no dated deadlines, no
  growing counts. Costs are static USD bands with a `reviewedOn` stamp.
- **Subjects, not university programmes.** `/programs` is a subject finder.
  Subjects not pursued in Ghana are off the list, as is anything that does not
  transfer home (law being the clearest case).
- **No internal language in content.** No spec references, no section numbers,
  no notes to the developer. Unwritten copy reads "Enter the confirmed text
  here."
- **Design constraints are enforced mechanically** by
  `scripts/check-constraints.mjs`. Fix violations, never the linter.
- Gold is a dark-surface accent only (fails AA on light).
- Commits are authored **MR-checks**, no co-author trailer.

## Traps that already bit once

- **Content must be traced into the bundle.** `outputFileTracingIncludes` in
  `next.config.ts` ships `/content`. Without it every collection reads empty in
  production while working perfectly locally.
- **CSP and static rendering collide.** The root layout calls `headers()` so
  Next.js stamps the nonce onto its scripts. Remove that and `strict-dynamic`
  blocks every chunk and nothing hydrates.
- **`NextIntlClientProvider` cannot be removed.** The client `Link` reads
  routing config from it; removing it 500s every route.
- **DNS changes take an hour.** Router and ISP caches hold the old record long
  after the authority updates. Check with `dig @ns1.natrohost.com` before
  concluding anything is broken.
