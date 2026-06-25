---
title: "Filer"
titleEn: "Filer"
description: "Service de partage de fichiers familial auto-hébergé (alternative WeTransfer/Grosfichiers) : upload en streaming jusqu'à 1 Go, organisation en dossiers, partages par email, preview inline."
descriptionEn: "Self-hosted family file-sharing service (a WeTransfer/Grosfichiers alternative): streaming uploads up to 1 GB, folder organization, email-based shares, inline preview."
date: 2026-06-08
slug: "gotyeah-filer"
tags: [partage-fichiers, upload, famille]
stack: [Next.js 16, React 19, TypeScript, Tailwind 4, better-sqlite3, Docker]
image: "/images/gotyeah-filer.svg"
status: ["online", "new"]
featured: false
live: "https://filer.gautierchuinard.com"
repo: "https://github.com/gchuinard/gotyeah-filer"
---

Service de partage de fichiers léger et **auto-hébergé** pour un usage familial. Les admins (emails whitelistés) uploadent en **streaming** — pas de limite à 1 Mo, jusqu'à 1 Go configurable —, organisent les fichiers en dossiers, puis créent des **partages** (un fichier *ou* un dossier entier) restreints à une liste d'emails.

### Accès & sécurité

- **Pas de comptes ni de mots de passe** — l'accès se fait par lien de partage + vérification d'email.
- **Sessions par cookie signé httpOnly** — les invités voient, prévisualisent et téléchargent.
- **Service de fichiers durci** — types inertes en inline, HTML/SVG forcés en pièce jointe.

### Explorateur

- **UI maître-détail** — navigation clavier, multi-sélection et opérations par lot (déplacer, supprimer, télécharger en ZIP).
- **Filtres, recherche et tri** — par type de fichier.
- **Preview inline** — images / audio / vidéo (avec *Range requests* pour le seek) / PDF, et compteur de téléchargements par fichier.

Déployé sur Raspberry Pi via **Docker** (CI/CD SSH sur push `main`) derrière Nginx Proxy Manager + Cloudflare.
