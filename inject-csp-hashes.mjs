/*
 * Build-time : calcule les hashes SHA-256 de TOUS les scripts inline du build Astro
 * et les injecte dans le header CSP de nginx (placeholder __CSP_SCRIPT_HASHES__).
 *
 * Différence avec SvelteKit (cf. gotyeah-monitor) : Astro N'ÉMET PAS de <meta> CSP,
 * donc on ne peut pas se contenter de greper des `sha256-...` déjà présents — on
 * calcule nous-mêmes le hash du contenu exact de chaque <script> sans `src`, comme
 * le fait le navigateur (vérifié : identique au hash que Firefox/Chrome réclame).
 *
 * Robustesse :
 *   - scanne TOUTES les pages de dist/ (chaque page a ses propres scripts inline),
 *     dédoublonne, et liste l'union → un seul header CSP couvre tout le site ;
 *   - échoue le build (exit 1) si 0 hash trouvé, si le placeholder est absent, ou
 *     s'il subsiste après substitution → une CSP cassée ne part jamais en prod.
 *
 * Lancé après `astro build` (voir package.json → "build").
 * Entrée : deploy/nginx-csp.conf  ·  Sortie : deploy/nginx-csp.conf.final
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DIST = "dist";
const TEMPLATE = "deploy/nginx-csp.conf";
const OUTPUT = "deploy/nginx-csp.conf.final";
const PLACEHOLDER = "__CSP_SCRIPT_HASHES__";

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

if (!fs.existsSync(DIST)) {
  console.error(`[inject-csp] dossier ${DIST}/ absent — lance d'abord 'astro build'`);
  process.exit(1);
}

const htmlFiles = walk(DIST).filter((f) => f.endsWith(".html"));
// Capture le contenu exact entre <script ...> et </script> (ce que le navigateur hashe).
const reScript = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const hashes = new Map(); // hash -> Set(pages) (utile pour les logs)

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  let m;
  while ((m = reScript.exec(html))) {
    const attrs = m[1] || "";
    const body = m[2] || "";
    if (/\bsrc\s*=/i.test(attrs)) continue; // script externe → couvert par 'self'
    if (body.trim() === "") continue;
    const hash = "sha256-" + crypto.createHash("sha256").update(body, "utf8").digest("base64");
    if (!hashes.has(hash)) hashes.set(hash, new Set());
    hashes.get(hash).add(path.relative(DIST, file));
  }
}

if (hashes.size === 0) {
  console.error(`[inject-csp] aucun script inline trouvé dans ${DIST}/*.html — extraction cassée ?`);
  process.exit(1);
}

const scriptSrc = [...hashes.keys()].map((h) => `'${h}'`).join(" ");

let conf = fs.readFileSync(TEMPLATE, "utf8");
if (!conf.includes(PLACEHOLDER)) {
  console.error(`[inject-csp] placeholder ${PLACEHOLDER} absent de ${TEMPLATE}`);
  process.exit(1);
}
conf = conf.replaceAll(PLACEHOLDER, scriptSrc);
if (conf.includes(PLACEHOLDER)) {
  console.error(`[inject-csp] placeholder encore présent après substitution`);
  process.exit(1);
}

fs.writeFileSync(OUTPUT, conf);
console.log(`[inject-csp] ${hashes.size} hash(es) inline injecté(s) dans ${OUTPUT} :`);
for (const [h, pages] of hashes) {
  console.log(`  ${h}  (${pages.size} page${pages.size > 1 ? "s" : ""})`);
}
