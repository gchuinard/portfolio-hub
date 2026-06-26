---
title: "GotYeah Monitor"
titleEn: "GotYeah Monitor"
description: "Plateforme de monitoring d'uptime auto-hébergée : checks HTTP toutes les 10 min, latence, expiration SSL, comptes utilisateurs avec auth complète. Déployée en prod sur Raspberry Pi."
descriptionEn: "Self-hosted uptime monitoring platform: HTTP checks every 10 min, latency, SSL expiry, full user auth. Live in production on a Raspberry Pi."
date: 2026-04-12
slug: "gotyeah-monitor"
tags: ["monitoring", "uptime"]
stack: ["FastAPI", "Python 3.14", "SQLAlchemy async", "Alembic", "MySQL 8", "SvelteKit 2", "Tailwind v4", "Docker", "GitHub Actions"]
image: "/images/monitoring.svg"
status: ["online", "beta"]
featured: true
live: "https://monitor.gautierchuinard.com/"
repo: "https://github.com/gchuinard/gotyeah-monitor"
bodyEn: "Uptime monitoring tool built to address a concrete need: keeping an eye on my own self-hosted services without relying on a paid SaaS.\n\n### Monitoring\n\n- **Periodic worker**, checks each URL every 10 min, measures latency and verifies the expected status code.\n- **SSL expiry**, tracks the expiration of **SSL** certificates.\n- **History**, kept over a rolling 7-day window in **MySQL** via SQLAlchemy async.\n\n### In-house authentication\n\n- **Full accounts**, sign-up, email verification, JWT login.\n- **Account management**, password reset, token-based email change.\n- **Administration**, dedicated admin interface.\n\n### Architecture\n\n- **Separate stack**, **FastAPI** API + **SvelteKit** frontend, orchestrated with **Docker Compose**, with distinct dev/prod environments.\n- **GitHub Actions CI/CD**, auto-deploys to the Raspberry Pi on every push to `main` (SSH → git pull → docker compose up)."
---

Outil de monitoring d'uptime conçu pour répondre à un besoin concret : surveiller mes propres services auto-hébergés sans dépendre d'un SaaS payant.

### Surveillance

- **Worker périodique**, vérifie chaque URL toutes les 10 min, mesure la latence et contrôle le code de statut attendu.
- **Expiration SSL**, suit l'expiration des certificats **SSL**.
- **Historique**, conservé sur 7 jours glissants en **MySQL** via SQLAlchemy async.

### Authentification maison

- **Comptes complets**, inscription, vérification email, connexion JWT.
- **Gestion du compte**, réinitialisation de mot de passe, changement d'email par token.
- **Administration**, interface d'administration dédiée.

### Architecture

- **Stack séparée**, API **FastAPI** + frontend **SvelteKit**, orchestrée en **Docker Compose**, avec environnements dev/prod distincts.
- **CI/CD GitHub Actions**, auto-déploie sur le Raspberry Pi à chaque push sur `main` (SSH → git pull → docker compose up).
