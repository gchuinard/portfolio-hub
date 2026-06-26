# Gautier Playbook — Hub Portfolio

Portfolio personnel de Gautier Chuinard (Product Owner & QA). Site statique généré avec Astro, déployé via GitHub Actions (rsync) sur un Raspberry Pi auto-hébergé.

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

public/
  images/            ← un aperçu .svg par projet construit (thème terminal)
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
tags: ["tag1", "tag2"]        # 2-3 tags fonctionnels, minuscules (voir note ci-dessous)
status: "new"                 # valeur unique : online | offline | new | updated | in-progress | planned | beta
# ou plusieurs statuts en tableau (ex: online + état de dev) :
# status: ["online", "new"]  — toujours online/offline en premier si présent
stack: ["Tech1", "Tech2"]
featured: true
demo: "https://..."           # optionnel
repo: "https://..."           # optionnel
image: "/images/<slug>.svg"   # optionnel — aperçu SVG (voir note ci-dessous)
---

Corps en markdown (affiché sur la page détail /projects/[slug]).
```

Les projets sont triés par `date` décroissante dans `projects.astro`.

**Tags** — 2-3 tags **fonctionnels** par projet (ce que *fait* le produit : `dashboard`, `vitrine`, `paiement-en-ligne`, `monitoring`…), **pas** de tags techno (la techno vit dans `stack:`). Kebab-case pour les mots composés (`temps-réel`, `back-office`). Les fiches "idée" gardent `idée` + leurs tags conceptuels.

**Aperçu (`image:`)** — chaque projet *construit* a un SVG dans `public/images/<slug>.svg`, au thème terminal phosphore (fenêtre, fond noir, palette verte, glow, scanlines), en 16:9 (`viewBox="0 0 800 450"`), dont le contenu illustre ce que fait le projet. `ProjectCard.astro` et `projects/[slug].astro` n'appliquent **pas** le filtre `sepia/hue-rotate` aux fichiers `.svg` (ce filtre harmonise les captures d'écran ; il décalerait vers le cyan un SVG déjà au thème). Les fiches "idée" n'ont pas d'aperçu.

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

## Admin local (gestion du contenu)

Dashboard **dev uniquement** pour gérer projets / certifications / expériences
sans éditer le YAML à la main : `npm run admin` → `http://127.0.0.1:4322`.

- Écrit directement dans `src/content/**/*.md`, puis on relit `git diff` et on
  commit/push (déploiement auto habituel). **Aucune empreinte en prod** : le
  dossier `admin/` vit hors de `src/`, n'est ni buildé par Astro ni déployé.
- Stack : serveur **HTTP natif Node** (`admin/server.mjs`), seule dépendance
  `js-yaml` (devDependency, déjà tirée par Astro). UI vanilla, thème terminal.
- **Source de vérité** : `admin/lib/schema.mjs` reflète `src/content/config.ts`.
  Si tu ajoutes un champ au schéma Zod, ajoute-le aussi ici, sinon l'admin
  l'ignore. `npm run admin:test` vérifie le round-trip sans perte sur tout le
  contenu (et signale toute clé de frontmatter inconnue du schéma).
- Deux boutons UI : **▶ aperçu** (lance/atteint `npm run dev`, groupe de
  processus tué proprement à l'arrêt) et **⬆ publier** (`git add -A` + commit +
  push → déploiement auto). C'est le seul déclencheur de mise en ligne.
- Garde-fous : identité = **nom de fichier** (renommage manuel) ; le champ
  `slug` projet = URL publique (le changer casse les liens) ; serveur lié à
  `127.0.0.1` + gardes anti-traversal / anti-CSRF. Détails : `admin/README.md`.

## Déploiement

Auto-déploiement via GitHub Actions (`.github/workflows/deploy.yml`) à chaque push sur `main` : build Astro, puis `rsync` de `dist/` vers un Raspberry Pi auto-hébergé.

Quatre secrets repo : `DEPLOY_USER`, `DEPLOY_HOST`, `DEPLOY_PATH`, `DEPLOY_KEY` (clé SSH privée multi-lignes, collée telle quelle). Le workflow écrit la clé dans un fichier temporaire, la valide via `ssh-keygen`, puis lance le `rsync`. Le site est servi par **Nginx Proxy Manager** (homelab Pi mutualisé), derrière Cloudflare (proxy orange) qui laisse passer la CSP mais réécrit HSTS/X-Frame-Options/Referrer-Policy.

## CSP : hashes injectés au build (ne pas casser le JS)

Le proxy sert une **CSP stricte** `script-src 'self' <hashes…>` (PAS `'unsafe-inline'`). Le site a des scripts **inline** (2 `is:inline` obligatoires dans `Base.astro` — thème anti-flash + dico i18n EN — qui doivent tourner avant le 1er rendu, plus des `<script>` bundlés qu'Astro inline) ; chacun doit être autorisé par son hash SHA-256, sinon le navigateur **bloque l'exécution** (`script-src-elem` violation) et le JS paraît « KO ».

Pour ne jamais avoir à maintenir ces hashes à la main :
- `inject-csp-hashes.mjs` tourne **après `astro build`** (cf. `package.json` → `build`). Il scanne `dist/**/*.html`, calcule le SHA-256 de **chaque** script inline (comme le navigateur — Astro n'émet pas de `<meta>` CSP, donc on hashe le contenu nous-mêmes), dédoublonne sur tout le site, et remplace le marqueur de `deploy/nginx-csp.conf` → `deploy/nginx-csp.conf.final`. Échoue le build si 0 hash ou marqueur résiduel (une CSP cassée ne part jamais).
- La CI (`deploy.yml`, étape « Deploy CSP header ») **streame** le `.final` dans le conteneur NPM via `docker exec -i npm sh -c 'cat > /data/nginx/custom/gautier-csp.conf'` (le dossier `/data` de NPM est root → pas de `scp`, et le compte de deploy est dans le groupe docker), puis `nginx -t && nginx -s reload`. L'étape est **sautée** si `CSP_CONF_PATH` (repo *Variable* ou *Secret*) n'est pas défini ; `NPM_CONTAINER` vaut `npm` par défaut.
- Côté **NPM** (proxy_host id 7, base `database.sqlite`), la custom location `/` a son `advanced_config` = `include /data/nginx/custom/gautier-csp.conf;` + COOP/Permissions-Policy/CORP. Persisté **en base** → survit aux régénérations NPM. Servi à travers Cloudflare (orange) qui transmet la CSP telle quelle (vérifié : 9 hashes côté public).
- `deploy/nginx-csp.conf.final` est un artefact de build (gitignoré). Les hashes sont **stables** tant qu'un script inline n'est pas modifié → un deploy sans changement de script ne touche pas la CSP.

⚠️ Si tu modifies un `<script>`/`is:inline`, son hash change : c'est **automatique** au prochain build+deploy. Ne jamais coller `'unsafe-inline'` dans `script-src` pour « débloquer » — ça annule la CSP (et la note Sonar).

## Ce qu'il ne faut pas faire

- Ne pas ajouter de `border-radius` — l'esthétique est volontairement angulaire.
- Ne pas toucher au script `is:inline` de `Base.astro` sans mettre à jour les deux versions FR et EN.
- Ne pas utiliser `getStaticPaths` manuel pour les projets — le routing dynamique `[slug].astro` s'appuie sur `getCollection("projects")`.
- Ne pas installer de framework JS (React, Vue…) — tout est Astro vanilla + scripts `<script type="module">`.
- Ne pas mettre de tags techno dans `tags:` — la techno va dans `stack:`, les tags décrivent la fonction.
