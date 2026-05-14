---
title: "Helldashboard"
titleEn: "Helldashboard"
description: "Dashboard temps réel de la guerre galactique d'Helldivers 2, thématisé « Ministère de la Paix ». Carte SVG Voronoi, métriques agrégées, refresh 60s."
descriptionEn: "Real-time galactic war dashboard for Helldivers 2, themed as the Ministry of Truth. Voronoi SVG map, live metrics, 60s refresh."
date: 2026-04-08
slug: "helldashboard"
tags: [dataviz, gaming, temps-réel]
stack: [React 19, TypeScript, Vite 6, Tailwind 4, d3-delaunay]
status: ["online", "new"]
featured: true
repo: "https://github.com/gchuinard/gotyeah-helldashboard"
---

Projet **front pur**, fait pour le plaisir et pour explorer la dataviz
réactive sur un dataset vivant.
Le dashboard agrège trois sources API (communautaire v2, helldivers2.dev v1,
endpoint raw `/WarSeason/801/Status`) et les fusionne dans un hook
`useWarData` unique pour exposer un état cohérent au reste de l'app.
**Carte galactique interactive** générée via **d3-delaunay** (algorithme
Voronoi sur les positions des planètes), code couleur par faction, popup de
détail avec biome et progression de libération.
Esthétique militaire poussée — polices Orbitron + Share Tech Mono, code
couleur par faction (Terminiides verts, Automates rouges, Illuminés
violets), barre de statut façon HUD. Refresh automatique toutes les 60s.
