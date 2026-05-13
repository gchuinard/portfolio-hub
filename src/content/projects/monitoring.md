---
title: "GotYeah Monitor"
titleEn: "GotYeah Monitor"
description: "Plateforme de monitoring d'uptime auto-hébergée : checks HTTP toutes les 10 min, latence, expiration SSL, comptes utilisateurs avec auth complète. Déployée en prod sur Raspberry Pi."
descriptionEn: "Self-hosted uptime monitoring platform: HTTP checks every 10 min, latency, SSL expiry, full user auth. Live in production on a Raspberry Pi."
date: 2026-04-12
slug: "gotyeah-monitor"
tags: [python, fastapi, sveltekit, typescript, mysql, docker, raspberry-pi, monitoring, ci-cd]
stack: [FastAPI, Python 3.14, SQLAlchemy async, Alembic, MySQL 8, SvelteKit 2, Tailwind v4, Docker, GitHub Actions]
status: ["online", "beta"]
featured: true
demo: "https://monitor.gautierchuinard.com/"
repo: "https://github.com/gchuinard/gotyeah-monitor"
---

Outil de monitoring d'uptime conçu pour répondre à un besoin concret :
surveiller mes propres services auto-hébergés sans dépendre d'un SaaS
payant.
Le **worker** vérifie chaque URL toutes les 10 min, mesure la latence,
contrôle le code de statut attendu et suit l'expiration des certificats
**SSL**. L'historique est conservé sur 7 jours glissants en **MySQL** via
SQLAlchemy async.
**Authentification complète maison** : inscription, vérification email,
connexion JWT, réinitialisation de mot de passe, changement d'email par
token, interface d'administration.
Stack séparée — API **FastAPI** + frontend **SvelteKit** — orchestrée en
**Docker Compose**, avec environnements dev/prod distincts. **CI/CD GitHub
Actions** auto-déploie sur le Raspberry Pi à chaque push sur `main`
(SSH → git pull → docker compose up).
