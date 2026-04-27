/**
 * Pull renderable content out of a full WordPress HTML page so it can render
 * inline (no iframe) inside the (public) layout. Three transforms:
 *
 *   1. Extract <link rel="stylesheet"> and <style> from <head>. These render
 *      just before the body markup so the WP design rules apply.
 *   2. Extract <body> inner HTML.
 *   3. Strip the WP page's own <header>, <footer>, <nav>, <script>, and
 *      <noscript>. The new site already provides Header/Footer from
 *      app/(public)/layout.tsx — keeping the WP ones doubles them up, and
 *      WP scripts reference plugins/endpoints that don't exist on the new host.
 *
 * Safe on partial HTML: if there's no <body> we return the input as-is so a
 * truncated clone or a hand-typed Page still renders something.
 */
export interface ExtractedClonedPage {
  headHtml: string
  bodyHtml: string
}

export function extractClonedPage(fullHtml: string): ExtractedClonedPage {
  const headMatch = fullHtml.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)
  const bodyMatch = fullHtml.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)

  if (!bodyMatch) {
    return { headHtml: '', bodyHtml: fullHtml }
  }

  const headTags: string[] = []
  if (headMatch) {
    const head = headMatch[1]
    let m: RegExpExecArray | null

    const LINK_RE = /<link\b[^>]*rel\s*=\s*["']stylesheet["'][^>]*\/?>/gi
    while ((m = LINK_RE.exec(head))) headTags.push(m[0])

    const STYLE_RE = /<style\b[^>]*>[\s\S]*?<\/style>/gi
    while ((m = STYLE_RE.exec(head))) headTags.push(m[0])
  }

  let body = bodyMatch[1]
  body = body.replace(/<script\b[\s\S]*?<\/script>/gi, '')
  body = body.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, '')
  body = body.replace(/<header\b[\s\S]*?<\/header>/gi, '')
  body = body.replace(/<footer\b[\s\S]*?<\/footer>/gi, '')

  return { headHtml: headTags.join('\n'), bodyHtml: body }
}
