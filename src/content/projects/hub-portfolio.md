---
title: "Hub Portfolio"
titleEn: "Portfolio Hub"
description: "Le site sur lequel vous êtes, hub personnel qui centralise projets, expériences, compétences et certifications, avec un thème terminal phosphore et i18n FR/EN."
descriptionEn: "The site you're looking at, personal hub centralizing projects, experiences, skills and certifications, with a phosphor terminal theme and FR/EN i18n."
date: 2025-11-12
slug: "hub-portfolio"
tags: ["portfolio", "multilingue"]
stack: ["Astro 5", "TailwindCSS 3", "MDX", "TypeScript"]
image: "/images/hub-portfolio.svg"
status: ["online", "in-progress"]
featured: true
live: "https://gautierchuinard.com"
repo: "https://github.com/gchuinard/portfolio-hub"
bodyEn: "Static site with a phosphor terminal aesthetic (green on black, Space Mono everywhere, no border-radius), **client-side FR/EN i18n** handled via `data-i18n` attributes and a keyboard toggle.\n\n### Content\n\n- **Astro Content Collections**, projects, certifications, experiences with Zod schemas.\n- **Adding a project**, create a markdown file.\n\n### Architecture\n\n- **No heavy JS framework**, everything is vanilla Astro + `type=\"module\"` scripts.\n- **Maintainability**, designed to stay maintainable over time.\n\nDesigned to stay maintainable, **auto-deployed by GitHub Actions (rsync) on a self-hosted Raspberry Pi**, behind Nginx Proxy Manager + Cloudflare, with a strict CSP injected at build time."
---

Site statique avec esthétique terminal phosphore (vert sur noir, Space Mono partout, pas de border-radius), **i18n FR/EN client-side** géré via attributs `data-i18n` et toggle clavier.

### Contenu

- **Astro Content Collections**, projets, certifications, expériences avec schémas Zod.
- **Ajouter un projet**, créer un fichier markdown.

### Architecture

- **Sans framework JS lourd**, tout est Astro vanilla + scripts `type="module"`.
- **Maintenabilité**, pensé pour rester maintenable dans le temps.

Pensé pour rester maintenable, **auto-déployé par GitHub Actions (rsync) sur un Raspberry Pi auto-hébergé**, derrière Nginx Proxy Manager + Cloudflare, avec une CSP stricte injectée au build.
