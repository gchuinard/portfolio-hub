---
title: "Watch"
titleEn: "Watch"
description: "Dashboard de monitoring minimaliste pour homelab Raspberry Pi 5 : métriques système temps réel (CPU, température, RAM, disque), stats Docker par projet Compose, historique 24 h, PWA."
descriptionEn: "Minimalist monitoring dashboard for a Raspberry Pi 5 homelab: real-time system metrics (CPU, temperature, RAM, disk), Docker stats grouped by Compose project, 24 h history, PWA."
date: 2026-06-23
slug: "watch"
tags: ["monitoring", "homelab", "dashboard", "mcp"]
stack: ["Next.js 16", "React 19", "TypeScript", "systeminformation", "Docker", "GitHub Actions"]
image: "/images/watch.svg"
status: ["online", "new"]
repoPrivate: true
bodyEn: "**Minimalist** dashboard to monitor my Raspberry Pi 5 in real time, with an architecture deliberately reduced to a single service.\n\n### System metrics\n\n- **Real-time**, CPU %, SoC temperature, RAM, disk usage, in color-coded gauges.\n- **Sparklines**, visual history and *disk saturation forecast* via linear regression.\n- **1 h / 6 h / 24 h history**, from server-side memory buffers.\n\n### Docker & host\n\n- **Docker stats**, grouped by Compose project (collapsible), network/disk I/O.\n- **Host**, load average, host processes (outside Docker).\n- **Pi-specific**, throttling, voltage via `vcgencmd`.\n\n### Architecture & PWA\n\n- **Monolithic**, a single **Next.js** service (App Router) combining the UI and the API (`/api/metrics`), no separate backend.\n- **PWA**, network-first service worker (offline shell, API never cached), wall/kiosk mode and persisted preferences.\n\nDeployed on the homelab: the **GitHub Actions CI** cross-builds an arm64 image on GHCR then connects to the Pi over SSH to run `docker compose pull`. ⚠️ The API exposes sensitive system info → served **behind authentication** (NPM), never exposed raw to the Internet."
---

Dashboard **minimaliste** pour surveiller mon Raspberry Pi 5 en temps réel, avec une architecture volontairement réduite à un seul service.

### Métriques système

- **Temps réel**, CPU %, température SoC, RAM, remplissage disque, en jauges colorées.
- **Sparklines**, historique visuel et *prévision de saturation* du disque par régression linéaire.
- **Historique 1 h / 6 h / 24 h**, depuis des buffers mémoire côté serveur.

### Docker & hôte

- **Stats Docker**, regroupées par projet Compose (repliables), I/O réseau/disque.
- **Hôte**, load average, processus hôte (hors Docker).
- **Spécifique Pi**, throttling, voltage via `vcgencmd`.

### Architecture & PWA

- **Monolithique**, un seul service **Next.js** (App Router) qui combine l'UI et l'API (`/api/metrics`), pas de backend séparé.
- **PWA**, service worker network-first (shell hors-ligne, API jamais cachée), mode mur/kiosk et préférences persistées.

Déployé sur le homelab : la **CI GitHub Actions** cross-build une image arm64 sur GHCR puis se connecte au Pi en SSH pour `docker compose pull`. ⚠️ L'API expose des infos système sensibles → servie **derrière authentification** (NPM), jamais exposée brute à Internet.
