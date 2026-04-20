import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { CalendlyLinksEditor } from '@/components/admin/CalendlyLinksEditor'
import { prisma } from '@/lib/prisma'

export default async function CalendlySettingsPage() {
  const session = await auth()

  // Load all calendly.* settings
  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: 'calendly.' } },
    orderBy: { key: 'asc' },
  })

  let initialLinks = rows.map((r) => ({
    variable: r.key.replace(/^calendly\./, ''),
    url: r.value,
  }))

  // Migrate legacy contact.calendlyUrl if no calendly.* entries exist yet
  if (initialLinks.length === 0) {
    const legacy = await prisma.siteSetting.findUnique({ where: { key: 'contact.calendlyUrl' } })
    if (legacy?.value) {
      initialLinks = [{ variable: 'contact', url: legacy.value }]
    }
  }

  return (
    <>
      <AdminTopBar title="Calendly Settings" user={session!.user} />
      <div className="p-6 max-w-2xl">
        <CalendlyLinksEditor initialLinks={initialLinks} />
      </div>
    </>
  )
}
