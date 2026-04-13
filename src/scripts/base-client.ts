// Logique client globale du layout principal.
const saved = JSON.parse(localStorage.getItem("gh-theme") || "{}");
let curHue = saved.hue ?? 0;
let isDim = saved.dim ?? false;
let curLight = saved.light ?? false;
let curLang = saved.lang ?? "fr";

const root = document.documentElement;
const dimBtn = document.getElementById("dim-toggle") as HTMLButtonElement | null;
const langToggle = document.getElementById("lang-toggle") as HTMLButtonElement | null;
const swatchBtns = document.querySelectorAll<HTMLButtonElement>(".swatch-btn");

const translations: Record<string, Record<string, string>> = {
  fr: {
    "nav.projects": "projets",
    "nav.experience": "expérience",
    "nav.skills": "compétences",
    "nav.certifications": "certifications",
    "nav.contact": "contact",
    "index.hero.body":
      "Je pilote des projets digitaux, j'organise la qualité (tests auto, monitoring) et je fais le lien entre les équipes techniques et le métier, avec une forte sensibilité utilisateur.",
    "index.hero.cta1": "> découvrir mes projets",
    "index.hero.cta2": "certifications & parcours scrum →",
    "index.nav.projects.label": "hub de projets",
    "index.nav.projects.heading": "Projets & expériences",
    "index.nav.projects.desc":
      "Cartes détaillées, stack, tags, liens Demo & Code, filtres avancés.",
    "index.nav.projects.link": "voir les projets",
    "index.nav.skills.label": "compétences",
    "index.nav.skills.heading": "Compétences & outils",
    "index.nav.skills.desc":
      "Vue synthétique : techniques, soft skills, frameworks et indicateurs visuels.",
    "index.nav.skills.link": "explorer les compétences",
    "index.nav.certs.label": "scrum & autres",
    "index.nav.certs.heading": "Certifications",
    "index.nav.certs.desc":
      "Timeline et grille : PAL I, parcours Scrum.org, autres formations structurantes.",
    "index.nav.certs.link": "voir les certifications",
    "index.about.heading": "Ce que j'aime faire",
    "index.about.body":
      "Guider les équipes pour garantir la production de valeur, mettre en place des outils qui rendent les équipes plus efficaces : tests automatisés, dashboards de monitoring, scripts d'industrialisation… Et garder toujours une vision centrée sur l'utilisateur final.",
    "index.contact.heading": "Envie d'en discuter ?",
    "index.contact.body":
      "Un projet, une idée de pipeline de tests, un projet utilisateur peu atypique ? Je suis toujours partant pour en parler.",
    "index.contact.link": "accéder au formulaire de contact",
    "index.typewriter": "404: excuses not found.\nPO by day, QA by night — [defining] → [shipping] → [breaking] → [fixing]",
    "outside.intro": "Il y a une ligne qui traverse la plupart de mes intérêts hors travail : je ne consomme pas vraiment, j'apprends. Ce n'est pas une posture — c'est simplement ce qui me retient : comprendre comment quelque chose fonctionne, puis le faire mieux.",
    "outside.item1.key": "cuisine",
    "outside.item1.val": "Pas pour l'effet — pour la méthode. Apprendre les gestes, les réactions, la logique derrière chaque technique. Répéter jusqu'à ce que ce soit maîtrisé.",
    "outside.item2.key": "ingénierie & F1",
    "outside.item2.val": "La F1 m'intéresse moins pour le spectacle que pour ce qu'elle révèle : des systèmes complexes poussés à l'extrême, où chaque milliseconde est le produit d'une décision d'ingénierie. Une façon de lire la compétition autrement.",
    "outside.item3.key": "infrastructure",
    "outside.item3.val": "Self-hosting, domotique, monitoring — un environnement que j'entretiens et améliore. Ce n'est pas du bricolage : c'est de l'ingénierie à petite échelle, avec les mêmes exigences qu'en prod.",
    "outside.item4.key": "esthétique & systèmes",
    "outside.item4.val": "Des outils, de l'IA, des projets numériques. Et une sensibilité pour les univers visuels cohérents — cinéma, jeux, interfaces — dès qu'ils ont une vraie intention.",
    "outside.note": "// Ce n'est pas une liste de hobbies. C'est à peu près la même personne qu'au bureau.",
    "projects.heading": "Hub de Projets",
    "projects.entries": "entrées trouvées",
    "projects.filter.hint": " — utilisez les filtres pour affiner",
    "projects.filter.label": "mode_filtre :",
    "projects.filter.and": "ET",
    "projects.filter.or": "OU",
    "skills.heading": "Mes Compétences",
    "skills.dev.heading": "// Développement",
    "skills.qa.heading": "// QA & Automatisation",
    "skills.pro.heading": "// Professionnelles",
    "skills.tools.heading": "// Outils",
    "skills.legend": "Expert · Avancé · Intermédiaire · En apprentissage",
    "certs.badge.target": "OBJECTIF",
    "certs.target.label": "// certification visée",
    "certs.link": "> voir le certificat",
    "certs.target.link": "// en objectif",
    "certs.filter.label": "mode_filtre :",
    "certs.filter.and": "ET",
    "certs.filter.or": "OU",
    "contact.heading": "Contact",
    "contact.intro":
      "// Tu veux parler d'un projet, de QA, de tests auto ou juste geekery domotique ? Écris-moi.",
    "contact.info.heading": "// Mes infos",
    "contact.info.body":
      "Le plus simple pour me joindre reste l'email. Je réponds dès que possible, surtout si le sujet touche aux tests auto, au monitoring ou à la chelou-tech auto-hébergée.",
    "contact.networks.label": "ls ./réseaux/",
    "contact.form.heading": "// M'envoyer un message",
    "contact.form.name": "nom / prénom:",
    "contact.form.name.ph": "_ qui m'écrit ?",
    "contact.form.email.ph": "_ vous@exemple.fr",
    "contact.form.subject": "sujet:",
    "contact.form.subject.ph": "_ de quoi allons-nous parler ?",
    "contact.form.message": "message:",
    "contact.form.message.ph": "_ quel est le contexte, c'est toujours utile",
    "contact.form.submit": "> envoyer (maquette)",
    "contact.form.email.link": "// ou écrire directement par email →",
  },
  en: {
    "nav.projects": "projects",
    "nav.experience": "experience",
    "nav.skills": "skills",
    "nav.certifications": "certifications",
    "nav.contact": "contact",
    "index.hero.body":
      "I drive digital projects, organize quality (automated testing, monitoring) and bridge the gap between technical teams and the business, with a strong user-focused mindset.",
    "index.hero.cta1": "> discover my projects",
    "index.hero.cta2": "certifications & scrum path →",
    "index.nav.projects.label": "project hub",
    "index.nav.projects.heading": "Projects & experience",
    "index.nav.projects.desc":
      "Detailed cards, stack, tags, Demo & Code links, advanced filters.",
    "index.nav.projects.link": "view projects",
    "index.nav.skills.label": "skills",
    "index.nav.skills.heading": "Skills & tools",
    "index.nav.skills.desc":
      "Overview: technical skills, soft skills, frameworks and visual indicators.",
    "index.nav.skills.link": "explore skills",
    "index.nav.certs.label": "scrum & others",
    "index.nav.certs.heading": "Certifications",
    "index.nav.certs.desc":
      "Timeline and grid: PAL I, Scrum.org path, other key certifications.",
    "index.nav.certs.link": "view certifications",
    "index.about.heading": "What I like to do",
    "index.about.body":
      "Guide teams to ensure value delivery, set up tools that make teams more efficient: automated tests, monitoring dashboards, automation scripts… And always keep a user-centric vision.",
    "index.contact.heading": "Want to discuss?",
    "index.contact.body":
      "A project, a testing pipeline idea, something unusual? I'm always up for a chat.",
    "index.contact.link": "open contact form",
    "index.typewriter": "404: excuses not found.\nPO by day, QA by night — [defining] → [shipping] → [breaking] → [fixing]",
    "outside.intro": "There's a thread running through most of my interests outside work: I don't really consume — I learn. Not a stance — just what holds my attention: understanding how something works, then doing it better.",
    "outside.item1.key": "cooking",
    "outside.item1.val": "Not for the effect — for the method. Learning the gestures, the reactions, the logic behind each technique. Repeating until it's mastered.",
    "outside.item2.key": "engineering & F1",
    "outside.item2.val": "F1 interests me less for the spectacle than for what it reveals: complex systems pushed to the extreme, where every millisecond is the product of an engineering decision. A different way of reading competition.",
    "outside.item3.key": "infrastructure",
    "outside.item3.val": "Self-hosting, home automation, monitoring — an environment I maintain and improve. Not tinkering: small-scale engineering, with the same standards as production.",
    "outside.item4.key": "aesthetics & systems",
    "outside.item4.val": "Tools, AI, side projects. And a sensitivity for visual worlds with real identity — cinema, games, interfaces — whenever there's a visible, deliberate intent.",
    "outside.note": "// Not a list of hobbies. Roughly the same person as at the office.",
    "projects.heading": "Project Hub",
    "projects.entries": "entries found",
    "projects.filter.hint": " — use filters to refine",
    "projects.filter.label": "filter_mode:",
    "projects.filter.and": "AND",
    "projects.filter.or": "OR",
    "skills.heading": "My Skills",
    "skills.dev.heading": "// Development",
    "skills.qa.heading": "// QA & Automation",
    "skills.pro.heading": "// Professional",
    "skills.tools.heading": "// Tools",
    "skills.legend": "Expert · Advanced · Intermediate · Learning",
    "certs.badge.target": "GOAL",
    "certs.target.label": "// target certification",
    "certs.link": "> view certificate",
    "certs.target.link": "// in progress",
    "certs.filter.label": "filter_mode:",
    "certs.filter.and": "AND",
    "certs.filter.or": "OR",
    "contact.heading": "Contact",
    "contact.intro":
      "// Want to talk about a project, QA, automated testing or home automation geekery? Write to me.",
    "contact.info.heading": "// My info",
    "contact.info.body":
      "Email is the easiest way to reach me. I reply as soon as possible, especially if it's about automated testing, monitoring or self-hosted quirky tech.",
    "contact.networks.label": "ls ./networks/",
    "contact.form.heading": "// Send me a message",
    "contact.form.name": "name:",
    "contact.form.name.ph": "_ who's writing?",
    "contact.form.email.ph": "_ you@example.com",
    "contact.form.subject": "subject:",
    "contact.form.subject.ph": "_ what are we talking about?",
    "contact.form.message": "message:",
    "contact.form.message.ph": "_ context is always helpful",
    "contact.form.submit": "> send (mockup)",
    "contact.form.email.link": "// or write directly by email →",
  },
};

