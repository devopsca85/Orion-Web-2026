'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PostStatus, SubmissionStatus, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

// ── Auth helper ──────────────────────────────────────────────────────────────
async function requireRole(...roles: string[]) {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (roles.length && !roles.includes(session.user.role)) {
    throw new Error('Insufficient permissions')
  }
  return session
}

// ── Blog ─────────────────────────────────────────────────────────────────────
export async function createBlogPost(formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR')
  const session = await auth()

  const authorName = (formData.get('authorName') as string)?.trim() || session!.user.name || 'Orion eSolutions'
  let author = await prisma.author.findFirst({ where: { name: authorName } })
  if (!author) {
    author = await prisma.author.create({
      data: { name: authorName, role: session!.user.role },
    })
  }

  const title = formData.get('title') as string
  const slugRaw = formData.get('slug') as string
  const slug = (slugRaw || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).slice(0, 200)
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []
  const status = (formData.get('status') as PostStatus) || PostStatus.DRAFT

  await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      tags,
      authorId: author.id,
      status,
      featured: formData.get('featured') === 'on',
      imageUrl: (formData.get('imageUrl') as string) || null,
      readingTime: parseInt(formData.get('readingTime') as string) || 5,
      metaTitle: ((formData.get('metaTitle') as string) || '').slice(0, 250) || null,
      metaDesc: ((formData.get('metaDesc') as string) || '').slice(0, 500) || null,
      publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
    },
  })
  revalidatePath('/admin/blog')
  redirect('/admin/blog')
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR')
  const status = (formData.get('status') as PostStatus) || PostStatus.DRAFT
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []
  const newSlugRaw = (formData.get('slug') as string || '').trim()
  const newSlug = (newSlugRaw ? newSlugRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : id).slice(0, 200)

  const authorName = (formData.get('authorName') as string)?.trim()
  if (authorName) {
    const post = await prisma.blogPost.findUnique({ where: { slug: id }, select: { authorId: true } })
    if (post) await prisma.author.update({ where: { id: post.authorId }, data: { name: authorName } })
  }

  await prisma.blogPost.update({
    where: { slug: id },
    data: {
      slug: newSlug,
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      tags,
      status,
      featured: formData.get('featured') === 'on',
      imageUrl: (formData.get('imageUrl') as string) || null,
      readingTime: parseInt(formData.get('readingTime') as string) || 5,
      metaTitle: ((formData.get('metaTitle') as string) || '').slice(0, 250) || null,
      metaDesc: ((formData.get('metaDesc') as string) || '').slice(0, 500) || null,
      publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
    },
  })
  revalidatePath('/admin/blog')
  redirect('/admin/blog')
}

export async function deleteBlogPost(slug: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  await prisma.blogPost.delete({ where: { slug } })
  revalidatePath('/admin/blog')
}

// ── Portfolio ─────────────────────────────────────────────────────────────────
export async function createPortfolioItem(formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  const title = formData.get('title') as string
  const slugRaw = formData.get('slug') as string
  const slug = slugRaw || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const techRaw = formData.get('technologies') as string
  const technologies = techRaw ? techRaw.split(',').map((t) => t.trim()).filter(Boolean) : []
  let metrics: Record<string, string>[] = []
  try {
    metrics = JSON.parse((formData.get('metrics') as string) || '[]')
  } catch {
    metrics = []
  }

  await prisma.portfolioItem.create({
    data: {
      slug,
      title,
      client: formData.get('client') as string,
      industry: formData.get('industry') as string,
      service: formData.get('service') as string,
      challenge: formData.get('challenge') as string,
      solution: formData.get('solution') as string,
      outcome: formData.get('outcome') as string,
      metrics,
      technologies,
      imageUrl: (formData.get('imageUrl') as string) || null,
      featured: formData.get('featured') === 'on',
      published: formData.get('published') === 'on',
      sortOrder: parseInt((formData.get('sortOrder') as string) || '0') || 0,
    },
  })
  revalidatePath('/admin/portfolio')
  revalidatePath('/')
  redirect('/admin/portfolio')
}

