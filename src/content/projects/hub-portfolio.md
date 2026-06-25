---
title: "Hub Portfolio"
titleEn: "Portfolio Hub"
description: "Le site sur lequel vous êtes — hub personnel qui centralise projets, expériences, compétences et certifications, avec un thème terminal phosphore et i18n FR/EN."
descriptionEn: "The site you're looking at — personal hub centralizing projects, experiences, skills and certifications, with a phosphor terminal theme and FR/EN i18n."
date: 2025-11-12
slug: "hub-portfolio"
tags: ["portfolio", "multilingue"]
stack: ["Astro 5", "TailwindCSS 3", "MDX", "TypeScript"]
image: "/images/hub-portfolio.svg"
status: ["online", "in-progress"]
featured: true
live: "https://gautierchuinard.com"
repo: "https://github.com/gchuinard/portfolio-hub"
---

Site statique avec esthétique terminal phosphore (vert sur noir, Space Mono partout, pas de border-radius), **i18n FR/EN client-side** géré via attributs `data-i18n` et toggle clavier.

### Contenu

- **Astro Content Collections** — projets, certifications, expériences avec schémas Zod.
- **Ajouter un projet** — créer un fichier markdown.

### Architecture

- **Sans framework JS lourd** — tout est Astro vanilla + scripts `type="module"`.
- **Maintenabilité** — pensé pour rester maintenable dans le temps.

Pensé pour rester maintenable, **auto-déployé par GitHub Actions (rsync) sur un Raspberry Pi auto-hébergé**, derrière Nginx Proxy Manager + Cloudflare, avec une CSP stricte injectée au build.