function persist(): void {
  localStorage.setItem(
    "gh-theme",
    JSON.stringify({ hue: curHue, dim: isDim, light: curLight, lang: curLang }),
  );
}

function updateSwatchActive(): void {
  swatchBtns.forEach((btn) => {
    const hueMatch = parseInt(btn.dataset.hue || "0", 10) === curHue;
    const lightMatch = (btn.dataset.light === "true") === curLight;
    const isActive = hueMatch && lightMatch;
    btn.style.outline = isActive ? "2px solid #00ff41" : "none";
    btn.style.outlineOffset = "3px";
  });
}

function applyLang(lang: string): void {
  curLang = lang;
  const dict = translations[lang] ?? translations.fr;
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key && dict[key] != null) el.textContent = dict[key];
  });
  document.querySelectorAll<HTMLInputElement>("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key && dict[key] != null) el.placeholder = dict[key];
  });
  document.querySelectorAll<HTMLElement>("[data-lang-fr]").forEach((el) => {
    const fr = el.dataset.langFr ?? "";
    const en = el.dataset.langEn ?? fr;
    el.textContent = lang === "en" ? en : fr;
  });
  if (langToggle) {
    langToggle.textContent = lang === "fr" ? "EN" : "FR";
    langToggle.style.color = lang === "en" ? "#00ff41" : "";
    langToggle.style.borderColor = lang === "en" ? "rgba(0,255,65,0.4)" : "";
  }
  root.setAttribute("data-lang", lang);
  persist();
}

