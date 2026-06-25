---
title: "Le Chat-Pitre"
titleEn: "Le Chat-Pitre"
description: "Plateforme complète pour une pension féline : profils des chats, demandes de réservation avec messagerie, carnet de séjour photo, visioconsultations WebRTC 1:1, facturation PDF, documents santé."
descriptionEn: "Full platform for a cat boarding house: cat profiles, booking requests with messaging, photo stay log, 1:1 WebRTC video consultations, PDF invoicing, health documents."
date: 2026-05-20
slug: "le-chat-pitre"
tags: [réservation, messagerie, back-office]
stack: [Next.js 16, React 19, TypeScript, PostgreSQL, Prisma 7, Tailwind 4, WebRTC, Docker]
image: "/images/le-chat-pitre.svg"
status: ["online", "new"]
featured: true
live: "https://chatpitre.gautierchuinard.com"
repo: "https://github.com/gchuinard/gotyeah-chatpitre"
---

Plateforme web complète pour une **pension féline** — gestion de comptes
propriétaire/admin (auth maison, cookies de session HMAC-SHA256), profils de
chats avec portraits et **documents** (carnets de vaccination, certificats de
santé) servis de façon authentifiée.
**Workflow de réservation bout-en-bout** : demande du client → validation de la
pension → devis tarifé (au jour, à la visite, suppléments forfaitaires) →
acompte. Une **messagerie** par séjour, des **avis de maison** par chat (validé /
avec réserve / refusé) et des **notifications in-app** temps réel.
**Visioconsultations 1:1 en WebRTC** pair-à-pair (sans service tiers) avec relais
TURN Cloudflare Realtime et signaling **SSE**. **Facturation PDF** générée à la
volée, **carnet de séjour** quotidien (photos + notes).
**Design system maison** d'inspiration mid-century illustrée (façon Charley
Harper) — Newsreader + Manrope + JetBrains Mono, palette crème + tons joaillerie.
Stack **Next.js 16 + PostgreSQL 16 + Prisma 7**, build Docker multi-stage
optimisé arm64, CI GitHub Actions, **en ligne** sur `chatpitre.gautierchuinard.com`
(Raspberry Pi derrière NPM + Cloudflare).
