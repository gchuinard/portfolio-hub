// ─────────────────────────────────────────────────────────────────────────
// Serveur d'admin LOCAL (dev uniquement).
//
//   $ npm run admin   →   http://127.0.0.1:4322
//
// Sert une UI vanilla et une API JSON qui lit/écrit directement les fichiers
// src/content/**/*.md. Aucune empreinte en production : ce dossier vit hors
// de src/, n'est jamais buildé par Astro ni déployé sur le Pi.
//
// Sécurité (même en local) :
//   - bind sur 127.0.0.1 (jamais exposé sur le réseau) ;
//   - garde anti-path-traversal dans content.mjs ;
//   - garde anti-CSRF : Host doit être localhost, et toute requête mutante
//     exige l'en-tête x-admin-request + une Origin same-origin (bloque les
//     POST « drive-by » depuis un site tiers ouvert dans le navigateur).
//
// Workflow : éditer → relire `git diff` → commit/push (déploiement auto).
// ─────────────────────────────────────────────────────────────────────────

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COLLECTIONS, COLLECTION_KEYS, validateEntry } from "./lib/schema.mjs";
import {
  listEntries,
  readEntry,
  writeEntry,
  deleteEntry,
  entryExists,
  collectVocabulary,
  slugifyFilename,
  collectionDir,
  HttpError,
  PROJECT_ROOT,
} from "./lib/content.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI_DIR = path.join(HERE, "ui");
const PORT = Number(process.env.ADMIN_PORT) || 4322;
const HOST = "127.0.0.1";
const DEV_URL = process.env.DEV_URL || "http://localhost:4321";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

// ── Helpers réponse ───────────────────────────────────────────────────────
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(body);
}

