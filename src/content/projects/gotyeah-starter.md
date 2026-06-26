---
title: "GotYeah Starter"
titleEn: "GotYeah Starter"
description: "Outil d'automatisation qui provisionne un nouveau site sur le homelab en une cascade : repo GitHub, DNS Cloudflare, certificat SSL via Nginx Proxy Manager et injection du workflow, logs SSE temps réel, rollback automatique."
descriptionEn: "Automation tool that provisions a new homelab site in one cascade: GitHub repo, Cloudflare DNS, SSL cert via Nginx Proxy Manager and workflow injection, real-time SSE logs, automatic rollback."
date: 2026-06-19
slug: "gotyeah-starter"
tags: ["automatisation", "devops", "infrastructure"]
stack: ["Python", "FastAPI", "httpx", "Server-Sent Events", "Docker"]
image: "/images/gotyeah-starter.svg"
status: ["online", "new"]
repo: "https://github.com/gchuinard/gotyeah-starter"
bodyEn: "Application that **automates the deployment of a new site** on my Raspberry Pi 5. Instead of running through the steps by hand, it orchestrates a complete **cascade** in one click.\n\n### Provisioning cascade\n\n- **GitHub repo**, created blank or from a template.\n- **Cloudflare A record**, pointing to the Pi.\n- **Nginx Proxy Manager**, Let's Encrypt certificate and forced HTTPS.\n- **GitHub Actions workflow**, injected into the repo.\n\n### Reliability\n\n- **Real-time logs**, streamed via **Server-Sent Events**.\n- **Automatic rollback**, if a step fails, the operations already performed are reverted.\n\n### Architecture\n\n- **Async FastAPI backend**, httpx for external APIs.\n- **Vanilla HTML/CSS/JS frontend**.\n- **Zero SaaS dependency**, all state and secrets live on the Pi via `.env`.\n\nContainerized (Docker `HEALTHCHECK`), CI/CD with tests + SSH/rsync deployment. An internal infra tool that turns \"create a new site\" into one click."
---

Application qui **automatise la mise en ligne d'un nouveau site** sur mon Raspberry Pi 5. Au lieu d'enchaîner les étapes à la main, elle orchestre une **cascade** complète en un clic.

### Cascade de provisioning

- **Dépôt GitHub**, création vierge ou depuis template.
- **DNS A Cloudflare**, enregistrement pointant sur le Pi.
- **Nginx Proxy Manager**, certificat Let's Encrypt et HTTPS forcé.
- **Workflow GitHub Actions**, injecté dans le dépôt.

### Fiabilité

- **Logs en temps réel**, streamés via **Server-Sent Events**.
- **Rollback automatique**, en cas d'échec d'une étape, les opérations déjà effectuées sont annulées.

### Architecture

- **Backend FastAPI** async, httpx pour les API externes.
- **Frontend HTML/CSS/JS** vanilla.
- **Zéro dépendance SaaS**, tout l'état et les secrets vivent sur le Pi via `.env`.

Conteneurisé (Docker `HEALTHCHECK`), CI/CD avec tests + déploiement SSH/rsync. Un outil d'infra interne qui transforme « créer un nouveau site » en un clic.
