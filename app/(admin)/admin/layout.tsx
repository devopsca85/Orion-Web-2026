import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'
import { signOutAction } from '@/lib/admin/auth-actions'

export const metadata = {
  title: 'Admin — Orion eSolutions CMS',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={session.user} signOutAction={signOutAction} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