export async function updatePortfolioItem(slug: string, formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  const techRaw = formData.get('technologies') as string
  const technologies = techRaw ? techRaw.split(',').map((t) => t.trim()).filter(Boolean) : []
  let metrics: Record<string, string>[] = []
  try {
    metrics = JSON.parse((formData.get('metrics') as string) || '[]')
  } catch {
    metrics = []
  }
  const newSlugRaw = (formData.get('slug') as string || '').trim()
  const newSlug = newSlugRaw ? newSlugRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : slug

  await prisma.portfolioItem.update({
    where: { slug },
    data: {
      slug: newSlug,
      title: formData.get('title') as string,
      client: formData.get('client') as string,
      industry: formData.get('industry') as string,
      service: formData.get('service') as string,
      challenge: formData.get('challenge') as string,
      solution: formData.get('solution') as string,
      outcome: formData.get('outcome') as string,
      metrics,
      technologies,
      imageUrl: (formData.get('imageUrl') as string) || null,
      featured: formData.get('featured') === 'on',
      published: formData.get('published') === 'on',
    },
  })
  revalidatePath('/admin/portfolio')
  revalidatePath('/')
  revalidatePath('/portfolio')
  redirect('/admin/portfolio')
}

export async function deletePortfolioItem(slug: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  await prisma.portfolioItem.delete({ where: { slug } })
  revalidatePath('/admin/portfolio')
}

// ── Team ──────────────────────────────────────────────────────────────────────
export async function createTeamMember(formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  await prisma.teamMember.create({
    data: {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      bio: formData.get('bio') as string,
      avatarUrl: (formData.get('avatarUrl') as string) || null,
      linkedin: (formData.get('linkedin') as string) || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    },
  })
  revalidatePath('/admin/team')
  redirect('/admin/team')
}

export async function updateTeamMember(id: string, formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  await prisma.teamMember.update({
    where: { id },
    data: {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      bio: formData.get('bio') as string,
      avatarUrl: (formData.get('avatarUrl') as string) || null,
      linkedin: (formData.get('linkedin') as string) || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      active: formData.get('active') === 'on',
    },
  })
  revalidatePath('/admin/team')
  redirect('/admin/team')
}

export async function deleteTeamMember(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  await prisma.teamMember.delete({ where: { id } })
  revalidatePath('/admin/team')
}

// ── Services ──────────────────────────────────────────────────────────────────
function parseJsonArr(raw: string | null): string[] {
  if (!raw) return []
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : [] } catch { return [] }
}

function parseStats(raw: string | null): { value: string; label: string }[] {
  if (!raw?.trim()) return []
  return raw.split('\n').flatMap((line) => {
    const [value, ...rest] = line.split('|')
    const stat = { value: value.trim(), label: rest.join('|').trim() }
    return stat.value && stat.label ? [stat] : []
  })
}

export async function createService(formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  const title   = formData.get('title') as string
  const slugRaw = formData.get('slug') as string
  const slug    = slugRaw || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  await prisma.service.create({
    data: {
      slug, title,
      shortDesc:     formData.get('shortDesc') as string,
      description:   formData.get('description') as string,
      icon:          (formData.get('icon') as string) || 'Star',
      features:      parseJsonArr(formData.get('features') as string),
      benefits:      parseJsonArr(formData.get('benefits') as string),
      technologies:  parseJsonArr(formData.get('technologies') as string),
      heroBadge:     (formData.get('heroBadge') as string)?.trim() || null,
      heroHighlight: (formData.get('heroHighlight') as string)?.trim() || null,
      heroSubtext:   (formData.get('heroSubtext') as string)?.trim() || null,
      heroImageUrl:  (formData.get('heroImageUrl') as string)?.trim() || null,
      heroStats:     parseStats(formData.get('heroStats') as string),
      metaTitle:     (formData.get('metaTitle') as string) || null,
      metaDescription: (formData.get('metaDescription') as string) || null,
      published:     formData.get('published') === 'on',
      sortOrder:     parseInt(formData.get('sortOrder') as string) || 0,
    },
  })
  revalidatePath('/admin/services')
  redirect('/admin/services')
}

