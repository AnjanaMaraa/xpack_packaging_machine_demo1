# DigiMaraa Packaging Machinery — website

Modern, responsive, conversion-focused marketing website for
**DigiMaraa Packaging Machinery** (packaging machinery industry, Coimbatore /
Tamil Nadu). Built from scratch with **vanilla HTML5, CSS3 and JavaScript** —
no frameworks, no build system, no npm dependencies.

Primary conversion goal: **WhatsApp enquiries and calls.**

---

## Run the site locally

Just open `index.html` in a browser. Everything works over the local
`file://` protocol because contact data is loaded from plain JavaScript files,
all assets are referenced with relative paths, and there are no API calls.

For the most realistic experience (and to avoid browser caching surprises),
serve the folder with any static server, for example:

```bash
# Python
python -m http.server 8000

# Node (npx, no install)
npx serve .
```

Then open `http://localhost:8000`.

---

## Project structure

```text
.
├── index.html                 # whole single-page site (semantic HTML)
├── robots.txt                 # replace Sitemap URL when domain is confirmed
├── sitemap.xml                # replace URLs when domain is confirmed
├── README.md
└── assets/
    ├── css/style.css          # design tokens + all styling (vanilla CSS3)
    ├── js/config.js           # SINGLE SOURCE OF TRUTH for business details
    ├── js/main.js             # nav, WhatsApp links, FAQ, form, reveal, year
    ├── js/products.js         # editable product categories used by the grid
    ├── images/                # local image assets (see attribution below)
    └── icons/favicon.svg
```

---

## Replace the hero image

1. Prepare a **wide / landscape** image (ideally 1920×1080 or similar ratio).
2. Save it as `assets/images/hero-packaging-placeholder.jpg` (keep the exact
   filename), or
3. Save it anywhere under `assets/images/` and update one line in
   `assets/css/style.css`:

   ```css
   :root {
     /* HERO IMAGE — change the value below to swap the hero picture */
     --hero-image: url("../images/hero-packaging-placeholder.jpg");
   }
   ```

The hero layout, overlay, floating cards and content are independent of the
image, so only the image file needs to change.

---

## Update business contact details

All business contact details live in **`assets/js/config.js`**:

```js
const SITE_CONFIG = {
  brandName: "DigiMaraa Packaging Machinery",
  address: { line1, line2, city, country },
  contacts: { enquiries, official, newBusiness, career },
  developer: { name: "DigiMaraa Technologies", website: "https://digimaraa.com" },
  seo: { siteUrl, defaultTitle, defaultDescription, locale }
};
```

Edit the values there, save, and reload. **Never hardcode contact details in
`index.html`.** Main.js reads this config and populates:

- phone (display text, `tel:` link and `wa.me` WhatsApp number are derived
  from `contacts.enquiries`),
- email and address blocks,
- WhatsApp enquiry URLs (`buildWhatsAppUrl()` in config.js),
- footer contact columns,
- canonical / Open Graph URLs when `seo.siteUrl` is set.

WhatsApp number formatting is kept separate from display formatting:
`SITE_CONFIG.waNumber` (digits only, country code) is used for `wa.me` links,
`SITE_CONFIG.telNumber` for `tel:` links.

If JavaScript fails to load, a `noscript` banner tells the visitor that
contact details and WhatsApp links require JavaScript.

---

## Configure the production domain

Currently the site ships with **placeholder URLs only**.

1. In `assets/js/config.js` set `seo.siteUrl` to the production URL
   (e.g. `"https://www.example.com/packaging-machinery"`). On load, main.js
   syncs the value into the `canonical` link and Open Graph / Twitter URL and
   image tags.
2. Replace the `https://www.example.com/packaging-machinery/` values in the
   `index.html` head (canonical + og:url) if you prefer not to rely on JS.
3. Update `robots.txt` and `sitemap.xml` with the final domain.
4. Update `assets/images/hero-packaging-placeholder.jpg` to a production hero.

Do not submit the sitemap until the domain is final.

---

## Edit product categories

Product cards are rendered from **`assets/js/products.js`** (`PRODUCTS` array).
Each entry has an `enquiry` message used to build a product-specific WhatsApp
link. Edit titles, descriptions, images or enquiry text there. The six entries
are treated as **configurable enquiry categories**, not confirmed in-stock
products — confirm availability with the business before making any claims.

