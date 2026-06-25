---
title: "GotYeah Sonar"
titleEn: "GotYeah Sonar"
description: "Scanner de sécurité web auto-hébergé : audit en 3 phases (passif, actif-léger, pentest nuclei/ZAP) de tes propres sites, dashboard temps réel SSE, remédiation FR/EN et intégration MCP pour Claude."
descriptionEn: "Self-hosted web security scanner: three-phase audit (passive, active-light, nuclei/ZAP pentest) of your own sites, real-time SSE dashboard, FR/EN remediation and MCP integration for Claude."
date: 2026-06-03
slug: "gotyeah-sonar"
tags: [sécurité, audit, scanner]
stack: [Python, FastAPI, Vue 3, SQLite, nuclei, OWASP ZAP, MCP, Docker]
image: "/images/gotyeah-sonar.svg"
status: ["online", "new"]
featured: true
live: "https://sonar.gautierchuinard.com"
repo: "https://github.com/gchuinard/gotyeah-sonar"
---

Scanner de sécurité web pour auditer **ses propres sites** (vérification de
propriété par DNS obligatoire avant de scanner). Pensé QA/sécu : la note ne
ment jamais — elle est **plafonnée par la pire sévérité** (CRITICAL → E) et par
l'incomplétude de couverture.
**Audit en trois phases** : passif (en-têtes HTTP avec *jugement de valeur* —
CSP permissive, HSTS `max-age=0` —, robustesse TLS, qualité DNS SPF/DMARC/DKIM/
DNSSEC), actif-léger (fichiers sensibles exposés, reflet CORS, mixed content,
subdomain takeover), puis pentest (**nuclei** filtré par tag + **OWASP ZAP**
baseline).
**Dashboard temps réel** qui streame les findings en **SSE** (heartbeat qui
survit aux timeouts proxy), **auth par magic-link** sans mot de passe, et
**remédiation multilingue FR/EN** avec snippets par stack (Nginx/NPM/Cloudflare)
et prompts prêts pour l'IA.
**Intégration MCP** : serveur local stdio en lecture seule (Claude Code) et
serveur distant OAuth via Pocket ID (claude.ai) avec action `run_scan`.
Garde-fou anti-SSRF (blocage des IP privées et de 169.254.169.254).
Déployé sur Raspberry Pi via **Docker** (nuclei pré-chargé, CI/CD + scan
nocturne) derrière Nginx Proxy Manager + Cloudflare. Dépôt **public**.
