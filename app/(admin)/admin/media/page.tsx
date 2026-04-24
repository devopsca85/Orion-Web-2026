import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { MediaGrid } from '@/components/admin/MediaGrid'
import { walkMedia, walkFolders, getImagesDir } from '@/lib/media'

export default async function MediaPage() {
  const session = await auth()
  const dir = getImagesDir()
  const files = walkMedia(dir).sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name))
  const allFolders = Array.from(new Set([
    ...files.map((f) => f.folder).filter(Boolean),
    ...walkFolders(dir),
  ])).sort()

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const mb = (totalSize / 1024 / 1024).toFixed(1)

  return (
    <>
      <AdminTopBar title="Media Library" user={session!.user} />
      <div className="p-6">
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{files.length}</span> file{files.length !== 1 ? 's' : ''} across{' '}
            <span className="font-semibold text-slate-800">{allFolders.length}</span> folder{allFolders.length !== 1 ? 's' : ''}{' '}
            &mdash; <span className="font-semibold text-slate-800">{mb} MB</span> total
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Upload, rename, and delete files · click folder name to expand · copy public paths</p>
        </div>
        <MediaGrid files={files} allFolders={allFolders} />
      </div>
    </>
  )
}
