---
title: "Yoga Band"
titleEn: "Yoga Band"
description: "Plateforme complète pour studio de yoga indépendant : site vitrine, réservation par crédits, paiements Stripe, espace yogi, back-office admin (cours, ateliers, paiements, newsletters). En production pour une cliente réelle."
descriptionEn: "Full platform for an independent yoga studio: showcase site, credit-based booking, Stripe payments, yogi space, admin back-office (classes, workshops, payments, newsletters). Live in production for a real client."
date: 2026-05-10
slug: "gotyeah-yoga"
tags: ["réservation", "paiement-en-ligne", "back-office", "vitrine"]
stack: ["Next.js 16", "TypeScript", "Prisma 7", "SQLite", "Tailwind 4", "Stripe", "react-email", "nodemailer", "Docker", "GitHub Actions"]
image: "/images/gotyeah-yoga.svg"
status: ["online", "new", "in-progress"]
featured: true
live: "https://mathildeallaine.yoga"
repoPrivate: true
bodyEn: "End-to-end platform for an independent yoga studio: showcase site, booking, yogi space, admin back-office. Designed as a **real single-tenant SaaS product**: in-house auth (magic link + JWT), Stripe Checkout payments, transactional emails via react-email, crons.\n\n### Business flow\n\n- **Complete journey**, purchase of a package (Stripe Checkout) → credits granted → class booking → **FIFO** consumption of the credit expiring first → cancellation possible up to 6h before.\n- **Guest management (Guests)**, a yogi can book for a non-registered relative.\n\n### Admin back-office\n\n- **Dashboard with KPIs**, revenue, occupancy, active yogis.\n- **CRUD for classes and workshops**, payment management with **Stripe partial refunds**.\n- **GDPR opt-in newsletters**, Brevo batches respecting the 300/24h limit.\n- **Editable home banner and schedule** without touching the code.\n\n### Production & testing\n\n- **In production on a Raspberry Pi**, behind Nginx Proxy Manager + Cloudflare, GitHub Actions auto-deployment on push to `main`.\n- **7 crons**, D-1 reminders, review invitations, notification cleanup, newsletter sends, etc.\n- **14 business test scripts** (booking, admin, payments, emails, guests…), each scenario handling its own setup/cleanup.\n- **Dedicated DateTime typing safeguard** to prevent SQLite TEXT vs INTEGER regressions.\n\n> **In production** for an independent yoga studio:\n> [mathildeallaine.yoga](https://mathildeallaine.yoga) (public showcase\n> accessible to everyone). Real Stripe payments, confidential client data and\n> source code. A test instance runs separately on the homelab.\n> Technical walkthrough of the back-office and code available on request via `/contact`."
---

Plateforme bout-en-bout pour un studio de yoga indépendant, vitrine, réservation, espace yogi, back-office admin. Pensée comme un **vrai produit SaaS mono-tenant** : auth maison (magic link + JWT), paiements Stripe Checkout, emails transactionnels via react-email, crons.

### Flow métier

- **Parcours complet**, achat d'une formule (Stripe Checkout) → crédits attribués → réservation d'un cours → consommation **FIFO** du crédit qui expire en premier → annulation possible jusqu'à 6h avant.
- **Gestion des invités (Guests)**, un yogi peut réserver pour un proche non-inscrit.

### Back-office admin

- **Dashboard avec KPI**, revenus, remplissage, yogis actifs.
- **CRUD cours et ateliers**, gestion des paiements avec **remboursements partiels Stripe**.
- **Newsletters opt-in RGPD**, batch Brevo respectant la limite 300/24h.
- **Bandeau home et planning éditables** sans toucher au code.

### Production & tests

- **En production sur Raspberry Pi**, derrière Nginx Proxy Manager + Cloudflare, auto-déploiement GitHub Actions sur push `main`.
- **7 crons**, rappels J-1, invitations d'avis, nettoyage des notifs, envois de newsletter, etc.
- **14 scripts de tests métier** (booking, admin, paiements, emails, guests…), chaque scénario gère son propre setup/cleanup.
- **Garde-fou typage DateTime** dédié pour prévenir les régressions SQLite TEXT vs INTEGER.

> **En production** pour un studio de yoga indépendant :
> [mathildeallaine.yoga](https://mathildeallaine.yoga) (vitrine publique
> accessible à tous). Paiements Stripe réels, données client et code source
> confidentiels. Une instance de test tourne séparément sur le homelab.
> Walkthrough technique du back-office et du code sur demande via `/contact`.
