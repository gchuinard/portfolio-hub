# Hub Portfolio

Portfolio personnel de **Gautier Chuinard** — Product Owner & QA.

Site statique qui centralise projets, expériences, compétences et certifications,
dans un thème *terminal phosphore* (vert sur noir) avec internationalisation FR/EN
côté client.

## Stack

- **Astro 5** · **TailwindCSS 3** · **MDX** · **TypeScript**
- Contenu en **Astro Content Collections** (`src/content/`), schémas **Zod**
- Police *Space Mono*, icônes `lucide-astro`
- Déploiement : **GitHub Actions** (rsync) vers un Raspberry Pi auto-hébergé

## Commandes

| Commande          | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm install`     | Installe les dépendances                |
| `npm run dev`     | Serveur local — `localhost:4321`        |
| `npm run build`   | Build de production dans `./dist/`      |
| `npm run preview` | Prévisualise le build avant déploiement |
| `npm run admin`   | Dashboard d'édition du contenu — `127.0.0.1:4322` |

## Éditer le contenu (admin local)

Plutôt que d'éditer le YAML à la main, lance le dashboard local :

```bash
npm run admin      # → http://127.0.0.1:4322
```

Il gère projets / certifications / expériences (créer · éditer · supprimer),
avec aperçu live (**▶ aperçu**) et publication en un clic (**⬆ publier** =
commit + push → déploiement auto). Guide complet :
**[admin/README.md](./admin/README.md)**.

## Structure

```text
src/
  content/      projets · certifications · expériences (.md + config.ts Zod)
  components/   ProjectCard, Hero*, TerminalOverlay
  layouts/      Base.astro — nav, footer, thème, i18n
  pages/        index · projects · projects/[slug] · skills · certifications · experience · contact
  data/         skills.json
  scripts/      base-client.ts — thème, i18n, overlay
  styles/       tailwind.css · base-boot.css
public/
  images/       un aperçu SVG par projet construit
```

## Conventions

Esthétique, ajout d'un projet / d'une certification, i18n, vocabulaire des tags,
aperçus SVG et déploiement sont documentés dans **[CLAUDE.md](./CLAUDE.md)**.
