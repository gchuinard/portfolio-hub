---
title: "Dashboard F1 Data"
titleEn: "F1 Data Dashboard"
description: "Pipeline de données et dashboard analytique basé sur les données officielles de la Formule 1, pour explorer les performances des pilotes et des écuries en temps réel."
descriptionEn: "Data pipeline and analytics dashboard built on official Formula 1 data, to explore driver and team performance in real time."
date: 2026-04-03
slug: "dashboard-f1-data"
tags: [python, data, sql, api, dashboard, analytics, etl, visualisation]
stack: [Python, FastF1, PostgreSQL, FastAPI, Next.js, Recharts]
status: ["offline", "planned"]
featured: true
---

Projet orienté **Data Product**, conçu comme si j'étais PO d'une équipe d'analyse pour une écurie F1.  
Le pipeline récupère les données via la bibliothèque **FastF1** (temps au tour, arrêts aux stands, positions, météo piste), 
les normalise et les stocke dans une base **PostgreSQL** structurée autour de modèles métier clairs.  
Un dashboard interactif expose les métriques clés : comparaison pilotes, dégradation des pneumatiques, 
impact des undercuts en course.  
Les choix de modélisation et de priorisation des vues sont documentés explicitement — 
**quelles métriques, pour quel utilisateur, pourquoi**.  
Ce projet illustre ma capacité à piloter un produit data de bout en bout : de la définition des besoins à la livraison d'insights actionnables.