async function sendStatic(res, file) {
  const ext = path.extname(file).toLowerCase();
  try {
    const buf = await fs.readFile(file);
    res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream", "cache-control": "no-store" });
    res.end(buf);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

function readBody(req, limit = 1_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new HttpError(413, "Corps de requête trop volumineux."));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// ── Gardes sécurité ───────────────────────────────────────────────────────
function isLocalHost(req) {
  const host = String(req.headers.host || "");
  const h = host.split(":")[0];
  return h === "127.0.0.1" || h === "localhost" || h === "[::1]";
}

function assertSafeMutation(req) {
  // Bloque le CSRF/drive-by : seules nos propres requêtes fetch (qui posent
  // l'en-tête custom) sont acceptées ; une Origin tierce est refusée.
  if (req.headers["x-admin-request"] !== "1") {
    throw new HttpError(403, "En-tête x-admin-request manquant.");
  }
  const origin = req.headers.origin;
  if (origin) {
    try {
      const u = new URL(origin);
      const h = u.hostname;
      const localHost = h === "127.0.0.1" || h === "localhost" || h === "::1";
      // On valide aussi le PORT : sinon un service local sur un autre port
      // (127.0.0.1:3000) pourrait monter un CSRF cross-port.
      const samePort = !u.port || u.port === String(PORT);
      if (!localHost || !samePort) {
        throw new HttpError(403, "Origin non autorisée.");
      }
    } catch (e) {
      if (e instanceof HttpError) throw e;
      throw new HttpError(403, "Origin invalide.");
    }
  }
}

/** Refuse une collection inconnue en amont (400 cohérent plutôt que 404). */
function assertKnownCollection(col) {
  if (!COLLECTION_KEYS.includes(col)) {
    throw new HttpError(400, "Collection invalide.");
  }
}

// ── Handlers API ──────────────────────────────────────────────────────────
function schemaPayload() {
  return {
    collections: Object.fromEntries(
      COLLECTION_KEYS.map((k) => {
        const c = COLLECTIONS[k];
        return [
          k,
          {
            label: c.label,
            dir: c.dir,
            routed: c.routed,
            titleField: c.titleField,
            subtitleField: c.subtitleField,
            fields: c.fields,
          },
        ];
      })
    ),
    order: COLLECTION_KEYS,
    devUrl: DEV_URL,
  };
}

async function handleApi(req, res, url) {
  const { pathname, searchParams } = url;
  const method = req.method;

  if (pathname === "/api/schema" && method === "GET") {
    return sendJson(res, 200, schemaPayload());
  }

  if (pathname === "/api/list" && method === "GET") {
    const col = searchParams.get("collection");
    if (col) {
      assertKnownCollection(col);
      return sendJson(res, 200, { entries: await listEntries(col) });
    }
    const out = {};
    for (const k of COLLECTION_KEYS) out[k] = await listEntries(k);
    return sendJson(res, 200, { all: out });
  }

  if (pathname === "/api/vocabulary" && method === "GET") {
    const col = searchParams.get("collection");
    assertKnownCollection(col);
    return sendJson(res, 200, await collectVocabulary(col));
  }

  if (pathname === "/api/entry" && method === "GET") {
    const col = searchParams.get("collection");
    assertKnownCollection(col);
    const file = searchParams.get("file");
    return sendJson(res, 200, await readEntry(col, file));
  }

  if (pathname === "/api/check-filename" && method === "POST") {
    assertSafeMutation(req);
    const { collection, file } = JSON.parse((await readBody(req)) || "{}");
    return sendJson(res, 200, { available: !(await entryExists(collection, file)) });
  }

  if (pathname === "/api/suggest-filename" && method === "GET") {
    const title = searchParams.get("title") || "";
    return sendJson(res, 200, { file: `${slugifyFilename(title)}.md` });
  }

  if (pathname === "/api/entry" && method === "POST") {
    assertSafeMutation(req);
    const payload = JSON.parse((await readBody(req)) || "{}");
    const { collection, file, body = "", create = false } = payload;
    if (!COLLECTION_KEYS.includes(collection)) {
      throw new HttpError(400, "Collection invalide.");
    }
    const exists = await entryExists(collection, file);
    if (create && exists) {
      return sendJson(res, 409, { error: "Un fichier porte déjà ce nom." });
    }
    if (!create && !exists) {
      throw new HttpError(404, "Entrée à modifier introuvable.");
    }
    const { ok, errors, data } = validateEntry(collection, payload.data || {});
    if (!ok) {
      return sendJson(res, 422, { error: "Validation échouée.", errors });
    }
    const result = await writeEntry(collection, file, data, body);
    return sendJson(res, 200, { ok: true, ...result, created: create });
  }

  if (pathname === "/api/entry" && method === "DELETE") {
    assertSafeMutation(req);
    const col = searchParams.get("collection");
    assertKnownCollection(col);
    const file = searchParams.get("file");
    return sendJson(res, 200, await deleteEntry(col, file));
  }

  throw new HttpError(404, "Route API inconnue.");
}

// ── Serveur ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  try {
    if (!isLocalHost(req)) {
      return sendJson(res, 403, { error: "Accès local uniquement." });
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    const { pathname } = url;

    if (pathname.startsWith("/api/")) {
      return await handleApi(req, res, url);
    }

    // Fichiers statiques de l'UI.
    if (pathname === "/" || pathname === "/index.html") {
      return await sendStatic(res, path.join(UI_DIR, "index.html"));
    }
    const asset = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "").replace(/^[/\\]+/, "");
    const assetPath = path.join(UI_DIR, asset);
    if (!assetPath.startsWith(UI_DIR + path.sep)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    return await sendStatic(res, assetPath);
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    if (status >= 500) console.error(e);
    sendJson(res, status, { error: e.message || "Erreur serveur", ...(e.extra ? { details: e.extra } : {}) });
  }
});

async function warnMissingCollections() {
  for (const k of COLLECTION_KEYS) {
    try {
      await fs.access(collectionDir(k));
    } catch {
      console.warn(`  ⚠ dossier de collection absent : src/content/${COLLECTIONS[k].dir}/ (collection "${k}")`);
    }
  }
}

server.listen(PORT, HOST, () => {
  warnMissingCollections();
  const rel = path.relative(process.cwd(), PROJECT_ROOT) || ".";
  console.log(`\n  ┌────────────────────────────────────────────────────┐`);
  console.log(`  │  Hub Portfolio — admin local                       │`);
  console.log(`  └────────────────────────────────────────────────────┘`);
  console.log(`  → http://${HOST}:${PORT}`);
  console.log(`  contenu : ${path.join(rel, "src", "content")}`);
  console.log(`  preview : lance \`npm run dev\` (${DEV_URL}) en parallèle\n`);
  console.log(`  Édite, puis relis \`git diff\` et commit/push toi-même.\n`);
});
