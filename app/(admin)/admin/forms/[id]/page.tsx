import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { updateForm } from '@/lib/admin/form-actions'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { FormBuilder } from '@/components/admin/FormBuilder'

interface Props { params: Promise<{ id: string }> }

export default async function EditFormPage({ params }: Props) {
  const session = await auth()
  const { id } = await params
  const form = await prisma.form.findUnique({ where: { id } })
  if (!form) notFound()

  const action = updateForm.bind(null, id)

  return (
    <>
      <AdminTopBar title="Edit Form" user={session!.user} />
      <div className="p-6 max-w-4xl">
        <Link href="/admin/forms" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ChevronLeft size={15} /> Back to Forms
        </Link>
        <FormBuilder action={action} defaultValues={{
          name: form.name,
          slug: form.slug,
          title: form.title,
          description: form.description ?? '',
          fields: JSON.stringify(form.fields ?? []),
          submitLabel: form.submitLabel,
          successMsg: form.successMsg,
          notifyEmail: form.notifyEmail ?? '',
          active: form.active,
        }} />
      </div>
    </>
  )
}
