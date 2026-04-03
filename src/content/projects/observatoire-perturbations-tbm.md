---
title: "Observatoire des perturbations TBM"
titleEn: "TBM Transit Disruption Observatory"
description: "Pipeline de collecte et d'analyse des perturbations en temps réel du réseau de tram TBM à Bordeaux, pour identifier les lignes et horaires les plus impactés."
descriptionEn: "Real-time data pipeline and analytics dashboard monitoring TBM tram disruptions in Bordeaux, identifying the most impacted lines and time slots."
date: 2026-04-03
slug: "observatoire-perturbations-tbm"
tags: [python, data, sql, api, gtfs, transport, temps-réel, dashboard, analytics]
stack: [Python, GTFS-RT, SIRI-Lite, PostgreSQL, FastAPI, Next.js, Recharts]
status: ["offline", "planned"]
featured: true
---

Projet né d'une frustration d'usager : impossible de savoir si la ligne C est 
structurellement moins fiable que la ligne D, ou si c'est juste une impression.  
Le pipeline collecte en continu les flux **GTFS-RT** et **SIRI-Lite** du réseau TBM 
(Bordeaux Métropole Open Data) — retards, annulations, alertes de service — 
et les stocke en base **PostgreSQL** avec horodatage précis.  
Un moteur de détection classe chaque événement : retard mineur, perturbation 
significative, annulation, incident réseau — avec enrichissement par ligne, 
direction et plage horaire.  
Le dashboard expose les insights clés : **taux de ponctualité par ligne, 
pics de perturbations par heure et jour de semaine, cartographie des arrêts 
les plus impactés**.  
Ce projet illustre une démarche produit complète : partir d'un besoin utilisateur 
réel, définir les métriques qui font sens, et construire un pipeline robuste sur 
des données temps réel officielles.
