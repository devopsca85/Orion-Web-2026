import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

export const getSettings = unstable_cache(
  async (keys?: string[]): Promise<Record<string, string>> => {
    try {
      const settings = await prisma.siteSetting.findMany(
        keys ? { where: { key: { in: keys } } } : undefined
      )
      return Object.fromEntries(settings.map((s) => [s.key, s.value]))
    } catch {
      // Table may not exist yet — return empty so pages still render with defaults
      return {}
    }
  },
  ['site-settings'],
  { revalidate: 60, tags: ['site-settings'] }
)

export async function getSetting(key: string, fallback = ''): Promise<string> {
  const all = await getSettings([key])
  return all[key] ?? fallback
}
