---
title: "Filer"
titleEn: "Filer"
description: "Service de partage de fichiers familial auto-hébergé (alternative WeTransfer/Grosfichiers) : upload en streaming jusqu'à 1 Go, organisation en dossiers, partages par email, preview inline."
descriptionEn: "Self-hosted family file-sharing service (a WeTransfer/Grosfichiers alternative): streaming uploads up to 1 GB, folder organization, email-based shares, inline preview."
date: 2026-06-08
slug: "gotyeah-filer"
tags: ["partage-fichiers", "upload", "famille"]
stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind 4", "better-sqlite3", "Docker"]
image: "/images/gotyeah-filer.svg"
status: ["online", "new"]
live: "https://filer.gautierchuinard.com"
repo: "https://github.com/gchuinard/gotyeah-filer"
bodyEn: "Lightweight, **self-hosted** file-sharing service for family use. Admins (whitelisted emails) upload in **streaming** mode, no 1 MB cap, up to a configurable 1 GB, organize files into folders, then create **shares** (a single file *or* an entire folder) restricted to a list of emails.\n\n### Access & security\n\n- **No accounts or passwords**, access works through a share link + email verification.\n- **Sessions via signed httpOnly cookie**, guests view, preview and download.\n- **Hardened file serving**, inert types served inline, HTML/SVG forced as attachments.\n\n### File explorer\n\n- **Master-detail UI**, keyboard navigation, multi-selection and batch operations (move, delete, download as ZIP).\n- **Filters, search and sorting**, by file type.\n- **Inline preview**, images / audio / video (with *Range requests* for seeking) / PDF, and a per-file download counter.\n\nDeployed on a Raspberry Pi via **Docker** (SSH CI/CD on push to `main`) behind Nginx Proxy Manager + Cloudflare."
---

Service de partage de fichiers léger et **auto-hébergé** pour un usage familial. Les admins (emails whitelistés) uploadent en **streaming**, pas de limite à 1 Mo, jusqu'à 1 Go configurable, organisent les fichiers en dossiers, puis créent des **partages** (un fichier *ou* un dossier entier) restreints à une liste d'emails.

### Accès & sécurité

- **Pas de comptes ni de mots de passe**, l'accès se fait par lien de partage + vérification d'email.
- **Sessions par cookie signé httpOnly**, les invités voient, prévisualisent et téléchargent.
- **Service de fichiers durci**, types inertes en inline, HTML/SVG forcés en pièce jointe.

### Explorateur

- **UI maître-détail**, navigation clavier, multi-sélection et opérations par lot (déplacer, supprimer, télécharger en ZIP).
- **Filtres, recherche et tri**, par type de fichier.
- **Preview inline**, images / audio / vidéo (avec *Range requests* pour le seek) / PDF, et compteur de téléchargements par fichier.

Déployé sur Raspberry Pi via **Docker** (CI/CD SSH sur push `main`) derrière Nginx Proxy Manager + Cloudflare.
