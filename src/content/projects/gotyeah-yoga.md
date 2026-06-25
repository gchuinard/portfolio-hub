---
title: "Yoga Band"
titleEn: "Yoga Band"
description: "Plateforme complète pour studio de yoga indépendant : site vitrine, réservation par crédits, paiements Stripe, espace yogi, back-office admin (cours, ateliers, paiements, newsletters). En production pour une cliente réelle."
descriptionEn: "Full platform for an independent yoga studio: showcase site, credit-based booking, Stripe payments, yogi space, admin back-office (classes, workshops, payments, newsletters). Live in production for a real client."
date: 2026-05-10
slug: "gotyeah-yoga"
tags: [réservation, paiement-en-ligne, back-office]
stack: [Next.js 16, TypeScript, Prisma 7, SQLite, Tailwind 4, Stripe, react-email, nodemailer, Docker, GitHub Actions]
image: "/images/gotyeah-yoga.svg"
status: ["online", "new"]
featured: true
live: "https://mathildeallaine.yoga"
repoPrivate: true
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
