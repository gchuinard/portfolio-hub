# Gautier Playbook — Hub Portfolio

Portfolio personnel de Gautier Chuinard (Product Owner & QA). Site statique généré avec Astro, déployé sur GitHub Pages ou équivalent.

## Stack

- **Astro 5** + **TailwindCSS 3** + **MDX**
- **TypeScript** (fichiers `.astro` frontmatter + `.ts`)
- Police : Space Mono (Google Fonts)
- Icônes : `lucide-astro`
- Commandes : `npm run dev` / `npm run build` / `npm run preview`

## Architecture

```
src/
  content/
    projects/        ← un fichier .md par projet (Astro Content Collections)
    certifications/  ← un fichier .md par certification
    config.ts        ← schémas Zod des deux collections
  components/
    ProjectCard.astro
    HeroBD.astro / HeroGlitch.astro / HeroPhoto.astro / HeroSkillBars.astro
    TerminalOverlay.astro
  layouts/
    Base.astro       ← layout global : nav, footer, boot overlay, i18n inline, thème
  pages/
    index.astro
    projects.astro
    projects/[slug].astro
    skills.astro
    certifications.astro
    contact.astro
  data/
    skills.json
  styles/
    tailwind.css
    base-boot.css
  scripts/
    base-client.ts   ← thème, i18n, terminal overlay (côté client)
```

## Esthétique / Conventions visuelles

Thème **terminal phosphore** (vert sur noir). Palette principale :
- `#00ff41` — vert vif (titres, accents forts)
- `#00aa2a` — vert moyen (texte courant)
- `#007a1f` — vert sombre (métadonnées, secondaire)
- `#005c17` — vert très sombre (commentaires, tertiaire)
- `#0a0a0a` / `#0d0d0d` — fonds

Règles : **pas de `border-radius`**, police `font-mono` partout, syntaxe terminal dans les labels (`$`, `cat`, `ls`, `grep`…).

Le thème est switchable (hue CSS variable `--hue`, mode clair/sombre) via `localStorage` (`gh-theme`).

## Internationalisation (FR/EN)

Géré **côté client uniquement** via `data-i18n`, `data-lang-fr`, `data-lang-en` dans le HTML. **Le i18n est réparti sur trois fichiers — toujours mettre à jour les trois :**

1. `src/pages/index.astro` — fallback JS du typewriter (texte FR par défaut)
2. `src/layouts/Base.astro` — dictionnaire EN inliné (`script is:inline`)
3. `src/scripts/base-client.ts` — dictionnaire FR complet (rechargement dynamique SPA)

Pour les composants dynamiques (ProjectCard), utiliser `data-lang-fr={title}` et `data-lang-en={titleEn}`.

## Ajouter un projet

Créer `src/content/projects/<slug>.md` avec ce frontmatter (tous les champs optionnels sauf `title`, `description`, `date`) :

```yaml
---
title: "Titre FR"
titleEn: "Title EN"           # optionnel
description: "Description FR"
descriptionEn: "Description EN"  # optionnel
date: YYYY-MM-DD
tags: ["tag1", "tag2"]        # minuscules, servent aux filtres
status: "new"                 # new | updated | in-progress | planned | beta
stack: ["Tech1", "Tech2"]
featured: true
demo: "https://..."           # optionnel
repo: "https://..."           # optionnel
image: "/images/mon-projet.png"  # optionnel
---

Corps en markdown (affiché sur la page détail /projects/[slug]).
```

Les projets sont triés par `date` décroissante dans `projects.astro`.

## Ajouter une certification

Créer `src/content/certifications/<slug>.md` :

```yaml
---
title: "Nom de la certification"
issuer: "Organisme"
issueDate: YYYY-MM-DD
expiryDate: YYYY-MM-DD   # optionnel
credentialId: "ABC123"   # optionnel
credentialUrl: "https://..."  # optionnel
status: "earned"         # earned | target
tags: ["scrum", "agile"]
logo: "/logos/cert.png"  # optionnel
---
```

## Ce qu'il ne faut pas faire

- Ne pas ajouter de `border-radius` — l'esthétique est volontairement angulaire.
- Ne pas toucher au script `is:inline` de `Base.astro` sans mettre à jour les deux versions FR et EN.
- Ne pas utiliser `getStaticPaths` manuel pour les projets — le routing dynamique `[slug].astro` s'appuie sur `getCollection("projects")`.
- Ne pas installer de framework JS (React, Vue…) — tout est Astro vanilla + scripts `<script type="module">`.
