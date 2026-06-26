---
title: "Helldashboard"
titleEn: "Helldashboard"
description: "Dashboard temps réel de la guerre galactique d'Helldivers 2, thématisé « Ministère de la Paix ». Carte SVG Voronoi, métriques agrégées, refresh 60s."
descriptionEn: "Real-time galactic war dashboard for Helldivers 2, themed as the Ministry of Peace. Voronoi SVG map, live metrics, 60s refresh."
date: 2026-04-08
slug: "helldashboard"
tags: ["dataviz", "gaming", "temps-réel"]
stack: ["React 19", "TypeScript", "Vite 6", "Tailwind 4", "d3-delaunay"]
image: "/images/helldashboard.svg"
status: ["new"]
featured: true
repo: "https://github.com/gchuinard/gotyeah-helldashboard"
bodyEn: "A **pure front-end** project, built for fun and to explore reactive dataviz on a living dataset.\n\n### Data\n\n- **Three API sources**, community v2, helldivers2.dev v1, raw endpoint `/WarSeason/801/Status`.\n- **Single `useWarData` hook**, merges the sources to expose a consistent state to the rest of the app.\n- **Automatic refresh**, every 60s.\n\n### Galactic map\n\n- **Interactive map** generated via **d3-delaunay** (Voronoi algorithm over planet positions).\n- **Color coding by faction**, detail popup with biome and liberation progress.\n\n### Military aesthetic\n\n- **Fonts**, Orbitron + Share Tech Mono.\n- **Color coding by faction**, Super Earth cyan, Terminids green, Automatons red, Illuminate purple.\n- **Status bar** HUD-style.\n\n> Front-end built and functional (CI lint + build), **not deployed yet**, it\n> runs locally (`npm run dev`). Going live is possible with a single push (Pages/Pi)."
---

Projet **front pur**, fait pour le plaisir et pour explorer la dataviz réactive sur un dataset vivant.

### Données

- **Trois sources API**, communautaire v2, helldivers2.dev v1, endpoint raw `/WarSeason/801/Status`.
- **Hook `useWarData` unique**, fusionne les sources pour exposer un état cohérent au reste de l'app.
- **Refresh automatique**, toutes les 60s.

### Carte galactique

- **Carte interactive** générée via **d3-delaunay** (algorithme Voronoi sur les positions des planètes).
- **Code couleur par faction**, popup de détail avec biome et progression de libération.

### Esthétique militaire

- **Polices**, Orbitron + Share Tech Mono.
- **Code couleur par faction**, Super Terre cyan, Terminides verts, Automates rouges, Illuminés violets.
- **Barre de statut** façon HUD.

> Front buildé et fonctionnel (CI lint + build), **pas encore déployé**, il
> tourne en local (`npm run dev`). Mise en ligne possible en un push (Pages/Pi).
