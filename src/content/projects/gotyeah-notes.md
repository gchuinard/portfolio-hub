---
title: "GotYeah Notes"
titleEn: "GotYeah Notes"
description: "Clone Notion self-hosted : workspaces multi-membres, pages en arborescence, databases avec vues table/kanban/calendar/gallery, éditeur de blocs et drag-and-drop natif."
descriptionEn: "Self-hosted Notion clone: multi-member workspaces, hierarchical pages, databases with table/kanban/calendar/gallery views, block editor and native drag-and-drop."
date: 2026-04-18
slug: "gotyeah-notes"
tags: [notion-clone, productivité, collaboratif]
stack: [Next.js 16, TypeScript strict, Prisma 7, SQLite, Tailwind v4, BlockNote, dnd-kit, SWR]
image: "/images/gotyeah-notes.svg"
status: ["in-progress"]
featured: true
repo: "https://github.com/gchuinard/gotyeah-notes"
---

Projet né d'un constat : Notion est génial, mais je veux **posséder mes données**. Donc je le reconstruis, pas tout, juste ce que j'utilise vraiment.

### Architecture

- **Next.js 16 App Router**, Server Components par défaut, Server Actions pour les mutations.
- **Prisma 7 + SQLite**, pour rester portable et auto-hébergeable sans infra lourde.
- **Auth maison**.

### Modèle de données

- **10 entités**, User, Workspace, Membership, Section, Page, Database, DatabaseProperty, Record, View, PageVisit, avec des invariants explicites.
- **`visibility` dénormalisée**, synchro récursive via un helper unique.
- **Permissions**, répondent 404 plutôt que 403 pour ne pas leaker l'existence.

### Édition et interactions

- **Éditeur de blocs BlockNote**, avec autosave 500ms debounce.
- **Drag-and-drop universel**, sidebar, lignes de table, cartes kanban via dnd-kit.
- **Optimistic updates**, partout via SWR.
- **Filtres et tris côté client**, pour rester responsive.
