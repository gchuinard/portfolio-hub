---
title: "Analyseur de Backlog GitHub"
titleEn: "GitHub Backlog Analyzer"
description: "Pipeline de données et dashboard analytique qui exploite l'API GitHub pour mesurer la santé d'un backlog open source : dette technique, vélocité, temps de résolution."
descriptionEn: "Data pipeline and analytics dashboard leveraging the GitHub API to measure open source backlog health: technical debt, velocity, and resolution time."
date: 2026-04-03
slug: "analyseur-backlog-github"
tags: [python, data, sql, api, dashboard, analytics, agile, backlog, github, kpi]
stack: [Python, GitHub API, PostgreSQL, FastAPI, Next.js, Recharts]
status: ["offline", "planned"]
featured: true
---

Projet orienté **Data Product & Agile Analytics**, conçu avec une posture de PO qui veut piloter 
par la donnée plutôt que par l'intuition.  
Le pipeline collecte via l'**API GitHub** les issues de projets open source majeurs (labels, 
assignees, dates d'ouverture/fermeture, milestones), les normalise et les stocke dans 
une base **PostgreSQL** structurée autour des concepts agiles : épics, types, états.  
Le dashboard expose des métriques concrètes : **lead time, cycle time, ratio bugs/features, 
dette accumulée par sprint**, et évolution de la vélocité dans le temps.  
Chaque choix de métrique est documenté avec son **intention produit** — pas juste "c'est 
intéressant", mais "ça permet de décider quoi".  
Ce projet démontre ma capacité à transformer des données brutes de delivery en **insights 
actionnables pour un PO ou une direction produit**.
