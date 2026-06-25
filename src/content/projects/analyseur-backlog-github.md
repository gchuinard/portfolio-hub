---
title: "GitHub Backlog Analyzer"
titleEn: "GitHub Backlog Analyzer"
description: "Pipeline de données qui collecte les issues de dépôts GitHub publics, les normalise et expose des métriques agiles (lead time, ratio bugs/features) via FastAPI."
descriptionEn: "Data pipeline collecting issues from public GitHub repos, normalizing them and exposing agile metrics (lead time, bug/feature ratio) via FastAPI."
date: 2026-04-05
slug: "analyseur-backlog-github"
tags: [data, agile, backlog]
stack: [Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic, GitHub API]
image: "/images/analyseur-backlog-github.svg"
status: ["in-progress"]
featured: true
repo: "https://github.com/gchuinard/gotyeah-datagit"
---

Projet orienté **Data Product** avec posture de PO : piloter un backlog par la donnée plutôt que par l'intuition.

### Collecte & traitement

- **Client HTTP GitHub**, gère pagination, rate limit et retries sur 403/429 pour collecter les issues d'un dépôt cible.
- **Classification**, un module détecte le type (bug/feature/doc/other) à partir des labels.

### Stockage & API

- **PostgreSQL**, données stockées via SQLAlchemy + Alembic.
- **FastAPI**, expose un endpoint `/issues/summary` avec la répartition par type et par état.

### Configuration & qualité

- **Pilotage par `.env`**, DATABASE_URL, GITHUB_TOKEN, délai entre requêtes, retries.
- **Tests**, via pytest, avec doc Swagger auto-générée.
