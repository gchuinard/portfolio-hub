// ─────────────────────────────────────────────────────────────────────────
// Opérations « boutons » de l'admin : publier (git commit + push) et lancer
// le serveur d'aperçu (npm run dev). Local/dev uniquement.
//
// Sécurité : aucune commande n'est passée au shell — `spawn` reçoit un tableau
// d'arguments (pas d'interpolation), donc pas d'injection possible via le
// message de commit ou autre.
// ─────────────────────────────────────────────────────────────────────────

import { spawn } from "node:child_process";
import net from "node:net";
import { PROJECT_ROOT } from "./content.mjs";

const NPM = process.platform === "win32" ? "npm.cmd" : "npm";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Lance une commande (sans shell) et capture sa sortie. */
function run(cmd, args, { cwd = PROJECT_ROOT, timeout = 120000 } = {}) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(cmd, args, { cwd });
    } catch (e) {
      return resolve({ code: -1, stdout: "", stderr: String(e.message) });
    }
    let stdout = "";
    let stderr = "";
    const killer = setTimeout(() => child.kill("SIGKILL"), timeout);
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", (e) => {
      clearTimeout(killer);
      resolve({ code: -1, stdout, stderr: `${stderr}\n${e.message}` });
    });
    child.on("close", (code) => {
      clearTimeout(killer);
      resolve({ code, stdout, stderr });
    });
  });
}

// ── Git ─────────────────────────────────────────────────────────────────────
async function currentBranch() {
  const r = await run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  return r.stdout.trim() || "main";
}

/** État git : branche + liste des modifications en attente. */
export async function gitStatus() {
  const status = await run("git", ["status", "--porcelain=v1"]);
  if (status.code !== 0) {
    return { ok: false, error: status.stderr.trim() || "Pas un dépôt git ?" };
  }
  const pending = status.stdout
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .filter(Boolean)
    .map((l) => ({ status: l.slice(0, 2).trim(), file: l.slice(3) }));
  return { ok: true, branch: await currentBranch(), pending, clean: pending.length === 0 };
}

/** Publie : git add -A → commit → push. Renvoie le détail de chaque étape. */
export async function gitPublish(message) {
  const steps = [];
  const msg = (message && String(message).trim()) || "contenu: mise à jour via admin";
  const branch = await currentBranch();

  const add = await run("git", ["add", "-A"]);
  steps.push({ cmd: "git add -A", code: add.code, out: `${add.stdout}${add.stderr}`.trim() });
  if (add.code !== 0) return { ok: false, steps, error: "git add a échoué." };

  const staged = await run("git", ["diff", "--cached", "--name-only"]);
  if (staged.stdout.trim() === "") {
    return { ok: false, nothing: true, steps, error: "Rien à publier (aucune modification)." };
  }

  const commit = await run("git", ["commit", "-m", msg]);
  steps.push({ cmd: `git commit -m "${msg}"`, code: commit.code, out: `${commit.stdout}${commit.stderr}`.trim() });
  if (commit.code !== 0) return { ok: false, steps, error: "git commit a échoué." };

  const push = await run("git", ["push", "origin", branch]);
  steps.push({ cmd: `git push origin ${branch}`, code: push.code, out: `${push.stdout}${push.stderr}`.trim() });
  if (push.code !== 0) return { ok: false, steps, error: "git push a échoué (clé SSH / réseau ?)." };

  return { ok: true, steps, branch, message: msg };
}

// ── Serveur d'aperçu (npm run dev) ────────────────────────────────────────────
let devProc = null;
const devLog = [];

function pushLog(buf) {
  devLog.push(String(buf));
  if (devLog.length > 80) devLog.splice(0, devLog.length - 80);
}

function tryConnect(port, host, timeout) {
  return new Promise((resolve) => {
    const sock = net.connect({ port, host });
    const done = (v) => {
      sock.destroy();
      resolve(v);
    };
    sock.setTimeout(timeout);
    sock.on("connect", () => done(true));
    sock.on("timeout", () => done(false));
    sock.on("error", () => done(false));
  });
}

// astro/vite écoute sur « localhost » qui peut être IPv4 (127.0.0.1) OU IPv6 (::1)
// selon la résolution : on teste les deux, sinon on raterait l'aperçu pourtant en ligne.
async function portUp(port, timeout = 700) {
  const [v4, v6] = await Promise.all([
    tryConnect(port, "127.0.0.1", timeout),
    tryConnect(port, "::1", timeout),
  ]);
  return v4 || v6;
}

function devPort(devUrl) {
  try {
    return Number(new URL(devUrl).port) || 4321;
  } catch {
    return 4321;
  }
}

/** Statut du serveur d'aperçu (port joignable ? géré par nous ?). */
export async function devStatus(devUrl) {
  const up = await portUp(devPort(devUrl));
  const managed = Boolean(devProc && devProc.exitCode === null);
  return { running: up, managed, url: devUrl, log: devLog.slice(-40).join("") };
}

/** Lance `npm run dev` s'il n'est pas déjà en ligne. Retour immédiat (l'UI poll). */
export async function startDev(devUrl) {
  const port = devPort(devUrl);
  if (await portUp(port)) return { alreadyRunning: true, url: devUrl };
  if (devProc && devProc.exitCode === null) return { alreadyRunning: true, managed: true, url: devUrl };

  devLog.length = 0;
  try {
    // `detached: true` → l'enfant devient leader de son groupe de processus,
    // ce qui permet de tuer TOUT l'arbre (npm → astro → vite) d'un coup.
    // CHOKIDAR_USEPOLLING : sur /mnt/c (WSL) inotify ne remonte pas les events ;
    // le polling garantit que le hot-reload voit les éditions faites par l'admin.
    devProc = spawn(NPM, ["run", "dev"], {
      cwd: PROJECT_ROOT,
      detached: true,
      env: { ...process.env, CHOKIDAR_USEPOLLING: "true" },
    });
  } catch (e) {
    return { ok: false, error: `Impossible de lancer npm: ${e.message}` };
  }
  devProc.stdout?.on("data", pushLog);
  devProc.stderr?.on("data", pushLog);
  devProc.on("close", () => {
    devProc = null;
  });
  return { started: true, url: devUrl };
}

/** Tue tout le groupe de processus (npm + astro + vite), avec repli. */
function killGroup(proc, signal = "SIGTERM") {
  if (!proc || proc.exitCode !== null || proc.pid == null) return false;
  try {
    process.kill(-proc.pid, signal); // pid négatif = groupe de processus entier
    return true;
  } catch {
    try {
      proc.kill(signal);
      return true;
    } catch {
      return false;
    }
  }
}

/** Arrête le serveur d'aperçu s'il a été lancé par l'admin. */
export function stopDev() {
  if (devProc && devProc.exitCode === null) {
    killGroup(devProc, "SIGTERM");
    devProc = null;
    return { stopped: true };
  }
  return { stopped: false, note: "Aucun aperçu lancé par l'admin (démarré ailleurs ?)." };
}

/** Tue l'éventuel serveur d'aperçu enfant — à appeler à l'arrêt de l'admin. */
export function shutdownDev() {
  killGroup(devProc, "SIGTERM");
}
