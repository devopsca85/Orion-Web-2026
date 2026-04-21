import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { NewsletterComposer } from '@/components/admin/NewsletterComposer'

export default async function NewsletterPage() {
  const session = await auth()
  const [confirmed, total] = await Promise.all([
    prisma.newsletterSubscriber.count({ where: { confirmed: true, unsubscribed: false } }),
    prisma.newsletterSubscriber.count({ where: { unsubscribed: false } }),
  ])

  return (
    <>
      <AdminTopBar title="Send Newsletter" user={session!.user} />
      <div className="p-6">
        <NewsletterComposer confirmedCount={confirmed} totalCount={total} />
      </div>
    </>
  )
}
