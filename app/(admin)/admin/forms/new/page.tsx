import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { createForm } from '@/lib/admin/form-actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { FormBuilder } from '@/components/admin/FormBuilder'

export default async function NewFormPage() {
  const session = await auth()

  return (
    <>
      <AdminTopBar title="New Form" user={session!.user} />
      <div className="p-6 max-w-4xl">
        <Link href="/admin/forms" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ChevronLeft size={15} /> Back to Forms
        </Link>
        <FormBuilder action={createForm} />
      </div>
    </>
  )
}
