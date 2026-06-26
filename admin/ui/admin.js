// ── Admin Hub Portfolio — client vanilla (aucun framework) ────────────────

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, props = {}, ...kids) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return node;
};

// ── API ───────────────────────────────────────────────────────────────────
async function api(method, path, body) {
  const headers = {};
  const opts = { method, headers };
  if (body !== undefined) {
    headers["content-type"] = "application/json";
    headers["x-admin-request"] = "1";
    opts.body = JSON.stringify(body);
  } else if (method !== "GET") {
    headers["x-admin-request"] = "1";
  }
  const res = await fetch(path, opts);
  let data = {};
  try { data = await res.json(); } catch { /* vide */ }
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.errors = data.errors;
    throw err;
  }
  return data;
}

// ── Toast / modal ──────────────────────────────────────────────────────────
let toastTimer;
function toast(msg, isError = false) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.toggle("error", isError);
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

function confirmModal(title, msg) {
  return new Promise((resolve) => {
    const modal = $("#modal");
    $("#modalTitle").textContent = title;
    $("#modalMsg").textContent = msg;
    modal.classList.add("show");
    const cleanup = (val) => {
      modal.classList.remove("show");
      $("#modalConfirm").onclick = null;
      $("#modalCancel").onclick = null;
      resolve(val);
    };
    $("#modalConfirm").onclick = () => cleanup(true);
    $("#modalCancel").onclick = () => cleanup(false);
    modal.onclick = (e) => { if (e.target === modal) cleanup(false); };
  });
}

// ── Slugify (miroir de slugifyFilename côté serveur) ────────────────────────
function slugify(input) {
  const base = String(input)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "sans-titre";
}

// ── État global ─────────────────────────────────────────────────────────────
const state = {
  schema: null,
  devUrl: "http://localhost:4321",
  collection: null,
  entries: [],
  current: null, // { file } en édition, ou { create: true }
  vocab: {},
};

// ── Tabs ─────────────────────────────────────────────────────────────────────
function renderTabs() {
  const tabs = $("#tabs");
  tabs.innerHTML = "";
  for (const key of state.schema.order) {
    const col = state.schema.collections[key];
    const btn = el("button", {
      class: "tab",
      role: "tab",
      "aria-selected": key === state.collection ? "true" : "false",
      onclick: () => selectCollection(key),
    }, col.label, " ", el("span", { class: "count" }, ""));
    btn.dataset.key = key;
    tabs.append(btn);
  }
}

function updateTabCounts(counts) {
  for (const btn of $("#tabs").children) {
    const c = counts[btn.dataset.key];
    if (c !== undefined) btn.querySelector(".count").textContent = `(${c})`;
  }
}

// ── Liste ────────────────────────────────────────────────────────────────────
async function selectCollection(key) {
  state.collection = key;
  state.current = null;
  renderTabs();
  $("#search").value = "";
  renderEditorEmpty();
  await loadList();
  // charge le vocabulaire (tags/stack) en arrière-plan
  api("GET", `/api/vocabulary?collection=${key}`).then((v) => { state.vocab[key] = v; }).catch(() => {});
}

async function loadList() {
  const { entries } = await api("GET", `/api/list?collection=${state.collection}`);
  state.entries = entries;
  renderList();
}