function applyHue(deg: number): void {
  curHue = deg;
  root.style.setProperty("--hue", `${deg}deg`);
  updateSwatchActive();
  persist();
}

function applyLightMode(isLight: boolean): void {
  curLight = isLight;
  if (isLight) root.setAttribute("data-light", "");
  else root.removeAttribute("data-light");
  updateSwatchActive();
  persist();
}

function applyDim(dim: boolean): void {
  isDim = dim;
  if (dim) root.setAttribute("data-dim", "");
  else root.removeAttribute("data-dim");
  if (dimBtn) {
    dimBtn.textContent = dim ? "norm" : "dim";
    dimBtn.style.color = dim ? "#00ff41" : "";
    dimBtn.style.borderColor = dim ? "rgba(0,255,65,0.4)" : "";
  }
  persist();
}

swatchBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    applyHue(parseInt(btn.dataset.hue || "0", 10));
    applyLightMode(btn.dataset.light === "true");
  });
});

dimBtn?.addEventListener("click", () => applyDim(!isDim));
langToggle?.addEventListener("click", () => applyLang(curLang === "fr" ? "en" : "fr"));

updateSwatchActive();
applyDim(isDim);
applyLightMode(curLight);
applyLang(curLang);

// Gestion du boot d'entree (une seule fois par session).
const bootOverlay = document.getElementById("boot-overlay");
const appShell = document.getElementById("theme-root");
const powerNodes = document.querySelectorAll(".power-node");
const bootWindows = document.querySelectorAll(".terminal-window");
const bootStart = performance.now();
const MIN_BOOT_MS = 2850;
const bootLines = document.querySelectorAll(".boot-line");
const forceBoot = document.documentElement.hasAttribute("data-force-boot");
const skipBoot = document.documentElement.hasAttribute("data-skip-boot") && !forceBoot;

