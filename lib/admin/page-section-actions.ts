'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/admin/login')
}

type SectionInput = { key: string; label: string; visible: boolean }

export async function saveSectionLayout(page: 'home' | 'footer', sections: SectionInput[]) {
  await requireAdmin()
  await prisma.$transaction(
    sections.map((s, i) =>
      prisma.pageSection.upsert({
        where: { page_sectionKey: { page, sectionKey: s.key } },
        create: { page, sectionKey: s.key, label: s.label, sortOrder: i, visible: s.visible },
        update: { label: s.label, sortOrder: i, visible: s.visible },
      })
    )
  )
  revalidatePath('/', 'layout')
  if (page === 'home') revalidatePath('/')
}
