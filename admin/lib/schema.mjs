// ─────────────────────────────────────────────────────────────────────────
// Schéma des collections — SOURCE DE VÉRITÉ unique de l'admin.
//
// Doit rester aligné sur src/content/config.ts (les schémas Zod d'Astro).
// L'ordre des champs dans `fields` = l'ordre d'écriture dans le frontmatter
// (choisi pour coller au style des fichiers existants → diff minimal).
//
// Types :
//   string      scalaire texte court
//   text        scalaire texte long (textarea côté UI)
//   url         comme string mais validé comme URL (http/https)
//   date        YYYY-MM-DD (écrit en clair, sans guillemets)
//   boolean     true / false (omis si false quand omitWhenFalse=true)
//   stringArray tableau de chaînes (tags, stack)
//   enum        une valeur parmi options
//   enumArray   sous-ensemble de options (status projet)
// ─────────────────────────────────────────────────────────────────────────

export const PROJECT_STATUS = [
  "online",
  "offline",
  "new",
  "updated",
  "in-progress",
  "planned",
  "beta",
];

export const CERT_STATUS = ["earned", "in-progress", "planned"];

export const EXPERIENCE_TYPES = ["CDI", "CDD", "alternance", "stage", "freelance"];

export const COLLECTIONS = {
  projects: {
    label: "Projets",
    dir: "projects",
    routed: true, // possède une route publique /projects/[slug]
    titleField: "title",
    subtitleField: "description",
    fields: [
      { key: "title", type: "string", required: true, hint: "Titre FR" },
      { key: "titleEn", type: "string", hint: "Titre EN (optionnel)" },
      { key: "description", type: "text", required: true, hint: "Description FR" },
      { key: "descriptionEn", type: "text", hint: "Description EN (optionnel)" },
      { key: "date", type: "date", required: true, hint: "Tri du hub (décroissant)" },
      {
        key: "slug",
        type: "string",
        hint: "URL publique /projects/<slug>. Vide = dérivé du nom de fichier. ⚠ La changer casse les liens existants.",
      },
      {
        key: "tags",
        type: "stringArray",
        hint: "2-3 tags FONCTIONNELS, minuscules (ce que fait le produit). Pas de techno ici.",
      },
      { key: "stack", type: "stringArray", hint: "Technologies (la techno vit ici, pas dans tags)." },
      { key: "image", type: "string", hint: "Aperçu, ex: /images/<slug>.svg" },
      {
        key: "status",
        type: "enumArray",
        options: PROJECT_STATUS,
        hint: "online/offline en premier si présent.",
      },
      { key: "featured", type: "boolean", omitWhenFalse: true },
      { key: "live", type: "url", hint: "URL du site en ligne (optionnel)" },
      { key: "demo", type: "url", hint: "URL de démo (optionnel)" },
      { key: "repo", type: "url", hint: "URL du dépôt (optionnel)" },
      { key: "repoPrivate", type: "boolean", omitWhenFalse: true, hint: "Dépôt privé → bouton [LOCKED]" },
      { key: "bodyEn", type: "text", hint: "Corps EN (markdown), affiché en anglais à la place du body FR. Vide = le body FR reste affiché." },
    ],
  },

  certifications: {
    label: "Certifications",
    dir: "certifications",
    routed: false,
    titleField: "title",
    subtitleField: "issuer",
    fields: [
      { key: "title", type: "string", required: true, hint: "Nom de la certification" },
      { key: "issuer", type: "string", required: true, hint: "Organisme émetteur" },
      { key: "issueDate", type: "date", required: true, hint: "Date d'obtention (ou cible)" },
      { key: "expiryDate", type: "date", hint: "Date d'expiration (optionnel)" },
      { key: "credentialId", type: "string", hint: "Identifiant du certificat (optionnel)" },
      { key: "credentialUrl", type: "url", hint: "Lien de vérification (optionnel)" },
      {
        // Astro : z.enum(...).optional().default("earned") → optionnel + défaut.
        key: "status",
        type: "enum",
        options: CERT_STATUS,
        default: "earned",
      },
      { key: "tags", type: "stringArray", hint: "Domaines : produit, agile, data…" },
      { key: "logo", type: "string", hint: "Logo, ex: /certifications/<slug>.svg" },
    ],
  },

  experiences: {
    label: "Expériences",
    dir: "experiences",
    routed: false,
    titleField: "title",
    subtitleField: "company",
    fields: [
      { key: "title", type: "string", required: true, hint: "Intitulé du poste FR" },
      { key: "titleEn", type: "string", hint: "Intitulé EN (optionnel)" },
      { key: "company", type: "string", required: true, hint: "Entreprise" },
      { key: "location", type: "string", hint: "Lieu (optionnel)" },
      { key: "type", type: "enum", options: EXPERIENCE_TYPES, required: true },
      { key: "startDate", type: "date", required: true },
      { key: "endDate", type: "date", hint: "Vide si poste actuel" },
      { key: "current", type: "boolean", omitWhenFalse: false, hint: "Poste actuel" },
      { key: "tags", type: "stringArray" },
      { key: "description", type: "text", hint: "Description FR (optionnel)" },
      { key: "descriptionEn", type: "text", hint: "Description EN (optionnel)" },
    ],
  },
};

