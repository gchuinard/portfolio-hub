# Admin local — Hub Portfolio

Dashboard **local, dev uniquement** pour gérer le contenu du portfolio
(projets, certifications, expériences) sans éditer le YAML à la main.

Il écrit directement dans `src/content/**/*.md`. Le site reste **100 %
statique** : aucun backend en production, aucune empreinte dans `dist/`, rien
n'est déployé sur le Pi. Ce dossier vit hors de `src/` et n'est jamais buildé
par Astro.

## Lancer

```bash
npm run admin          # → http://127.0.0.1:4322
npm run dev            # (optionnel, en parallèle) aperçu live sur :4321
```

Puis : édite dans l'UI → relis `git diff` → **commit/push toi-même**
(le push sur `main` déclenche le déploiement GitHub Actions habituel).

Port configurable : `ADMIN_PORT=5000 npm run admin`.
URL d'aperçu configurable : `DEV_URL=http://localhost:4321 npm run admin`.

## Ce que ça fait

- Liste, crée, édite et supprime les entrées des 3 collections.
- Formulaires **générés depuis le schéma** (`admin/lib/schema.mjs`), aligné sur
  `src/content/config.ts` → mêmes champs, mêmes enums, mêmes règles que Zod.
- Éditeur de tags/stack en chips avec autocomplétion du vocabulaire existant.
- Validation avant écriture : un fichier invalide n'est jamais écrit (ne casse
  jamais `astro build`).
- Round-trip **sans perte** : styles YAML variés et fin de ligne (CRLF/LF) du
  fichier préservés. Les champs scalaires acceptés par Zod en chaîne *ou* en
  tableau (ex. `status: online`) sont normalisés vers leur forme canonique
  tableau (`status: ["online"]`) sans perte.
- Écriture **atomique** (fichier temporaire + rename) : jamais de `.md` partiel
  ou corrompu, même en cas d'interruption.

## Garanties & garde-fous

- **Identité = nom de fichier.** Le renommage se fait à la main (préserve
  l'historique git, les liens, et `lockInfo` dans `[slug].astro`).
- **Slug ≠ fichier** pour les projets : le champ `slug` pilote l'URL publique
  `/projects/<slug>`. Le modifier change le lien public (averti dans l'UI).
- **Sécurité** (même en local) : serveur lié à `127.0.0.1`, garde
  anti-path-traversal, garde anti-CSRF (en-tête `x-admin-request` + Origin
  same-origin) pour bloquer un POST « drive-by » depuis un site tiers.

## Architecture

```
admin/
  server.mjs           serveur HTTP natif (UI + API JSON), seule dép : js-yaml
  lib/
    schema.mjs         source de vérité des champs + validation (miroir Zod)
    frontmatter.mjs    parse (js-yaml) + sérialisation déterministe, EOL-aware
    content.mjs        accès fichiers + garde anti-traversal + listing
  ui/                  index.html · admin.css · admin.js (vanilla)
  test-roundtrip.mjs   preuve d'intégrité sur tous les fichiers existants
```

## Tester l'intégrité

```bash
npm run admin:test     # parse → validate → serialize → re-parse sur tout le contenu
```

> ⚠ Si tu ajoutes un champ dans `src/content/config.ts`, ajoute-le aussi dans
> `admin/lib/schema.mjs` (sinon l'admin l'ignorerait — et `admin:test`
> signalerait une « clé inconnue du schéma »).
