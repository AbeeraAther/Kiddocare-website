# KiddoCare — Childcare &amp; Early Learning Website

A modern, responsive marketing website for **KiddoCare**, a childcare and early-learning
centre for babies, toddlers and preschoolers.

Built with plain **HTML, CSS and vanilla JavaScript** — no frameworks, no build step.

## Sections

- Hero — "Where Little Minds Grow &amp; Big Smiles Begin!"
- About the centre + animated statistics
- Our Programs — Baby Care, Toddler Care, Creative Learning, Early Development
- Fun Activities — Art &amp; Craft, Story Time, Music &amp; Dance, Outdoor Play
- Why Choose Us
- Gallery — a continuous, seamless right-to-left photo strip
- Parent testimonials
- Call to action + contact form
- Footer

## Features

- Fully responsive (desktop, tablet, mobile)
- Soft pastel palette, rounded UI, hand-drawn SVG illustrations
- Gentle scroll-reveal, floating and hover animations
- Mobile navigation, image lightbox, animated counters
- Contact form wired for [Formspree](https://formspree.io/)
- Respects `prefers-reduced-motion`

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Project structure

```
index.html      Page markup
style.css       All styles
script.js       Interactions (nav, slider, reveal, form, lightbox)
images/         Photos and the gallery video
```

## Before going live

1. Add your Formspree form ID to the `<form action="...">` in `index.html`.
2. Replace the placeholder contact details, address and prices.
3. Swap the photos in `images/` for your own (keep the filenames).

## Deployment

The site is deployed with GitHub Pages via the workflow in
`.github/workflows/deploy.yml` — every push to `main` publishes the latest version.
