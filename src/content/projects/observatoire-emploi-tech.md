---
title: "Observatoire du marché de l'emploi tech"
titleEn: "Tech Job Market Observatory"
description: "Pipeline de données et dashboard analytique qui agrège les offres d'emploi tech en France (France Travail, Adzuna, 6 ATS) pour cartographier les compétences demandées, les salaires et les tendances du marché."
descriptionEn: "Data pipeline and analytics dashboard aggregating French tech job offers (France Travail, Adzuna, 6 ATS feeds) to map in-demand skills, salaries and market trends."
date: 2026-04-03
slug: "observatoire-emploi-tech"
tags: [data, emploi, dashboard]
stack: [Python, FastAPI, SQLAlchemy async, PostgreSQL, Next.js 16, React 19, Docker, GitHub Actions]
image: "/images/observatoire-emploi-tech.svg"
status: ["online", "new"]
featured: true
live: "https://stack.gautierchuinard.com"
repoPrivate: true
---

Projet né d'un besoin réel : comprendre objectivement le marché de l'emploi tech
français plutôt que de naviguer à l'instinct dans une recherche de poste.
Un **worker** agrège en continu les offres depuis **France Travail** (OAuth),
**Adzuna** (HTTP Basic) et **6 flux ATS publics** (Greenhouse, Lever, Ashby,
SmartRecruiters, Teamtailor, Workable), stockées dans **PostgreSQL** via
SQLAlchemy async — l'API FastAPI reste en **lecture seule**, seul le worker écrit.
L'extraction des technos repose sur un **catalogue regex de 207 entrées** (avec
modélisation des prérequis), une **classification de poste en 11 catégories**
(dev, data, ia, devops, qa, sécu…) et une détection des **stacks de marché**
(itemsets fréquents). Pas de scraping fragile : des sources structurées et un
catalogue maintenu.
Le dashboard **Next.js 16** expose les tendances clés — quelles technos recrutent
le plus, **carte choroplèthe** des 101 départements (d3-geo), **statistiques de
salaire** p25/p75 par région/rôle/séniorité, et un **moteur de recommandation**
de compétences. Un back-office admin offre un scanner de technos inconnues et des
outils d'audit d'extraction.
Architecture multi-services (worker + API + web) orchestrée en **Docker Compose**,
durcie en prod (CAP_DROP, no-new-privileges, limites mémoire), **CI/CD GitHub
Actions** (pytest, ruff, mypy, tsc, eslint) auto-déployée sur le Raspberry Pi.