function renderList() {
  const ul = $("#entries");
  ul.innerHTML = "";
  const q = $("#search").value.trim().toLowerCase();
  const filtered = state.entries.filter((e) => {
    if (!q) return true;
    return (
      String(e.title).toLowerCase().includes(q) ||
      String(e.subtitle).toLowerCase().includes(q) ||
      String(e.file).toLowerCase().includes(q) ||
      (Array.isArray(e.status) ? e.status.join(" ") : "").toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    ul.append(el("li", { class: "broken" }, el("span", { class: "e-title" }, "// aucun résultat")));
    return;
  }

  for (const e of filtered) {
    const badges = el("div", { class: "badge-row" });
    const statuses = Array.isArray(e.status) ? e.status : e.status ? [e.status] : [];
    for (const s of statuses) badges.append(el("span", { class: `badge ${s}` }, `[${s}]`));
    if (e.featured) badges.append(el("span", { class: "badge featured" }, "★"));

    const li = el("li", {
      "aria-current": state.current && state.current.file === e.file ? "true" : "false",
      class: e.broken ? "broken" : "",
      onclick: () => openEntry(e.file),
    },
      el("div", { class: "e-title" }, e.title),
      e.subtitle ? el("div", { class: "e-sub" }, e.subtitle) : null,
      el("div", { class: "e-file" }, e.file + (e.slugExplicit ? `  ·  /${e.slug}` : "")),
      statuses.length || e.featured ? badges : null,
    );
    ul.append(li);
  }
}

// ── Éditeur ──────────────────────────────────────────────────────────────────
function renderEditorEmpty() {
  $("#editor").innerHTML = "";
  $("#editor").append(el("p", { class: "editor-empty", html:
    '<span class="prompt">$</span> sélectionne une entrée à gauche, ou <strong>[ + ]</strong> pour en créer une.' }));
}

async function openEntry(file) {
  try {
    const entry = await api("GET", `/api/entry?collection=${state.collection}&file=${encodeURIComponent(file)}`);
    state.current = { file };
    renderList();
    renderForm({ data: entry.data, body: entry.body, file, create: false });
  } catch (e) {
    toast(e.message, true);
  }
}

function newEntry() {
  state.current = { create: true };
  renderList();
  renderForm({ data: {}, body: "", file: "", create: true });
}

// Registre des getters de valeur par champ.
function renderForm({ data, body, file, create }) {
  const col = state.schema.collections[state.collection];
  const getters = {};
  const fieldEls = {};
  const main = $("#editor");
  main.innerHTML = "";

  const titleVal = data[col.titleField] || (create ? "(nouvelle entrée)" : file);
  main.append(el("div", { class: "editor-head" },
    el("span", { class: "crumb" }, create ? `$ touch ${state.collection}/` : `$ cat ${state.collection}/${file}`),
    el("h2", {}, titleVal),
  ));

  // Nom de fichier
  const fileField = buildFilenameField(file, create, () => filenameInput);
  let filenameInput = fileField.input;
  main.append(fileField.wrap);

  // Champs du schéma
  for (const field of col.fields) {
    const built = buildField(field, data[field.key]);
    getters[field.key] = built.get;
    fieldEls[field.key] = built.wrap;
    main.append(built.wrap);
    // auto-suggestion du nom de fichier depuis le titre (création seulement)
    if (create && field.key === col.titleField) {
      built.wrap.querySelector("input")?.addEventListener("input", (ev) => {
        if (!filenameInput.dataset.touched) {
          filenameInput.value = slugify(ev.target.value) + ".md";
        }
      });
    }
  }

  // Corps markdown
  const bodyWrap = el("div", { class: "field" },
    el("label", {}, "body ", el("span", { class: "opt" }, "// markdown (page détail)")),
    el("textarea", { class: "body", id: "f-body" }, body || ""),
  );
  main.append(bodyWrap);

  // Actions
  const actions = el("div", { class: "actions" });
  const saveBtn = el("button", { class: "btn primary", onclick: () => save(getters, fieldEls, filenameInput, create) }, create ? "> créer" : "> enregistrer");
  actions.append(saveBtn);

  if (col.routed && !create) {
    const slug = data.slug || file.replace(/\.md$/i, "").toLowerCase();
    actions.append(el("a", { class: "btn", href: `${state.devUrl}/${col.dir}/${slug}`, target: "_blank" }, "> aperçu"));
  }
  actions.append(el("span", { class: "spacer" }));
  if (!create) {
    actions.append(el("button", { class: "btn danger", onclick: () => remove(file) }, "> supprimer"));
  }
  actions.append(el("button", { class: "btn", onclick: renderEditorEmpty }, "> fermer"));
  main.append(actions);
}

function buildFilenameField(file, create, getInput) {
  const input = el("input", {
    type: "text",
    id: "f-filename",
    value: file,
    autocomplete: "off",
    spellcheck: "false",
  });
  if (!create) {
    input.readOnly = true;
    input.title = "Le renommage se fait à la main (préserve l'historique git et les liens).";
  } else {
    input.addEventListener("input", () => { input.dataset.touched = "1"; });
  }
  const errSpan = el("span", { class: "err" });
  const wrap = el("div", { class: "field" + (create ? "" : "") },
    el("label", {}, "fichier ", create ? el("span", { class: "req" }, "*") : el("span", { class: "opt" }, "// non renommable ici"),
      " ", el("span", { class: "opt" }, ".md")),
    input,
    el("span", { class: "hint" }, create ? "kebab-case recommandé. Pour les projets, sert aussi de slug d'URL par défaut." : ""),
    errSpan,
  );
  return { wrap, input };
}

// Construit un champ → { wrap, get }
function buildField(field, value) {
  const labelKids = [field.key, " "];
  if (field.required) labelKids.push(el("span", { class: "req" }, "*"));
  else labelKids.push(el("span", { class: "opt" }, "// optionnel"));
  const label = el("label", {}, ...labelKids);
  const wrap = el("div", { class: "field" });
  wrap.dataset.field = field.key;
  let get = () => undefined;

  switch (field.type) {
    case "string":
    case "url": {
      const input = el("input", { type: field.type === "url" ? "url" : "text", value: value ?? "", autocomplete: "off", spellcheck: "false" });
      wrap.append(label, input);
      get = () => input.value;
      break;
    }
    case "text": {
      const ta = el("textarea", {}, value ?? "");
      wrap.append(label, ta);
      get = () => ta.value;
      break;
    }
    case "date": {
      const input = el("input", { type: "date", value: value ?? "" });
      wrap.append(label, input);
      get = () => input.value;
      break;
    }
    case "boolean": {
      wrap.classList.add("bool");
      const cb = el("input", { type: "checkbox" });
      cb.checked = value === true;
      wrap.append(el("label", { class: "toggle" }, cb, `${field.key}`, field.required ? "" : el("span", { class: "opt" }, " // optionnel")));
      get = () => cb.checked;
      break;
    }
    case "enum": {
      const sel = el("select");
      if (!field.required && field.default === undefined) sel.append(el("option", { value: "" }, "—"));
      for (const opt of field.options) {
        const o = el("option", { value: opt }, opt);
        if (value === opt || (value == null && field.default === opt)) o.selected = true;
        sel.append(o);
      }
      wrap.append(label, sel);
      get = () => sel.value;
      break;
    }
    case "enumArray": {
      const grid = el("div", { class: "enum-grid" });
      const checks = [];
      // value peut être un tableau OU une chaîne unique (status: online) — on normalise.
      const selected = new Set(Array.isArray(value) ? value : typeof value === "string" ? [value] : []);
      for (const opt of field.options) {
        const cb = el("input", { type: "checkbox", value: opt });
        cb.checked = selected.has(opt);
        checks.push(cb);
        grid.append(el("label", {}, cb, `[${opt}]`));
      }
      wrap.append(label, grid);
      get = () => field.options.filter((_, i) => checks[i].checked);
      break;
    }
    case "stringArray": {
      // value peut être un tableau OU une chaîne (tags: "a, b") — on normalise.
      const initial = Array.isArray(value)
        ? value
        : typeof value === "string"
          ? value.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
      const built = buildChips(field, initial);
      wrap.append(label, built.el);
      get = built.get;
      break;
    }
    default: {
      wrap.append(label, el("span", { class: "hint" }, `type inconnu: ${field.type}`));
    }
  }

  if (field.hint) wrap.append(el("span", { class: "hint" }, field.hint));
  wrap.append(el("span", { class: "err" }));
  return { wrap, get };
}

// Éditeur de chips (tags / stack) avec autocomplétion.
function buildChips(field, initial) {
  const box = el("div", { class: "chips" });
  const values = [...initial];

  const datalistId = `dl-${field.key}`;
  const suggestions = (state.vocab[state.collection]?.[field.key]) || [];
  const datalist = el("datalist", { id: datalistId });
  for (const s of suggestions) datalist.append(el("option", { value: s }));

  const input = el("input", { type: "text", placeholder: "+ ajouter (Entrée)", list: datalistId, autocomplete: "off", spellcheck: "false" });

  const render = () => {
    box.querySelectorAll(".chip").forEach((c) => c.remove());
    values.forEach((v, i) => {
      const chip = el("span", { class: "chip" }, v,
        el("button", { type: "button", title: "retirer", onclick: () => { values.splice(i, 1); render(); } }, "✕"));
      box.insertBefore(chip, input);
    });
  };

  const add = (raw) => {
    raw.split(",").map((s) => s.trim()).filter(Boolean).forEach((v) => {
      if (!values.includes(v)) values.push(v);
    });
    input.value = "";
    render();
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); if (input.value.trim()) add(input.value); }
    else if (e.key === "Backspace" && input.value === "" && values.length) { values.pop(); render(); }
  });
  input.addEventListener("blur", () => { if (input.value.trim()) add(input.value); });

  box.append(datalist, input);
  render();
  return { el: box, get: () => [...values] };
}

