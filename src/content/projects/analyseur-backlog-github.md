---
title: "GitHub Backlog Analyzer"
titleEn: "GitHub Backlog Analyzer"
description: "Pipeline de données qui collecte les issues de dépôts GitHub publics, les normalise et expose des métriques agiles (lead time, ratio bugs/features) via FastAPI."
descriptionEn: "Data pipeline collecting issues from public GitHub repos, normalizing them and exposing agile metrics (lead time, bug/feature ratio) via FastAPI."
date: 2026-04-05
slug: "analyseur-backlog-github"
tags: [data, agile, backlog, kpi]
stack: [Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic, GitHub API]
status: ["in-progress"]
featured: true
repo: "https://github.com/gchuinard/gotyeah-datagit"
---

Projet orienté **Data Product** avec posture de PO : piloter un backlog par
la donnée plutôt que par l'intuition.
Le **client HTTP GitHub** gère pagination, rate limit et retries sur 403/429
pour collecter les issues d'un dépôt cible. Un module de classification
détecte le type (bug/feature/doc/other) à partir des labels.
Les données sont stockées en **PostgreSQL** via SQLAlchemy + Alembic, et
l'API **FastAPI** expose un endpoint `/issues/summary` avec la répartition
par type et par état.
Configuration entièrement pilotée par `.env` (DATABASE_URL, GITHUB_TOKEN,
délai entre requêtes, retries). Tests via pytest, doc Swagger auto-générée.
