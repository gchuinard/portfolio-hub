---
title: "WeatherNow"
titleEn: "WeatherNow"
description: "Application météo full-stack (API OpenWeatherMap) : backend FastAPI + PostgreSQL avec auth JWT et villes favorites, client Next.js typé, i18n, déployée en ligne sur le homelab."
descriptionEn: "Full-stack weather app (OpenWeatherMap API): FastAPI + PostgreSQL backend with JWT auth and saved cities, typed Next.js client, i18n, deployed online on the homelab."
date: 2026-04-12
slug: "weather-now"
tags: [météo, full-stack, dashboard]
stack: [Next.js 16, TypeScript, shadcn/ui, FastAPI, Python 3.14, SQLAlchemy async, PostgreSQL, Docker]
image: "/images/application-meteo.svg"
status: ["online", "new"]
featured: true
live: "https://meteo.gautierchuinard.com"
repo: "https://github.com/gchuinard/gotyeah-meteo"
---

Application full-stack qui sépare proprement la couche d'agrégation (backend FastAPI + httpx) du client (Next.js App Router + shadcn/ui). Le backend masque la clé OpenWeatherMap, valide les réponses via des modèles **Pydantic** et expose un schéma stable au front, le client ne dépend pas de la forme de l'API externe.

### Backend complet

- **Bien plus qu'une façade d'API**, **PostgreSQL 16 + SQLAlchemy async + Alembic**.
- **Auth JWT**, avec rotation des refresh-tokens.
- **Villes favorites**, sauvegardées par utilisateur, **i18n** et back-office admin.

### Frontend typé

- **Typé de bout en bout**, types TypeScript partagés entre back et front.
- **Composants domain-driven**, regroupés dans `components/weather/`.
- **Thème dark/light** cohérent via shadcn/ui.

Packagée en **Docker Compose** (frontend + backend + base), endpoint `/docs` Swagger auto-généré. **CI/CD GitHub Actions** qui auto-déploie en continu sur le Raspberry Pi, **en ligne** sur `meteo.gautierchuinard.com` (API séparée sur `api-meteo`).
