import { prisma } from '@/lib/prisma'
import { restoreRevision } from '@/lib/admin/revision-actions'
import { History, RotateCcw } from 'lucide-react'

interface Props {
  entityType: 'blog_post' | 'page'
  entityId: string
}

export async function RevisionPanel({ entityType, entityId }: Props) {
  let revisions: { id: string; title: string; editedBy: string; createdAt: Date }[] = []
  try {
    revisions = await prisma.revision.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, title: true, editedBy: true, createdAt: true },
    })
  } catch { return null }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <History size={16} className="text-slate-400" />
        <h2 className="font-semibold text-slate-800 text-sm">
          Revision History
          {revisions.length > 0 && (
            <span className="ml-2 text-xs font-normal text-slate-400">({revisions.length} saved)</span>
          )}
        </h2>
      </div>

      {revisions.length === 0 ? (
        <p className="text-sm text-slate-400">
          No revisions yet. A snapshot is saved each time you click Save Changes.
        </p>
      ) : (
        <div className="space-y-1">
          {revisions.map((rev) => {
            const restoreAction = restoreRevision.bind(null, rev.id)
            return (
              <div key={rev.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 group">
                <div className="min-w-0">
                  <p className="text-sm text-slate-700 truncate font-medium">{rev.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {rev.editedBy} &middot; {rev.createdAt.toLocaleDateString()} {rev.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <form action={restoreAction} className="shrink-0 ml-3">
                  <button
                    type="submit"
                    title="Restore this revision"
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all px-2 py-1 rounded hover:bg-indigo-50"
                  >
                    <RotateCcw size={12} /> Restore
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
