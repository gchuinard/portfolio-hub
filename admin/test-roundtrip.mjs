// ─────────────────────────────────────────────────────────────────────────
// Test de round-trip — preuve d'intégrité des données.
//
//   parse(raw) → validate → serialize → parse → validate
//
// Vérifie, sur TOUS les fichiers de contenu réels :
//   1. la validation passe (le contenu existant respecte le schéma) ;
//   2. aucune clé de frontmatter n'est inconnue du schéma (sinon l'admin
//      l'effacerait silencieusement à l'enregistrement) ;
//   3. idempotence : re-sérialiser des données déjà passées par l'admin
//      ne dérive pas (données identiques) ;
//   4. le corps markdown est préservé ;
//   5. l'EOL du fichier est préservé.
//
// Usage : node admin/test-roundtrip.mjs
// ─────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { COLLECTIONS } from "./lib/schema.mjs";
import { validateEntry } from "./lib/schema.mjs";
import { parseEntry, serializeEntry } from "./lib/frontmatter.mjs";
import { CONTENT_DIR } from "./lib/content.mjs";

let pass = 0;
let fail = 0;
const problems = [];

function fmt(v) {
  return JSON.stringify(v);
}

for (const [name, col] of Object.entries(COLLECTIONS)) {
  const knownKeys = new Set(col.fields.map((f) => f.key));
  const dir = path.join(CONTENT_DIR, col.dir);
  let files = [];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.toLowerCase().endsWith(".md"));
  } catch {
    problems.push(`[${name}] dossier introuvable: ${dir}`);
    continue;
  }

  for (const file of files) {
    const id = `${name}/${file}`;
    const raw = await fs.readFile(path.join(dir, file), "utf8");
    try {
      const parsed = parseEntry(raw);

      // (2) clés inconnues du schéma
      for (const k of Object.keys(parsed.data)) {
        if (!knownKeys.has(k)) {
          problems.push(`[${id}] clé de frontmatter INCONNUE du schéma: "${k}" (serait effacée à l'enregistrement)`);
        }
      }

      // (1) validation
      const v1 = validateEntry(name, parsed.data);
      if (!v1.ok) {
        problems.push(`[${id}] validation échoue: ${fmt(v1.errors)}`);
        fail++;
        continue;
      }

      // write path
      const out = serializeEntry(name, v1.data, parsed.body, parsed.eol);
      const reparsed = parseEntry(out);
      const v2 = validateEntry(name, reparsed.data);

      // (3) idempotence des données
      assert.deepStrictEqual(v2.data, v1.data, `${id}: dérive de données après round-trip`);

      // (4) corps préservé
      assert.strictEqual(reparsed.body, parsed.body, `${id}: corps markdown modifié`);

      // (5) EOL préservé
      const expectCRLF = parsed.eol === "\r\n";
      const hasCRLF = /\r\n/.test(out);
      assert.strictEqual(hasCRLF, expectCRLF, `${id}: EOL non préservé (attendu CRLF=${expectCRLF})`);

      // idempotence 2e passe (serialize(serialize) stable au texte près de l'EOL)
      const out2 = serializeEntry(name, v2.data, reparsed.body, reparsed.eol);
      assert.strictEqual(out2, out, `${id}: sérialisation non idempotente au niveau texte`);

      pass++;
    } catch (e) {
      fail++;
      problems.push(`[${id}] ${e.message}`);
    }
  }
}

console.log(`\n  Round-trip : ${pass} OK, ${fail} KO`);
if (problems.length) {
  console.log("\n  Problèmes :");
  for (const p of problems) console.log("   - " + p);
  process.exitCode = 1;
} else {
  console.log("  ✓ Aucune perte de données, validation OK, EOL préservé, idempotent.\n");
}
