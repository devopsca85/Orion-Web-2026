import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
    select: { email: true, name: true, source: true, confirmed: true, unsubscribed: true, createdAt: true },
  })

  const header = ['Email', 'Name', 'Source', 'Confirmed', 'Unsubscribed', 'Date']
  const rows = subscribers.map((s) => [
    s.email,
    s.name ?? '',
    s.source ?? '',
    s.confirmed ? 'Yes' : 'No',
    s.unsubscribed ? 'Yes' : 'No',
    s.createdAt.toISOString().split('T')[0],
  ])

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
