import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DesignEditor } from '@/components/admin/DesignEditor'
import { getDesignSettings } from '@/lib/admin/design-actions'
import { CheckCircle } from 'lucide-react'

interface Props { searchParams: Promise<{ saved?: string }> }

export default async function DesignPage({ searchParams }: Props) {
  const session = await auth()
  const { saved } = await searchParams
  const settings = await getDesignSettings()

  return (
    <>
      <AdminTopBar title="Design & CSS" user={session!.user} />
      <div className="p-6 max-w-5xl">
        {saved === '1' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
            <CheckCircle size={16} /> Design settings saved — changes are live on your website.
          </div>
        )}
        <DesignEditor settings={settings} />
      </div>
    </>
  )
}
