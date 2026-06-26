// ─────────────────────────────────────────────────────────────────────────
// Accès aux fichiers de contenu (src/content/<collection>/*.md).
//
// Sécurité : tout nom de fichier est validé ET re-vérifié après résolution
// (le chemin résolu DOIT rester dans le dossier de la collection) — garde
// anti-path-traversal en profondeur, même si l'admin tourne en local.
// L'identité d'une entrée est son NOM DE FICHIER (pas le slug d'URL).
// ─────────────────────────────────────────────────────────────────────────

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COLLECTIONS, getCollection } from "./schema.mjs";
import { parseEntry, serializeEntry } from "./frontmatter.mjs";
import { HttpError } from "./errors.mjs";

export { HttpError };

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(HERE, "..", "..");
export const CONTENT_DIR = path.join(PROJECT_ROOT, "src", "content");

// Noms réservés Windows (API Win32) : un fichier ainsi nommé devient
// inaccessible sur un volume Windows (le contenu vit sous /mnt/c), donc orphelin.
const WIN_RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;

/** Chemin absolu (validé) du dossier d'une collection. */
export function collectionDir(collectionName) {
  const col = getCollection(collectionName);
  if (!col) throw new HttpError(404, `Collection inconnue: ${collectionName}`);
  return path.join(CONTENT_DIR, col.dir);
}

/** Valide un nom de fichier et renvoie son chemin absolu sûr. */
export function safeEntryPath(collectionName, file) {
  if (typeof file !== "string" || file === "") {
    throw new HttpError(400, "Nom de fichier manquant.");
  }
  if (
    file.includes("/") ||
    file.includes("\\") ||
    file.includes("\0") ||
    file.includes("..") ||
    file === "." ||
    file.startsWith(".")
  ) {
    throw new HttpError(400, "Nom de fichier invalide.");
  }
  if (!file.toLowerCase().endsWith(".md")) {
    throw new HttpError(400, "Le fichier doit se terminer par .md");
  }
  if (WIN_RESERVED.test(file)) {
    throw new HttpError(400, "Nom de fichier réservé (Windows) — choisis-en un autre.");
  }
  const dir = collectionDir(collectionName);
  const resolved = path.resolve(dir, file);
  // Garde finale : le chemin résolu doit rester dans le dossier de collection.
  if (resolved !== path.join(dir, file) || !resolved.startsWith(dir + path.sep)) {
    throw new HttpError(400, "Chemin de fichier hors périmètre.");
  }
  return resolved;
}

/** Nom de fichier propre pour une NOUVELLE entrée (kebab-case strict). */
export function slugifyFilename(input) {
  const base = String(input)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire les diacritiques
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "sans-titre";
}

/** Slug d'URL par défaut dérivé du nom de fichier (approxime Astro). */
function defaultSlugFromFile(file) {
  return file.replace(/\.md$/i, "").toLowerCase().replace(/\s+/g, "-");
}

async function readRaw(absPath) {
  return fs.readFile(absPath, "utf8");
}

/** Liste légère d'une collection, triée pour l'affichage. */
export async function listEntries(collectionName) {
  const col = getCollection(collectionName);
  if (!col) throw new HttpError(404, `Collection inconnue: ${collectionName}`);
  const dir = collectionDir(collectionName);

  let files = [];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.toLowerCase().endsWith(".md"));
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }

  const entries = [];
  for (const file of files) {
    try {
      const raw = await readRaw(path.join(dir, file));
      const { data } = parseEntry(raw);
      entries.push({
        file,
        collection: collectionName,
        title: data[col.titleField] ?? file,
        subtitle: data[col.subtitleField] ?? "",
        slug: col.routed ? (data.slug || defaultSlugFromFile(file)) : null,
        slugExplicit: col.routed ? Boolean(data.slug) : false,
        status: data.status ?? null,
        date: data.date ?? data.issueDate ?? data.startDate ?? null,
        featured: data.featured === true,
      });
    } catch {
      entries.push({ file, collection: collectionName, title: file, subtitle: "⚠ parse error", broken: true });
    }
  }

  // Tri : par date décroissante quand dispo, sinon par titre.
  entries.sort((a, b) => {
    if (a.date && b.date) return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    return String(a.title).localeCompare(String(b.title));
  });
  return entries;
}

/** Lecture complète d'une entrée. */
export async function readEntry(collectionName, file) {
  const abs = safeEntryPath(collectionName, file);
  let raw;
  try {
    raw = await readRaw(abs);
  } catch (e) {
    if (e.code === "ENOENT") throw new HttpError(404, "Entrée introuvable.");
    throw e;
  }
  const { data, body, eol } = parseEntry(raw);
  return { file, collection: collectionName, data, body, eol, raw };
}

/** Existence d'un fichier d'entrée. */
export async function entryExists(collectionName, file) {
  const abs = safeEntryPath(collectionName, file);
  try {
    await fs.access(abs);
    return true;
  } catch {
    return false;
  }
}

/**
 * Écrit une entrée (création ou mise à jour).
 * Préserve l'EOL du fichier existant ; LF par défaut pour un nouveau fichier.
 */
export async function writeEntry(collectionName, file, data, body) {
  const abs = safeEntryPath(collectionName, file);
  let eol = "\n";
  try {
    const existing = await readRaw(abs);
    eol = parseEntry(existing).eol;
  } catch {
    /* nouveau fichier → LF */
  }
  const content = serializeEntry(collectionName, data, body, eol);
  // Écriture atomique : temp unique puis rename (même dossier = même FS) → jamais
  // de fichier partiel/corrompu, même en cas d'interruption. (Outil mono-utilisateur :
  // on n'ajoute pas de verrou inter-requêtes, le dernier enregistrement gagne.)
  const tmp = `${abs}.${process.pid}.${Date.now()}.tmp`;
  try {
    await fs.writeFile(tmp, content, "utf8");
    await fs.rename(tmp, abs);
  } catch (e) {
    await fs.rm(tmp, { force: true }).catch(() => {});
    throw e;
  }
  return { file, bytes: Buffer.byteLength(content, "utf8") };
}

/** Suppression d'une entrée. */
export async function deleteEntry(collectionName, file) {
  const abs = safeEntryPath(collectionName, file);
  try {
    await fs.unlink(abs);
  } catch (e) {
    if (e.code === "ENOENT") throw new HttpError(404, "Entrée introuvable.");
    throw e;
  }
  return { file, deleted: true };
}

/** Vocabulaire existant (tags + stack) d'une collection, pour l'autocomplétion. */
export async function collectVocabulary(collectionName) {
  const entries = await listVocabularySource(collectionName);
  const tags = new Set();
  const stack = new Set();
  for (const data of entries) {
    for (const t of data.tags ?? []) tags.add(t);
    for (const s of data.stack ?? []) stack.add(s);
  }
  return { tags: [...tags].sort(), stack: [...stack].sort() };
}

async function listVocabularySource(collectionName) {
  const dir = collectionDir(collectionName);
  let files = [];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.toLowerCase().endsWith(".md"));
  } catch {
    return [];
  }
  const out = [];
  for (const file of files) {
    try {
      out.push(parseEntry(await readRaw(path.join(dir, file))).data);
    } catch {
      /* ignore */
    }
  }
  return out;
}

export { defaultSlugFromFile };
