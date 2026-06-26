---
title: "E-billetterie"
titleEn: "E-ticketing"
description: "Billetterie self-hosted pour le spectacle de fin d'année d'une école de danse (salle de 754 places modélisée) : demandes de places, jauge anti-survente, placement manuel assisté, suivi des versements, billets QR et scan à l'entrée. Sans paiement en ligne."
descriptionEn: "Self-hosted ticketing for a dance school's year-end show (754-seat hall modelled): seat requests, oversell-proof counter, assisted manual seating, payment tracking, QR tickets and door scanning. No online payment."
date: 2026-06-14
slug: "ebilletterie"
tags: ["billetterie", "événementiel", "back-office"]
stack: ["Next.js 16", "TypeScript", "Prisma 6", "SQLite", "react-email", "QR (html5-qrcode)", "Cloudflare Turnstile", "Docker"]
image: "/images/ebilletterie.svg"
status: ["online", "in-progress"]
live: "https://billets.cours-danse-bergerac.fr"
repo: "https://github.com/gchuinard/gotyeah-danse"
bodyEn: "**Self-hosted** ticketing for the year-end show of the Desha-Moulin dance school, at the Centre Culturel de Bergerac, **fan-shaped hall, 754 seats modelled** (rows A→Y). No SaaS, no commission: a Raspberry Pi 5, a SQLite database, and that's it. Built as a **sub-project of `gotyeah-danse`** (`/billetterie`).\n\n### Locked-in business rules\n\n- **No online payment**, families pay at the studio, the admin marks \"paid\" by hand.\n- **No seat selection**, families request **N seats** and never choose their seat.\n- **Oversell-proof**, a `pending` request **consumes the counter** (a single counter, never specific seats) → the hall **cannot be oversold**.\n\n### Seating and payment\n\n- **Manual and assisted seating**, the algorithm proposes up to 3 suggestions, a human always validates.\n- **Independence**, you can \"seat now, pay later\".\n- **Payment by instalments**, cash / staggered cheques with deposit date; a request is *settled* when the net reaches the amount due, otherwise it's a *down payment*.\n\n### Tickets and entry\n\n- **QR tickets** generated and **door scanning** via html5-qrcode.\n- **Emails** via react-email + Brevo.\n- **Public form** protected by **Cloudflare Turnstile**.\n\nStack **Next.js 16 App Router + Prisma 6 / SQLite**, **online** at `billets.cours-danse-bergerac.fr` (Docker on the Pi 5 ARM64, behind Cloudflare Access)."
---

Billetterie **self-hosted** pour le spectacle de fin d'année de l'école de danse Desha-Moulin, au Centre Culturel de Bergerac, **salle en éventail, 754 places modélisées** (rangées A→Y). Pas de SaaS, pas de commission : un Raspberry Pi 5, une base SQLite, et c'est tout. Développée comme un **sous-projet de `gotyeah-danse`** (`/billetterie`).

### Principes métier verrouillés

- **Pas de paiement en ligne**, les familles paient au studio, l'admin marque « payé » à la main.
- **Pas de choix du siège**, les familles demandent **N places** et ne choisissent jamais leur siège.
- **Anti-survente**, une demande `pending` **consomme la jauge** (un compteur, jamais des sièges précis) → la salle **ne peut pas être survendue**.

### Placement et paiement

- **Placement manuel et assisté**, l'algo propose jusqu'à 3 suggestions, un humain valide toujours.
- **Indépendance**, on peut « placer maintenant, payer plus tard ».
- **Règlement par versements**, espèces / chèques échelonnés avec date de dépôt ; une demande est *soldée* quand le net atteint le dû, sinon c'est un *acompte*.

### Billets et entrée

- **Billets QR** générés et **scan à l'entrée** via html5-qrcode.
- **Emails** via react-email + Brevo.
- **Formulaire public** protégé par **Cloudflare Turnstile**.

Stack **Next.js 16 App Router + Prisma 6 / SQLite**, **en ligne** sur `billets.cours-danse-bergerac.fr` (Docker sur le Pi 5 ARM64, derrière Cloudflare Access).