export const COLLECTION_KEYS = Object.keys(COLLECTIONS);

export function getCollection(name) {
  return COLLECTIONS[name] ?? null;
}

export function getField(collectionName, key) {
  const col = COLLECTIONS[collectionName];
  if (!col) return null;
  return col.fields.find((f) => f.key === key) ?? null;
}

// Valeurs textuelles considérées comme « vides » (non écrites pour un champ optionnel).
function isEmpty(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(s) {
  if (!DATE_RE.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function isHttpUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Validation : renvoie { ok, errors: {champ: message}, data: dataNettoyée }.
// Reproduit côté serveur les garanties des schémas Zod, pour ne JAMAIS
// écrire un fichier qui ferait échouer `astro build`.
// ─────────────────────────────────────────────────────────────────────────
export function validateEntry(collectionName, raw) {
  const col = COLLECTIONS[collectionName];
  if (!col) return { ok: false, errors: { _: `Collection inconnue: ${collectionName}` }, data: {} };

  const errors = {};
  const data = {};

  for (const field of col.fields) {
    let value = raw[field.key];

    switch (field.type) {
      case "string":
      case "text":
      case "url": {
        if (typeof value !== "string") value = value == null ? "" : String(value);
        value = value.replace(/\r\n/g, "\n").trim();
        if (isEmpty(value)) {
          if (field.required) errors[field.key] = "Champ requis.";
          continue; // optionnel vide → non écrit
        }
        if (field.type === "url" && !isHttpUrl(value)) {
          errors[field.key] = "URL invalide (http/https attendu).";
          continue;
        }
        data[field.key] = value;
        break;
      }

      case "date": {
        if (isEmpty(value)) {
          if (field.required) errors[field.key] = "Date requise.";
          continue;
        }
        value = String(value).trim();
        if (!isRealDate(value)) {
          errors[field.key] = "Date invalide (format AAAA-MM-JJ attendu).";
          continue;
        }
        data[field.key] = value;
        break;
      }

      case "boolean": {
        data[field.key] = value === true || value === "true";
        break;
      }

      case "stringArray": {
        let arr;
        if (Array.isArray(value)) arr = value;
        else if (typeof value === "string") arr = value.split(",");
        else if (value == null) arr = [];
        else {
          // number / boolean / objet : type malformé → on ne l'avale pas en silence
          errors[field.key] = `Valeur invalide (tableau ou chaîne attendu, reçu ${typeof value}).`;
          continue;
        }
        arr = arr.map((s) => String(s).trim()).filter((s) => s !== "");
        // dédoublonnage en préservant l'ordre
        arr = [...new Set(arr)];
        if (arr.length === 0) {
          if (field.required) errors[field.key] = "Au moins une valeur requise.";
          continue;
        }
        data[field.key] = arr;
        break;
      }

      case "enum": {
        if (isEmpty(value)) {
          if (field.default !== undefined) {
            data[field.key] = field.default;
            break;
          }
          if (field.required) errors[field.key] = "Valeur requise.";
          continue;
        }
        value = String(value).trim();
        if (!field.options.includes(value)) {
          errors[field.key] = `Valeur invalide (attendu: ${field.options.join(", ")}).`;
          continue;
        }
        data[field.key] = value;
        break;
      }

      case "enumArray": {
        // config.ts accepte status en chaîne unique OU en tableau (z.union+transform) :
        // on normalise la chaîne en tableau pour ne pas perdre la valeur.
        let arr = Array.isArray(value)
          ? value
          : typeof value === "string" && value.trim() !== ""
            ? [value.trim()]
            : [];
        arr = arr.map((s) => String(s).trim()).filter((s) => s !== "");
        arr = [...new Set(arr)];
        const bad = arr.filter((s) => !field.options.includes(s));
        if (bad.length) {
          errors[field.key] = `Valeur(s) invalide(s): ${bad.join(", ")}.`;
          continue;
        }
        if (arr.length === 0) {
          if (field.required) errors[field.key] = "Au moins une valeur requise.";
          continue;
        }
        data[field.key] = arr;
        break;
      }

      default:
        errors[field.key] = `Type de champ inconnu: ${field.type}`;
    }
  }

  return { ok: Object.keys(errors).length === 0, errors, data };
}