New products are also appended to the "I am interested in" dropdown in the
contact form automatically.

---

## Services and testimonials — editable draft content

- **Services** (`#services` in index.html): the list is marked "draft". Only
  publish an item as an active offering once confirmed by the business.
- **Testimonials** (`#testimonials` in index.html): clearly labelled
  placeholders with *no invented names, ratings, review counts or companies*.
  Replace the placeholder cards with approved customer testimonials before
  going live, and only add review/FAQ structured data once the content is
  verified.

---

## Key configurable elements

| What                                        | Where                                     |
| ------------------------------------------- | ----------------------------------------- |
| Brand name, address, contacts, developer    | `assets/js/config.js`                     |
| WhatsApp number used for all wa.me links    | derived from `contacts.enquiries`         |
| Hero image                                  | `assets/images/hero-packaging-placeholder.jpg` or `--hero-image` in `style.css` |
| Product cards                               | `assets/js/products.js`                   |
| FAQ answers                                 | `index.html` `#faqs` accordion            |
| Service + testimonial copy                  | `index.html` sections                     |
| Canonical / OG / sitemap / robots URLs      | `config.js` + head of `index.html` + `sitemap.xml` + `robots.txt` |

---

## Contact form behaviour

The form performs client-side validation only and has **no backend**. On
submit it opens WhatsApp with the enquiry pre-filled so the visitor can send it
directly. To use a real backend / form service instead, wire up the submit
handler in `assets/js/main.js` (`initContactForm`) and update the note beside
the submit button.

---

## Image attribution

All images were downloaded for this project and are hosted locally under
`assets/images/`. Sources and licences:

| File                              | Source | License |
| --------------------------------- | ------ | ------- |
| `hero-packaging-placeholder.jpg`  | Pexels — photo 18631419 (glass bottles on automated production line, Lipik factory). https://www.pexels.com/photo/glass-bottles-on-production-line-at-plant-18631419/ | Pexels License — free to use, no attribution required |
| `packaging-machine-1.jpg`         | Pexels — photo 4820840 (industrial sealing machine packaging coffee bag). https://www.pexels.com/photo/industrial-sealing-machine-packaging-coffee-bag-4820840/ | Pexels License |
| `packaging-machine-2.jpg`         | Pexels — photo 4820837 (man operating a sealing machine at a coffee roasting factory). https://www.pexels.com/photo/man-in-coveralls-operates-sealing-machine-at-coffee-roasting-factory-4820837/ | Pexels License |
| `packaging-machine-3.jpg`         | Pexels — photo 5532716 (automated system labelling beverage cans). https://www.pexels.com/photo/automated-system-labeling-beverage-cans-in-a-modern-brewery-5532716/ | Pexels License |
| `packaging-machine-4.jpg`         | Pexels — photo 5532717 (automated canning line in a brewery). https://www.pexels.com/photo/automated-canning-line-in-a-brewery-5532717/ | Pexels License |
| `packaging-automation.jpg`        | Pexels — photo 4820844 (coffee bag sealed by an industrial machine). https://www.pexels.com/photo/close-up-of-a-coffee-bag-being-sealed-by-an-industrial-machine-4820844/ | Pexels License |
| `installation-service.jpg`        | Pexels — photo 4820843 (person operating a coffee packaging machine). https://www.pexels.com/photo/man-in-uniform-operating-a-coffee-packaging-machine-4820843/ | Pexels License |
| `packaging-facility.jpg`          | Pexels — photo 18631420 (automated machinery on a factory production line). https://www.pexels.com/photo/machinery-in-factory-18631420/ | Pexels License |

The Pexels License allows free commercial use without attribution. Links above
are kept for traceability. The favicon and logo mark are original SVGs created
for this project.

**Hero image note:** the hero is a placeholder that will be replaced with a
DigiMaraa-specific photograph before launch (see "Replace the hero image").

---

## Brand & copy guardrails

- This is an original design inspired by an industrial packaging-industry
  reference. No competitor brands, logos or content are used.
- No ratings, review counts, experience years, customer names, certifications
  or manufacturer claims are presented as genuine unless provided.
- No unverified service, warranty, price or delivery claims are made.

Website developed by **DigiMaraa Technologies** — https://digimaraa.com