# Admin local — Hub Portfolio

Dashboard **local, dev uniquement** pour gérer le contenu du portfolio
(projets, certifications, expériences) sans toucher au YAML à la main, et le
**publier en un clic**.

Il écrit directement dans `src/content/**/*.md`. Le site reste **100 %
statique** : aucun backend en production, aucune empreinte dans `dist/`, rien
n'est déployé sur le Pi. Le dossier `admin/` vit hors de `src/` et n'est jamais
buildé par Astro.

## Démarrer

```bash
npm run admin      # → ouvre http://127.0.0.1:4322 dans ton navigateur
```

C'est tout. Pas besoin de lancer autre chose : l'aperçu et la publication se
pilotent depuis les deux boutons en haut à droite de l'admin.

## Utilisation au quotidien

1. **Lance** `npm run admin` et ouvre **http://127.0.0.1:4322**.
2. Choisis une collection (onglets **Projets / Certifications / Expériences**) :
   - **[ + ]** pour créer une entrée,
   - clique une entrée pour l'éditer,
   - **> supprimer** pour la retirer (avec confirmation).
3. Remplis le formulaire puis clique **> enregistrer**. Ça écrit le fichier
   `.md` sur ton disque — **rien n'est encore en ligne**.
4. *(optionnel)* Clique **▶ aperçu** pour voir le rendu réel : le bouton lance
   `npm run dev`, et au bout de ~30 s devient **« aperçu : ouvrir ↗ »**. Tes
   modifications s'y affichent **en direct** (inutile de pusher).
5. Quand c'est bon, clique **⬆ publier** : il liste ce qui va partir, tu mets un
   message, et il fait `commit` + `push`. **Le site public se met à jour tout
   seul (~30 s).**

> **Enregistrer ≠ publier.** Enregistrer écrit le fichier en local ; **publier**
> (bouton ⬆) est le *seul* moment où quelque chose part en ligne. Tu peux donc
> éditer / annuler tranquillement avant de publier.

### Les deux boutons (en haut à droite)

- **▶ aperçu** — lance le serveur d'aperçu (`npm run dev`, Astro sur `:4321`).
  Une fois prêt, le bouton ouvre l'aperçu, et tes éditions s'y reflètent **en
  direct** (le polling est activé pour marcher même sur un disque Windows monté
  dans WSL, où le rechargement auto ne fonctionne pas sinon). L'aperçu est coupé
  proprement quand tu arrêtes l'admin.
- **⬆ publier** — montre les modifications en attente (`git status`), te laisse
  saisir un message, puis `git add -A` + `commit` + `push origin <branche>` →
  déclenche le déploiement GitHub Actions. **C'est ce qui met à jour la prod.**

> Tu peux aussi publier à la main si tu préfères (`git add` / `commit` / `push`)
> — le bouton fait exactement ça.

## Champs & règles par collection

Les formulaires sont **générés depuis le schéma** (`admin/lib/schema.mjs`,
aligné sur `src/content/config.ts`) : mêmes champs, mêmes valeurs autorisées,
mêmes règles que Zod. Points utiles :

- **Tags vs stack** (projets) : `tags` = 2-3 mots **fonctionnels** (ce que
  *fait* le produit), `stack` = les technos. L'admin propose en autocomplétion
  les tags/stack déjà utilisés.
- **Statut** : projets = un ou plusieurs parmi `online · offline · new ·
  updated · in-progress · planned · beta` (online/offline en premier) ; certifs
  = `earned · in-progress · planned`. Le badge et le tri en dépendent.
- **Slug (projets)** : le champ `slug` est l'**URL publique** `/projects/<slug>`.
  Le changer **casse les liens existants** (averti dans l'UI). Laissé vide = il
  est dérivé du nom de fichier.
- **Nom de fichier** = l'identité de l'entrée. **Non renommable** depuis l'admin
  (ça se fait à la main, pour préserver l'historique git et les liens).
- Un **champ requis** manquant, une **date** ou une **URL** invalide → l'écriture
  est **refusée** (rien n'est écrit), le champ fautif est surligné.

## Garanties & sécurité

- **Round-trip sans perte** : styles YAML variés et fin de ligne (CRLF/LF)
  préservés ; écriture **atomique** (jamais de `.md` partiel/corrompu).
- **Validation avant écriture** : impossible d'écrire un fichier qui casserait
  `astro build`.
- **Local uniquement** : serveur lié à `127.0.0.1`, gardes anti-path-traversal
  et anti-CSRF (en-tête `x-admin-request` + Origin same-origin). Aucune surface
  exposée sur le réseau.

## Architecture

```
admin/
  server.mjs         serveur HTTP natif (UI + API JSON), seule dép : js-yaml
  lib/
    schema.mjs       source de vérité des champs + validation (miroir de config.ts)
    frontmatter.mjs  parse (js-yaml) + sérialisation déterministe, EOL-aware
    content.mjs      accès fichiers + garde anti-traversal + listing
    ops.mjs          git (status / publish) + serveur d'aperçu (start / stop)
    errors.mjs       HttpError partagé
  ui/                index.html · admin.css · admin.js (vanilla, thème terminal)
  test-roundtrip.mjs preuve d'intégrité sur tous les fichiers existants
```

Réglages (variables d'env) : `ADMIN_PORT` (défaut `4322`), `DEV_URL`
(défaut `http://localhost:4321`).

## Maintenance

```bash
npm run admin:test   # parse → validate → serialize → re-parse sur tout le contenu
```

> ⚠ Si tu ajoutes un champ dans `src/content/config.ts`, ajoute-le aussi dans
> `admin/lib/schema.mjs` (sinon l'admin l'ignore) — `admin:test` signale toute
> clé de frontmatter inconnue du schéma.
