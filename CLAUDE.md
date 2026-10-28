# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Sabahat Iqbal's personal portfolio site, served by **GitHub Pages from the `master` branch** at https://sabahatpk.github.io/. Pushing to `master` publishes publicly, so do redesign work on the `redesign` branch and merge only when asked.

It is a single static page with no build step, package manager, linter or tests. `.gitignore` lists `node_modules`/`package-lock.json`, but there is no `package.json`.

## Previewing

Several asset paths are root-absolute (`/css/style.css`, `/img/...`). They resolve on GitHub Pages, but they break when `index.html` is opened directly from disk (`file://`), and the page then loads with no custom CSS. Preview through a local server from the repo root, e.g. `python -m http.server 8000`, then open http://localhost:8000.

## Structure

- `index.html` is the whole site: navbar, welcome banner, `#about`, `#projects` (a CSS-grid of `.project-tile` cards linking to externally hosted projects, with Bootstrap badges as tags), `#contact`, and a footer with social icons.
- `css/style.css` holds custom styles layered on top of Bootstrap 4. The accent colour `tomato` is hard-coded in many places, not stored in a variable.
- `js/main.js` (jQuery) does smooth scrolling for `#` links, with a 75px offset for the sticky navbar, and drives the "Back To Top" button (`#myBtn`, called through an inline `onclick="topFunction()"`).
- `img/` holds project thumbnails, referenced by `.project-tile` images. Some files in it are not used by the page (certificates, `DDP.jpg`, etc.).
- `data/` (CSV/GeoJSON for Pakistan and microfinance) is **not referenced by the site**. It is leftover from earlier data-viz experiments.
- `indexOLD.html` and `css/styleOLD.css` are old versions that nothing links to.

## External dependencies (all loaded from CDNs in `<head>`)

- jQuery 3.4.1, Popper 1.16.0, Bootstrap 4.4.1 (CSS + JS), with SRI hashes
- Font Awesome is loaded twice: a kit script (`kit.fontawesome.com/09503a8969.js`, Font Awesome 5 class names such as `fab`/`fas` are used in the markup) and the Font Awesome 4.7 CSS
- Google Fonts: Spartan (body) and Quicksand

## Contact form

The form POSTs directly to Formspree (`https://formspree.io/myywvbrz`) with fields `fname`, `email`, `message`. The Formspree form ID is designed to be public; no secrets are needed anywhere in this repo. Everything committed here is public.