// ── Save / delete ──────────────────────────────────────────────────────────
function clearErrors() {
  $("#editor").querySelectorAll(".field.has-error").forEach((f) => f.classList.remove("has-error"));
  $("#editor").querySelectorAll(".field .err").forEach((e) => (e.textContent = ""));
}

function showFieldError(key, msg) {
  const wrap = key === "_filename"
    ? $("#f-filename")?.closest(".field")
    : $("#editor").querySelector(`.field[data-field="${key}"]`);
  if (!wrap) { toast(`${key}: ${msg}`, true); return; }
  wrap.classList.add("has-error");
  const errEl = wrap.querySelector(".err");
  if (errEl) errEl.textContent = msg;
}

async function save(getters, fieldEls, filenameInput, create) {
  clearErrors();
  const data = {};
  for (const [key, get] of Object.entries(getters)) data[key] = get();
  const body = $("#f-body").value;

  let file = filenameInput.value.trim();
  if (create) {
    if (!file) { showFieldError("_filename", "Nom de fichier requis."); return; }
    if (!file.toLowerCase().endsWith(".md")) file += ".md";
    if (!/^[a-z0-9][a-z0-9-]*\.md$/.test(file)) {
      showFieldError("_filename", "kebab-case attendu : a-z, 0-9, tirets, puis .md");
      return;
    }
  }

  try {
    const result = await api("POST", "/api/entry", { collection: state.collection, file, body, create, data });
    toast(create ? `✓ créé : ${result.file}` : `✓ enregistré : ${result.file} (${result.bytes} o)`);
    await loadList();
    // recharge le vocabulaire (de nouveaux tags ont pu apparaître)
    api("GET", `/api/vocabulary?collection=${state.collection}`).then((v) => { state.vocab[state.collection] = v; }).catch(() => {});
    state.current = { file };
    renderList();
    if (create) openEntry(file);
  } catch (e) {
    if (e.status === 422 && e.errors) {
      for (const [key, msg] of Object.entries(e.errors)) showFieldError(key, msg);
      toast("Validation échouée — corrige les champs en rouge.", true);
    } else if (e.status === 409) {
      showFieldError("_filename", "Un fichier porte déjà ce nom.");
      toast(e.message, true);
    } else {
      toast(e.message, true);
    }
  }
}

