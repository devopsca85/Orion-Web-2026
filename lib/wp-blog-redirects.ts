// Stub — populated by `npm run import:blog`.
// After the WordPress importer runs it overwrites this file with one entry
// per imported post mapping the original WP root URL `/<slug>` to the
// canonical `/blog/<slug>` URL. Until then, this empty array is safe to
// spread into next.config.ts redirects() without breaking the build.

export const wpBlogRedirects: { source: string; destination: string; permanent: boolean }[] = []
