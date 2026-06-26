// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";

// Sur un disque Windows monté dans WSL (/mnt/c…), inotify ne remonte pas les
// changements de fichiers → le hot-reload du `npm run dev` ne voit pas les
// éditions (ex. faites via l'admin). On force le polling DANS CE CAS SEULEMENT
// (aucune pénalité CPU sur un système de fichiers natif Linux/macOS).
const onWindowsMount = process.cwd().startsWith("/mnt/");

export default defineConfig({
  integrations: [
    tailwind(),
    mdx(),
  ],
  vite: {
    server: {
      watch: onWindowsMount ? { usePolling: true, interval: 300 } : undefined,
    },
  },
});