if (!skipBoot) {
  bootLines.forEach((line, index) => {
    const delay = 160 + index * 520;
    setTimeout(() => line.classList.remove("boot-line--hidden"), delay);
  });
}

function hideBootOverlay(): void {
  appShell?.classList.remove("app-shell--booting");
  if (!bootOverlay) return;
  bootOverlay.classList.add("is-done");
  setTimeout(() => {
    powerNodes.forEach((node, index) => {
      setTimeout(() => node.classList.add("power-node--on"), 20 + index * 45);
    });
    bootWindows.forEach((win, index) => {
      const start = 30 + index * 90;
      setTimeout(() => win.classList.add("window-boot--on"), start);
      setTimeout(() => win.classList.add("window-boot--scan"), start + 40);
      setTimeout(() => win.classList.add("window-boot--content"), start + 230);
    });
  }, 80);
  setTimeout(() => bootOverlay.remove(), 420);
}

function completeBoot(): void {
  const elapsed = performance.now() - bootStart;
  const wait = Math.max(0, MIN_BOOT_MS - elapsed);
  setTimeout(hideBootOverlay, wait);
}

if (document.readyState === "complete") {
  if (skipBoot) hideBootOverlay();
  else completeBoot();
} else {
  window.addEventListener(
    "load",
    () => {
      if (skipBoot) hideBootOverlay();
      else completeBoot();
    },
    { once: true },
  );
}

if (!skipBoot) {
  try {
    sessionStorage.setItem("gp-boot-seen", "1");
  } catch {
    // Ignore les erreurs d'acces au storage (mode prive, restrictions navigateur).
  }
}
