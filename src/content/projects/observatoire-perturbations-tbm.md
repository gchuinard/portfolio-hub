---
title: "Observatoire des perturbations TBM"
titleEn: "TBM Transit Disruption Observatory"
description: "Concept de pipeline de collecte et d'analyse des perturbations en temps réel du réseau de tram TBM à Bordeaux, pour identifier les lignes et horaires les plus impactés."
descriptionEn: "Concept for a real-time data pipeline and analytics dashboard monitoring TBM tram disruptions in Bordeaux, identifying the most impacted lines and time slots."
date: 2026-04-03
slug: "observatoire-perturbations-tbm"
tags: ["data", "transport", "temps-réel"]
stack: ["Python", "GTFS-RT", "SIRI-Lite", "PostgreSQL", "FastAPI", "Next.js", "Recharts"]
image: "/images/observatoire-perturbations-tbm.svg"
status: ["planned"]
bodyEn: "A project born from a user's frustration: there is no way to know whether line C is structurally less reliable than line D, or whether it's just a feeling.\n\n### Data pipeline\n\n- **Real-time collection**, **GTFS-RT** and **SIRI-Lite** feeds from the TBM network (Bordeaux Métropole Open Data): delays, cancellations, service alerts.\n- **Storage**, **PostgreSQL** database with precise timestamps.\n- **Detection engine**, classifies each event (minor delay, significant disruption, cancellation, network incident) with enrichment by line, direction and time slot.\n\n### Dashboard\n\n- **On-time rate per line**.\n- **Disruption peaks** by hour and day of the week.\n- **Mapping of the stops** most impacted.\n\nThis project illustrates a complete product approach: starting from a real user need, defining metrics that make sense, and building a robust pipeline on official real-time data.\n\n> **Product concept**, specified, **not yet developed**."
---

Projet né d'une frustration d'usager : impossible de savoir si la ligne C est structurellement moins fiable que la ligne D, ou si c'est juste une impression.

### Pipeline de données

- **Collecte temps réel**, flux **GTFS-RT** et **SIRI-Lite** du réseau TBM (Bordeaux Métropole Open Data) : retards, annulations, alertes de service.
- **Stockage**, base **PostgreSQL** avec horodatage précis.
- **Moteur de détection**, classe chaque événement (retard mineur, perturbation significative, annulation, incident réseau) avec enrichissement par ligne, direction et plage horaire.

### Dashboard

- **Taux de ponctualité par ligne**.
- **Pics de perturbations** par heure et jour de semaine.
- **Cartographie des arrêts** les plus impactés.

Ce projet illustre une démarche produit complète : partir d'un besoin utilisateur réel, définir les métriques qui font sens, et construire un pipeline robuste sur des données temps réel officielles.

> **Concept produit**, spécifié, **pas encore développé**.
