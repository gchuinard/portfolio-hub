---
title: "GotYeah Sonar"
titleEn: "GotYeah Sonar"
description: "Scanner de sécurité web auto-hébergé : audit en 3 phases (passif, actif-léger, pentest nuclei/ZAP) de tes propres sites, dashboard temps réel SSE, remédiation FR/EN et intégration MCP pour Claude."
descriptionEn: "Self-hosted web security scanner: three-phase audit (passive, active-light, nuclei/ZAP pentest) of your own sites, real-time SSE dashboard, FR/EN remediation and MCP integration for Claude."
date: 2026-06-03
slug: "gotyeah-sonar"
tags: ["sécurité", "audit", "scanner"]
stack: ["Python", "FastAPI", "Vue 3", "SQLite", "nuclei", "OWASP ZAP", "MCP", "Docker"]
image: "/images/gotyeah-sonar.svg"
status: ["online", "new"]
featured: true
live: "https://sonar.gautierchuinard.com"
repo: "https://github.com/gchuinard/gotyeah-sonar"
bodyEn: "Web security scanner to audit **your own sites**, with mandatory DNS ownership\nverification before any scan. Built with a QA/security mindset: the score never\nlies, **capped by the worst severity** (CRITICAL → E) and by incomplete\ncoverage.\n\n### Three-phase audit\n\n- **Passive**, HTTP headers with *value judgment* (permissive CSP, HSTS `max-age=0`), TLS robustness, DNS quality (SPF / DMARC / DKIM / DNSSEC).\n- **Active-light**, exposed sensitive files, CORS reflection, mixed content, subdomain takeover.\n- **Pentest**, **nuclei** filtered by tag + **OWASP ZAP** baseline.\n\n### Features\n\n- **Real-time dashboard**, findings streamed over **SSE** (heartbeat that survives proxy timeouts).\n- **Magic-link auth**, passwordless.\n- **FR/EN remediation**, snippets per stack (Nginx / NPM / Cloudflare) + AI-ready prompts.\n- **MCP integration**, read-only local stdio server (Claude Code) and remote OAuth via Pocket ID (claude.ai), with a `run_scan` action.\n- **Anti-SSRF safeguard**, blocking private IPs and `169.254.169.254`.\n\nDeployed on a Raspberry Pi via **Docker** (nuclei preloaded, CI/CD + nightly scan) behind Nginx Proxy Manager + Cloudflare. **Public** repo."
---

Scanner de sécurité web pour auditer **ses propres sites**, vérification de
propriété par DNS obligatoire avant tout scan. Pensé QA/sécu : la note ne ment
jamais, **plafonnée par la pire sévérité** (CRITICAL → E) et par l'incomplétude
de couverture.

### Audit en trois phases

- **Passif**, en-têtes HTTP avec *jugement de valeur* (CSP permissive, HSTS `max-age=0`), robustesse TLS, qualité DNS (SPF / DMARC / DKIM / DNSSEC).
- **Actif-léger**, fichiers sensibles exposés, reflet CORS, mixed content, subdomain takeover.
- **Pentest**, **nuclei** filtré par tag + **OWASP ZAP** baseline.

### Fonctionnalités

- **Dashboard temps réel**, findings streamés en **SSE** (heartbeat qui survit aux timeouts proxy).
- **Auth par magic-link**, sans mot de passe.
- **Remédiation FR/EN**, snippets par stack (Nginx / NPM / Cloudflare) + prompts prêts pour l'IA.
- **Intégration MCP**, serveur local stdio en lecture seule (Claude Code) et distant OAuth via Pocket ID (claude.ai), avec action `run_scan`.
- **Garde-fou anti-SSRF**, blocage des IP privées et de `169.254.169.254`.

Déployé sur Raspberry Pi via **Docker** (nuclei pré-chargé, CI/CD + scan nocturne) derrière Nginx Proxy Manager + Cloudflare. Dépôt **public**.
