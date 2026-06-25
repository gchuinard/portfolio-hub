---
title: "Yoga Band"
titleEn: "Yoga Band"
description: "Plateforme complète pour studio de yoga indépendant : site vitrine, réservation par crédits, paiements Stripe, espace yogi, back-office admin (cours, ateliers, paiements, newsletters). Déployée en ligne (démo, Stripe en mode test)."
descriptionEn: "Full platform for an independent yoga studio: showcase site, credit-based booking, Stripe payments, yogi space, admin back-office (classes, workshops, payments, newsletters). Live demo deployment (Stripe in test mode)."
date: 2026-05-10
slug: "gotyeah-yoga"
tags: [réservation, paiement-en-ligne, back-office]
stack: [Next.js 16, TypeScript, Prisma 7, SQLite, Tailwind 4, Stripe, react-email, nodemailer, Docker, GitHub Actions]
image: "/images/gotyeah-yoga.svg"
status: ["online", "new"]
featured: true
live: "https://yoga.gautierchuinard.com"
repoPrivate: true
---

Plateforme bout-en-bout pour un studio de yoga indépendant — vitrine,
réservation, espace yogi, back-office admin. Pensée comme un **vrai produit
SaaS mono-tenant** : auth maison (magic link + JWT), paiements Stripe
Checkout, emails transactionnels via react-email, crons.
**Flow métier complet** : achat d'une formule (Stripe Checkout) → crédits
attribués → réservation d'un cours → consommation FIFO du crédit qui expire
en premier → annulation possible jusqu'à 6h avant. Gestion des invités
(Guests) — un yogi peut réserver pour un proche non-inscrit.
**Back-office admin riche** : dashboard avec KPI (revenus, remplissage,
yogis actifs), CRUD cours et ateliers, gestion des paiements avec
remboursements partiels Stripe, newsletters opt-in RGPD (batch Brevo
respectant la limite 300/24h), bandeau home et planning éditables sans
toucher au code.
**Déployée sur Raspberry Pi** derrière Nginx Proxy Manager + Cloudflare,
auto-déploiement GitHub Actions sur push `main`. **7 crons** orchestrent
les rappels J-1, les invitations d'avis, le nettoyage des notifs, les
envois de newsletter, etc.
**14 scripts de tests métier** (booking, admin, paiements, emails,
guests…) — chaque scénario gère son propre setup/cleanup. Garde-fou
typage DateTime dédié pour prévenir les régressions SQLite TEXT vs
INTEGER.

> Démo en ligne : [yoga.gautierchuinard.com](https://yoga.gautierchuinard.com)
> (vitrine publique accessible à tous). L'instance déployée tourne en **mode
> démo** — Stripe en test, aucun paiement réel. Le code source et les données
> client réelles restent confidentiels (en local). Walkthrough technique du
> back-office et du code sur demande via `/contact`.
