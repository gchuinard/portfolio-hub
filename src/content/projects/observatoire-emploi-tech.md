---
title: "Observatoire du marché de l'emploi tech"
titleEn: "Tech Job Market Observatory"
description: "Pipeline de données et dashboard analytique qui scrape les offres d'emploi tech en France pour cartographier les compétences demandées, les salaires et les tendances du marché."
descriptionEn: "Data pipeline and analytics dashboard scraping French tech job offers to map in-demand skills, salaries and market trends."
date: 2026-04-03
slug: "observatoire-emploi-tech"
tags: [python, data, sql, scraping, nlp, dashboard, analytics, emploi, kpi]
stack: [Python, BeautifulSoup, PostgreSQL, FastAPI, Next.js, Recharts]
status: ["offline", "planned"]
featured: true
---

Projet né d'un besoin réel : comprendre objectivement le marché de l'emploi tech français 
plutôt que de naviguer à l'instinct dans une recherche de poste.  
Le pipeline scrape les offres publiées sur **Welcome to the Jungle** et exploite 
l'**API France Travail** pour collecter en continu intitulés, compétences, salaires, 
localisations et types de contrat.  
Un module de **normalisation NLP** (spaCy) homogénéise les intitulés de poste et extrait 
les technos mentionnées, avant stockage dans une base **PostgreSQL** structurée par domaine, 
niveau et région.  
Le dashboard expose les tendances clés : **quelles compétences recrutent le plus, dans 
quelles villes, pour quels salaires**, avec une évolution temporelle semaine par semaine.  
Chaque vue est documentée avec son intention produit — ce projet illustre ma capacité à 
transformer un besoin utilisateur concret en **pipeline de données actionnable**.
