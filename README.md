# ARV Realty — Website

A static website for **ARV Realty** (Silvassa, DNH) — a residential and commercial real estate developer. Built with plain HTML, CSS, and JavaScript. No framework, no build step.

**Live site:** _add your deployed URL here_

## Tech Stack

- **HTML / CSS / vanilla JS** — no build tools required
- [Swiper.js v11](https://swiperjs.com/) — hero and leaders carousels (CDN)
- [Font Awesome 6.5.2](https://fontawesome.com/) — icons (CDN)
- [Google Fonts](https://fonts.google.com/) — Poppins
- [Cloudinary](https://cloudinary.com/) — hosts and auto-optimizes background videos
- [Web3Forms](https://web3forms.com/) — handles the contact form submission (no backend needed)

## Project Structure

```
.
├── index.html      # all page markup
├── style.css       # all styling
├── script.js       # mobile menu, contact drawer, sliders, gallery modal, form submission
└── assets/         # images and logo used by the site
```

## Features

- Responsive layout (desktop → tablet → mobile)
- Hero and leaders carousels via Swiper
- Custom lightweight gallery modal for project photos (touch/swipe support, no dependency on Swiper's loop mode)
- Lazy-loaded background videos via `IntersectionObserver` — videos aren't downloaded until scrolled into view
- Contact form wired to Web3Forms, submitted via `fetch()` so the page never reloads
- Clickable phone (`tel:`), email (`mailto:`), and office address (opens Google Maps) in the contact info drawer
- Images optimized for web (resized + compressed) rather than served at raw camera resolution

## Running Locally

No build step or server required for basic viewing — just open `index.html` in a browser.

For local development with live reload, any static server works, e.g.:

```bash
npx serve .
```

or, with Python:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Setup Required Before Going Live

The contact form needs a Web3Forms access key before it will actually deliver emails:

1. Go to [web3forms.com](https://web3forms.com) and sign up
2. Copy the Access Key it gives you
3. In `index.html`, find the contact form and replace `YOUR_ACCESS_KEY` with your real key
4. Optionally replace `YOUR_DOMAIN` in the `redirect` hidden input, or remove that line entirely if you don't want a redirect after submission

## Deployment

This is a static site, so it deploys to any static host with no configuration:

- **Netlify** — drag and drop the project folder onto the dashboard
- **Vercel** — similar drag-and-drop or connect the GitHub repo for auto-deploys
- **Cloudflare Pages** — connect the repo, no build command needed
- **GitHub Pages** — push to this repo, then enable Pages in Settings → Pages → deploy from the `main` branch

## License

All rights reserved — content and branding belong to ARV Realty.