async function remove(file) {
  const ok = await confirmModal("Supprimer cette entrée ?", `Le fichier ${state.collection}/${file} sera supprimé. Tu pourras le récupérer via git tant que ce n'est pas commité.`);
  if (!ok) return;
  try {
    await api("DELETE", `/api/entry?collection=${state.collection}&file=${encodeURIComponent(file)}`);
    toast(`✓ supprimé : ${file}`);
    state.current = null;
    renderEditorEmpty();
    await loadList();
  } catch (e) {
    toast(e.message, true);
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  try {
    state.schema = await api("GET", "/api/schema");
    state.devUrl = state.schema.devUrl || state.devUrl;
    $("#rootHint").textContent = "src/content/";
    renderTabs();
    $("#search").addEventListener("input", renderList);
    $("#newBtn").addEventListener("click", newEntry);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") $("#modal").classList.remove("show");
    });
    // compte global pour les onglets
    const { all } = await api("GET", "/api/list");
    updateTabCounts(Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v.length])));
    await selectCollection(state.schema.order[0]);
  } catch (e) {
    document.body.innerHTML = `<pre style="color:#ff6a6a;padding:2rem;font-family:monospace">Erreur de démarrage admin :\n${e.message}\n\nLe serveur tourne-t-il ? (npm run admin)</pre>`;
  }
}

init();
