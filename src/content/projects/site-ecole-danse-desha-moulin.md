---
title: "Site École de danse Desha-Moulin"
titleEn: "Desha-Moulin Dance School Website"
description: "Refonte complète du site vitrine de l'école de danse Desha-Moulin (Bergerac, fondée en 1949). One-page sobre, planning éditable en CLI, déployé sur Raspberry Pi."
descriptionEn: "Full redesign of Desha-Moulin Dance School's showcase site (Bergerac, founded 1949). Sober one-page, CLI-editable banner, deployed on Raspberry Pi."
date: 2026-04-02
slug: "site-ecole-danse-desha-moulin"
tags: [vitrine, danse, one-page]
stack: [HTML, CSS, JS Vanilla, Docker, Nginx, Sharp]
status: ["online", "updated"]
featured: true
demo: "https://cours-danse-bergerac.fr"
repo: "https://github.com/gchuinard/gotyeah-danse"
---

Refonte complète d'un site d'école de danse familiale fondée en 1949.
**Zéro framework, zéro build** — HTML/CSS/JS vanilla pour un site qui tiendra
encore dans 10 ans sans dette technique.
Pipeline d'optimisation d'images via **Sharp** (variantes WebP/AVIF
responsive) et **CLI Node** dédié pour la mise à jour mensuelle de la
bannière d'annonce — l'admin du site n'a pas à toucher au HTML.
Source de vérité unique pour les horaires (section Planning), palette terre
& sable cohérente avec l'identité du studio. **Hébergement Raspberry Pi**
derrière Nginx, cache busting par paramètre de version.
