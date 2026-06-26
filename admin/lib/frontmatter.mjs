// ─────────────────────────────────────────────────────────────────────────
// Lecture / écriture du frontmatter Markdown — cœur d'intégrité des données.
//
// LECTURE  : js-yaml avec JSON_SCHEMA. Conséquence clé : les dates YAML
//            (2024-03-12) restent des CHAÎNES "2024-03-12" — aucune
//            conversion Date → aucun décalage de fuseau horaire, round-trip
//            stable. Gère CRLF/LF, guillemets ou non, séquences block (- x)
//            ou flow ([x, y]).
//
// ÉCRITURE : sérialisation maison, déterministe, pilotée par le schéma.
//            Astuce centrale : une chaîne encodée en JSON est un scalaire
//            YAML double-quote VALIDE (JSON ⊂ YAML 1.2). On délègue donc
//            l'échappement à JSON.stringify — robuste pour apostrophes,
//            guillemets, accents, deux-points, retours ligne, etc.
//            Les dates sont écrites en clair (sans guillemets) pour coller
//            au style des fichiers existants.
//
// L'EOL (\r\n ou \n) du fichier d'origine est préservé à la réécriture.
// ─────────────────────────────────────────────────────────────────────────

import yaml from "js-yaml";
import { COLLECTIONS } from "./schema.mjs";
import { HttpError } from "./errors.mjs";

const FM_RE = /^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?([\s\S]*)$/;

/** Détecte l'EOL dominant d'un texte ("\r\n" si présent, sinon "\n"). */
export function detectEol(text) {
  return /\r\n/.test(text) ? "\r\n" : "\n";
}

/**
 * Découpe un fichier .md en { frontmatter(brut), body, eol }.
 * Si aucun frontmatter, frontmatter = "" et body = tout le contenu.
 */
export function splitFrontmatter(raw) {
  const eol = detectEol(raw);
  const m = raw.match(FM_RE);
  if (!m) {
    return { frontmatter: "", body: raw.replace(/^﻿/, ""), eol };
  }
  return { frontmatter: m[1], body: m[2] ?? "", eol };
}

/**
 * Parse un fichier .md complet → { data, body, eol }.
 * `data` : objet issu du YAML (dates = chaînes), body normalisé en \n.
 */
export function parseEntry(raw) {
  const { frontmatter, body, eol } = splitFrontmatter(raw);
  let data = {};
  if (frontmatter.trim() !== "") {
    const loaded = yaml.load(frontmatter, { schema: yaml.JSON_SCHEMA });
    if (loaded && typeof loaded === "object" && !Array.isArray(loaded)) {
      data = loaded;
    }
  }
  return { data, body: normalizeBody(body), eol };
}

/** Normalise le corps : EOL → \n, retire les retours en tête, trim de fin. */
function normalizeBody(body) {
  return body.replace(/\r\n/g, "\n").replace(/^\n+/, "").replace(/[ \t\r\n]+$/, "");
}

/** Encode une chaîne comme scalaire YAML double-quote (via JSON). */
function yamlString(s) {
  return JSON.stringify(String(s));
}

/** Sérialise une valeur de champ en une ligne YAML `key: …` (ou null si omise). */
function serializeField(field, value) {
  const omit = () => null;

  switch (field.type) {
    case "string":
    case "text":
    case "url": {
      if (value == null || String(value).trim() === "") return omit();
      return `${field.key}: ${yamlString(String(value).trim())}`;
    }
    case "date": {
      if (value == null || String(value).trim() === "") return omit();
      // En clair, sans guillemets — style des fichiers existants.
      return `${field.key}: ${String(value).trim()}`;
    }
    case "boolean": {
      const b = value === true || value === "true";
      if (!b && field.omitWhenFalse !== false) return omit();
      return `${field.key}: ${b}`;
    }
    case "stringArray":
    case "enumArray": {
      const arr = Array.isArray(value)
        ? value.map((s) => String(s).trim()).filter((s) => s !== "")
        : [];
      if (arr.length === 0) return omit();
      return `${field.key}: [${arr.map(yamlString).join(", ")}]`;
    }
    case "enum": {
      if (value == null || String(value).trim() === "") {
        if (field.default !== undefined) return `${field.key}: ${yamlString(field.default)}`;
        return omit();
      }
      return `${field.key}: ${yamlString(String(value).trim())}`;
    }
    default:
      return omit();
  }
}

/**
 * Construit le contenu complet d'un fichier .md à partir de data + body.
 * @param {string} collectionName
 * @param {object} data   valeurs validées (cf. schema.validateEntry)
 * @param {string} body   corps markdown
 * @param {string} eol    fin de ligne à utiliser ("\r\n" | "\n")
 */
export function serializeEntry(collectionName, data, body, eol = "\n") {
  const col = COLLECTIONS[collectionName];
  if (!col) throw new HttpError(400, `Collection inconnue: ${collectionName}`);

  const lines = [];
  for (const field of col.fields) {
    const line = serializeField(field, data[field.key]);
    if (line !== null) lines.push(line);
  }

  const fm = `---${eol}${lines.join(eol)}${eol}---${eol}`;
  const cleanBody = normalizeBody(body ?? "");
  if (cleanBody === "") return fm;
  return `${fm}${eol}${cleanBody.replace(/\n/g, eol)}${eol}`;
}
