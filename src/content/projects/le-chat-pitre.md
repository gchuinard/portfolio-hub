---
title: "Le Chat-Pitre"
titleEn: "Le Chat-Pitre"
description: "Plateforme complète pour une pension féline : profils des chats, demandes de réservation avec messagerie, carnet de séjour photo, visioconsultations WebRTC 1:1, facturation PDF, documents santé."
descriptionEn: "Full platform for a cat boarding house: cat profiles, booking requests with messaging, photo stay log, 1:1 WebRTC video consultations, PDF invoicing, health documents."
date: 2026-05-20
slug: "le-chat-pitre"
tags: ["réservation", "messagerie", "back-office"]
stack: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Prisma 7", "Tailwind 4", "WebRTC", "Docker"]
image: "/images/le-chat-pitre.svg"
status: ["online", "new"]
featured: true
live: "https://chatpitre.gautierchuinard.com"
repo: "https://github.com/gchuinard/gotyeah-chatpitre"
bodyEn: "Full web platform for a **cat boarding house**, from owner/admin account management (in-house auth, HMAC-SHA256 session cookies) to cat profiles with portraits and **documents** (vaccination records, health certificates) served in an authenticated way.\n\n### Booking & stay\n\n- **End-to-end booking workflow**, client request → boarding house approval → priced quote (per day, per visit, flat-rate add-ons) → deposit.\n- **Messaging** per stay, **house review** per cat (approved / with reservations / declined) and real-time **in-app notifications**.\n- Daily **stay log** (photos + notes).\n- **PDF invoicing** generated on the fly.\n\n### Video & real time\n\n- **1:1 WebRTC video consultations** peer-to-peer, with no third-party service.\n- Cloudflare Realtime **TURN relay** and **SSE** signaling.\n\n### Design system\n\n- **In-house design system** inspired by illustrated mid-century style (Charley Harper-like).\n- **Typography & palette**, Newsreader + Manrope + JetBrains Mono, cream palette + jewelry tones.\n\nStack **Next.js 16 + PostgreSQL 16 + Prisma 7**, optimized multi-stage arm64 Docker build, GitHub Actions CI, **online** at `chatpitre.gautierchuinard.com` (Raspberry Pi behind NPM + Cloudflare)."
---

Plateforme web complète pour une **pension féline**, de la gestion de comptes propriétaire/admin (auth maison, cookies de session HMAC-SHA256) aux profils de chats avec portraits et **documents** (carnets de vaccination, certificats de santé) servis de façon authentifiée.

### Réservation & séjour

- **Workflow de réservation bout-en-bout**, demande du client → validation de la pension → devis tarifé (au jour, à la visite, suppléments forfaitaires) → acompte.
- **Messagerie** par séjour, **avis de maison** par chat (validé / avec réserve / refusé) et **notifications in-app** temps réel.
- **Carnet de séjour** quotidien (photos + notes).
- **Facturation PDF** générée à la volée.

### Visio & temps réel

- **Visioconsultations 1:1 en WebRTC** pair-à-pair, sans service tiers.
- **Relais TURN** Cloudflare Realtime et signaling **SSE**.

### Design system

- **Design system maison** d'inspiration mid-century illustrée (façon Charley Harper).
- **Typo & palette**, Newsreader + Manrope + JetBrains Mono, palette crème + tons joaillerie.

Stack **Next.js 16 + PostgreSQL 16 + Prisma 7**, build Docker multi-stage optimisé arm64, CI GitHub Actions, **en ligne** sur `chatpitre.gautierchuinard.com` (Raspberry Pi derrière NPM + Cloudflare).
