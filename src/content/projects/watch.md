---
title: "Watch"
titleEn: "Watch"
description: "Dashboard de monitoring minimaliste pour homelab Raspberry Pi 5 : métriques système temps réel (CPU, température, RAM, disque), stats Docker par projet Compose, historique 24 h, PWA."
descriptionEn: "Minimalist monitoring dashboard for a Raspberry Pi 5 homelab: real-time system metrics (CPU, temperature, RAM, disk), Docker stats grouped by Compose project, 24 h history, PWA."
date: 2026-06-23
slug: "watch"
tags: [monitoring, homelab, dashboard]
stack: [Next.js 16, React 19, TypeScript, systeminformation, Docker, GitHub Actions]
image: "/images/watch.svg"
status: ["online", "new"]
featured: false
repoPrivate: true
---

Dashboard **minimaliste** pour surveiller mon Raspberry Pi 5 en temps réel :
CPU %, température SoC, RAM, remplissage disque — jauges colorées, **sparklines**
et *prévision de saturation* du disque par régression linéaire.
**Stats Docker** regroupées par projet Compose (repliables), I/O réseau/disque,
load average, processus hôte (hors Docker) et infos spécifiques Pi (throttling,
voltage via `vcgencmd`). **Historique 1 h / 6 h / 24 h** depuis des buffers
mémoire côté serveur.
Architecture volontairement **monolithique** : un seul service **Next.js** (App
Router) qui combine l'UI et l'API (`/api/metrics`) — pas de backend séparé.
**PWA** avec service worker network-first (shell hors-ligne, API jamais cachée),
mode mur/kiosk et préférences persistées.
Déployé sur le homelab : la **CI GitHub Actions** cross-build une image arm64 sur
GHCR puis se connecte au Pi en SSH pour `docker compose pull`. ⚠️ L'API expose des
infos système sensibles → servie **derrière authentification** (NPM), jamais
exposée brute à Internet.
