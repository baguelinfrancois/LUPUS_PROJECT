// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/fr/reference/configuration-reference/
export default defineConfig({
  // Adresse publique du site (à mettre à jour après la mise en ligne).
  site: 'https://amicale-psig-montargis.netlify.app',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
