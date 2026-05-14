---
title: "WeatherNow"
titleEn: "WeatherNow"
description: "Application météo full-stack basée sur l'API OpenWeatherMap : backend FastAPI qui sert un client Next.js typé, packagée en Docker Compose pour démarrer en une commande."
descriptionEn: "Full-stack weather app powered by OpenWeatherMap: FastAPI backend serving a typed Next.js client, packaged with Docker Compose for one-command setup."
date: 2026-04-12
slug: "weather-now"
tags: [météo, full-stack]
stack: [Next.js 16, TypeScript, Tailwind, shadcn/ui, FastAPI, Python 3.13, httpx]
status: ["in-progress"]
featured: true
repo: "https://github.com/gchuinard/gotyeah-meteo"
---

Application full-stack qui sépare proprement la couche d'agrégation
(backend FastAPI + httpx) du client (Next.js App Router + shadcn/ui).
Le backend masque la clé OpenWeatherMap, valide les réponses via des modèles
**Pydantic** et expose un schéma stable au front — le client ne dépend pas
de la forme de l'API externe.
Frontend **typé de bout en bout** : types TypeScript partagés, composants
domain-driven (`components/weather/`), thème dark/light cohérent via
shadcn/ui.
Packagée en **Docker Compose** (frontend + backend) pour démarrer en une
commande, avec des `.env.example` pour les deux services et un endpoint
`/docs` Swagger auto-généré.
