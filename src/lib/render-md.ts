// Rendu d'une chaîne markdown → HTML, avec le moteur d'Astro (@astrojs/markdown-remark).
// Sert à afficher un corps de page stocké dans le frontmatter (ex. `bodyEn`),
// que `<Content />` ne peut pas rendre (il ne rend que le corps principal du .md).
// Le processeur est créé une seule fois et réutilisé sur tout le build.
import { createMarkdownProcessor, type MarkdownProcessor } from "@astrojs/markdown-remark";

let processor: MarkdownProcessor | null = null;

export async function renderMarkdown(source: string): Promise<string> {
  processor ??= await createMarkdownProcessor({});
  const { code } = await processor.render(source ?? "");
  return code;
}
