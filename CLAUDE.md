# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Sabahat Iqbal's personal portfolio site, served by **GitHub Pages from the `master` branch** at https://sabahatpk.github.io/. Pushing to `master` publishes publicly, so do work on the `redesign` branch and merge only when asked. Everything committed here is public.

It is a single static page ("Indigo & Paper" design, launched 1 Nov 2026) with no build step, package manager, framework, linter or tests. `.gitignore` lists `node_modules`/`package-lock.json`, but there is no `package.json`.

## Previewing

All asset paths are relative (`css/style.css`, `img/...`). Keep new paths relative, without a leading `/`. Preview with a local server from the repo root, e.g. `python -m http.server 8000 --bind 127.0.0.1`, then open http://localhost:8000. Opening `index.html` straight from disk mostly works, but the map needs the server (it fetches `data/countries-110m.json`).

## Structure

- `index.html` is the whole site, in this order: sticky `nav` (with a phone-only "Menu" button), the hero (`#top`), `#results` (Impact), `#experience`, `#projects` ("Learning by doing" cards), `#credentials` (Education + Credly badge images), `#writing`, `#contact` (form), and the footer.
- `css/style.css` holds all the styles. Colours and fonts are CSS variables on `:root` (`--indigo`, `--paper`, `--vermilion`, `--vermilion-text` for small text, and so on). The four Impact domains use the classes `.c-connect`, `.c-dpi`, `.c-climate` and `.c-enterprise`, which set `--c`. There are two breakpoints: 800px (single column) and 700px (phone menu).
- `js/main.js` loads in `<head>` without `defer` and adds the `js` class to `<html>`. CSS uses that class (with `.js-only`) to show parts that need JavaScript. It also runs the phone menu, the Experience "Show more" toggle, and a sessionStorage flag that clears the contact form after the Back button.
- `js/impact-map.js` draws the Impact world map with d3. The **callout text comes from the `<ol id="impacts">` list in `index.html`**, so edit the wording there. The country-to-item mapping is the `places` table in this file (ISO numeric code → item number, domain class, name, label position). Each country maps to one item. The list is visually hidden but read by screen readers, and it becomes visible if the map fails to load.
- `js/vendor/` holds self-hosted d3 7.9.0 and topojson-client 3.1.0. `data/countries-110m.json` is world-atlas 2.0.2. All three were SHA-256 checked against jsDelivr. Don't edit them; replace them with verified copies if you upgrade.
- `img/` holds the images the page uses (`D4Pak_boxplot_v1.jpg`, `badge-*.png` at 176×176). Many other files in it are unused leftovers from the old site, as are `data/*.csv`.

## Security rules for this site

- **Content Security Policy** is a `<meta>` tag in `<head>`: only same-origin scripts, styles from self plus Google Fonts, fonts from `fonts.gstatic.com`, images from self, and the form can only post to Formspree. So: **no inline `<script>`, no `style="..."` attributes, no `on...=` handlers, and no external scripts or images.** Put code in `js/` and styles in `css/style.css`. If a new external source is truly needed, update the CSP deliberately.
- In JavaScript, write text with `textContent` and build elements in code. Don't use `innerHTML` or `eval`.
- Links that open in a new tab use `target="_blank" rel="noopener noreferrer"`.
- No personal phone, personal email, home address or private links on the page. Contact goes through the form.

## Contact form

The form POSTs to Formspree (`https://formspree.io/myywvbrz`) with the fields `fname`, `email` and `message`, plus a hidden `_gotcha` honeypot (hidden by the `.hp` class) and `maxlength` limits. The Formspree form ID is designed to be public; no secrets are needed anywhere in this repo.

## Content

The approved copy and the to-do backlog live outside the repo in `Projects\Assets\content-outline.md`. Check it before changing any wording.
