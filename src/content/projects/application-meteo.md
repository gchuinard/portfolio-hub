---
title: "WeatherNow"
titleEn: "WeatherNow"
description: "Application météo full-stack (API OpenWeatherMap) : backend FastAPI + PostgreSQL avec auth JWT et villes favorites, client Next.js typé, i18n, auto-déployée en continu sur le homelab."
descriptionEn: "Full-stack weather app (OpenWeatherMap API): FastAPI + PostgreSQL backend with JWT auth and saved cities, typed Next.js client, i18n, continuously auto-deployed to the homelab."
date: 2026-04-12
slug: "weather-now"
tags: [météo, full-stack, dashboard]
stack: [Next.js 16, TypeScript, shadcn/ui, FastAPI, Python 3.14, SQLAlchemy async, PostgreSQL, Docker]
image: "/images/application-meteo.svg"
status: ["updated"]
featured: true
repo: "https://github.com/gchuinard/gotyeah-meteo"
---

Application full-stack qui sépare proprement la couche d'agrégation
(backend FastAPI + httpx) du client (Next.js App Router + shadcn/ui).
Le backend masque la clé OpenWeatherMap, valide les réponses via des modèles
**Pydantic** et expose un schéma stable au front — le client ne dépend pas
de la forme de l'API externe.
**Bien plus qu'une façade d'API** : backend complet **PostgreSQL 16 +
SQLAlchemy async + Alembic**, **auth JWT avec rotation des refresh-tokens**,
**villes favorites** sauvegardées par utilisateur, **i18n** et back-office
admin.
Frontend **typé de bout en bout** : types TypeScript partagés, composants
domain-driven (`components/weather/`), thème dark/light cohérent via
shadcn/ui.
Packagée en **Docker Compose** (frontend + backend + base), endpoint `/docs`
Swagger auto-généré. **CI/CD GitHub Actions** qui auto-déploie en continu sur
le Raspberry Pi (pas d'URL publique pour l'instant).