export async function updateService(slug: string, formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  const newSlugRaw = (formData.get('slug') as string || '').trim()
  const newSlug = newSlugRaw ? newSlugRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : slug

  await prisma.service.update({
    where: { slug },
    data: {
      slug:          newSlug,
      title:         formData.get('title') as string,
      shortDesc:     formData.get('shortDesc') as string,
      description:   formData.get('description') as string,
      icon:          (formData.get('icon') as string) || 'Star',
      features:      parseJsonArr(formData.get('features') as string),
      benefits:      parseJsonArr(formData.get('benefits') as string),
      technologies:  parseJsonArr(formData.get('technologies') as string),
      heroBadge:     (formData.get('heroBadge') as string)?.trim() || null,
      heroHighlight: (formData.get('heroHighlight') as string)?.trim() || null,
      heroSubtext:   (formData.get('heroSubtext') as string)?.trim() || null,
      heroImageUrl:  (formData.get('heroImageUrl') as string)?.trim() || null,
      heroStats:     parseStats(formData.get('heroStats') as string),
      metaTitle:     (formData.get('metaTitle') as string) || null,
      metaDescription: (formData.get('metaDescription') as string) || null,
      published:     formData.get('published') === 'on',
      sortOrder:     parseInt(formData.get('sortOrder') as string) || 0,
    },
  })
  revalidatePath('/admin/services')
  redirect('/admin/services')
}

export async function deleteService(slug: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  await prisma.service.delete({ where: { slug } })
  revalidatePath('/admin/services')
}

// ── Resources ──────────────────────────────────────────────────────────────────
export async function createResource(formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  const title = formData.get('title') as string
  const slugRaw = formData.get('slug') as string
  const slug = slugRaw || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  await prisma.resource.create({
    data: {
      slug,
      title,
      type: formData.get('type') as string,
      topic: formData.get('topic') as string,
      excerpt: formData.get('excerpt') as string,
      coverImage: (formData.get('coverImage') as string) || null,
      gated: formData.get('gated') === 'on',
      watchUrl: (formData.get('watchUrl') as string) || null,
      published: formData.get('published') === 'on',
    },
  })
  revalidatePath('/admin/resources')
  redirect('/admin/resources')
}

export async function updateResource(id: string, formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  await prisma.resource.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      topic: formData.get('topic') as string,
      excerpt: formData.get('excerpt') as string,
      coverImage: (formData.get('coverImage') as string) || null,
      gated: formData.get('gated') === 'on',
      watchUrl: (formData.get('watchUrl') as string) || null,
      published: formData.get('published') === 'on',
    },
  })
  revalidatePath('/admin/resources')
  redirect('/admin/resources')
}

export async function deleteResource(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  await prisma.resource.delete({ where: { id } })
  revalidatePath('/admin/resources')
}

// ── Contacts ──────────────────────────────────────────────────────────────────
export async function updateContactStatus(id: string, formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  const status = formData.get('status') as SubmissionStatus
  await prisma.contactSubmission.update({
    where: { id },
    data: {
      status,
      respondedAt: status === SubmissionStatus.RESPONDED ? new Date() : undefined,
    },
  })
  revalidatePath('/admin/contacts')
  revalidatePath(`/admin/contacts/${id}`)
}

export async function addContactNote(id: string, formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  await prisma.contactSubmission.update({
    where: { id },
    data: { notes: formData.get('notes') as string },
  })
  revalidatePath(`/admin/contacts/${id}`)
}

// ── Subscribers ───────────────────────────────────────────────────────────────
export async function deleteSubscriber(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  await prisma.newsletterSubscriber.delete({ where: { id } })
  revalidatePath('/admin/subscribers')
}

// ── Users ─────────────────────────────────────────────────────────────────────
export async function createUser(formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  const password = formData.get('password') as string
  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: hashed,
      role: (formData.get('role') as Role) || Role.AUTHOR,
    },
  })
  revalidatePath('/admin/users')
  redirect('/admin/users')
}

export async function updateUser(id: string, formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  const password = formData.get('password') as string
  type UserUpdate = { name: string; email: string; role: Role; active: boolean; password?: string }
  const updateData: UserUpdate = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as Role,
    active: formData.get('active') === 'on',
  }
  if (password) {
    updateData.password = await bcrypt.hash(password, 12)
  }
  await prisma.user.update({ where: { id }, data: updateData })
  revalidatePath('/admin/users')
  redirect('/admin/users')
}

export async function deleteUser(id: string) {
  await requireRole('SUPER_ADMIN')
  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/users')
}
