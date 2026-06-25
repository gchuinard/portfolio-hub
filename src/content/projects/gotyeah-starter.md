---
title: "GotYeah Starter"
titleEn: "GotYeah Starter"
description: "Outil d'automatisation qui provisionne un nouveau site sur le homelab en une cascade : repo GitHub, DNS Cloudflare, certificat SSL via Nginx Proxy Manager et injection du workflow — logs SSE temps réel, rollback automatique."
descriptionEn: "Automation tool that provisions a new homelab site in one cascade: GitHub repo, Cloudflare DNS, SSL cert via Nginx Proxy Manager and workflow injection — real-time SSE logs, automatic rollback."
date: 2026-06-19
slug: "gotyeah-starter"
tags: [automatisation, devops, infrastructure]
stack: [Python, FastAPI, httpx, Server-Sent Events, Docker]
image: "/images/gotyeah-starter.svg"
status: ["new"]
featured: false
repo: "https://github.com/gchuinard/gotyeah-starter"
---

Application qui **automatise la mise en ligne d'un nouveau site** sur mon
Raspberry Pi 5. Au lieu d'enchaîner les étapes à la main, elle orchestre une
**cascade** : création du dépôt GitHub (vierge ou depuis template) →
enregistrement **DNS A Cloudflare** pointant sur le Pi → **Nginx Proxy Manager**
avec certificat Let's Encrypt et HTTPS forcé → injection du workflow GitHub
Actions.
**Logs en temps réel** streamés via **Server-Sent Events** ; en cas d'échec
d'une étape, **rollback automatique** des opérations déjà effectuées.
Backend **FastAPI** async (httpx pour les API externes), frontend HTML/CSS/JS
vanilla. **Zéro dépendance SaaS** : tout l'état et les secrets vivent sur le Pi
via `.env`.
Conteneurisé (Docker `HEALTHCHECK`), CI/CD avec tests + déploiement SSH/rsync.
Un outil d'infra interne qui transforme « créer un nouveau site » en un clic.
