'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface MediaFile {
  name: string
  path: string
  folder: string
  ext: string
}

interface MediaGridProps {
  files: MediaFile[]
}

const imageExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'])

export function MediaGrid({ files }: MediaGridProps) {
  const [copied, setCopied] = useState<string | null>(null)

  function copyPath(path: string) {
    navigator.clipboard.writeText(path)
    setCopied(path)
    setTimeout(() => setCopied(null), 2000)
  }

  // Group by folder
  const folders = Array.from(new Set(files.map((f) => f.folder))).sort()

  if (files.length === 0) {
    return (
      <p className="text-slate-400 text-center py-12">No image files found in public/assets/images.</p>
    )
  }

  return (
    <div className="space-y-8">
      {folders.map((folder) => {
        const folderFiles = files.filter((f) => f.folder === folder)
        return (
          <div key={folder}>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-slate-400">/</span>
              {folder || 'root'}
              <span className="text-xs font-normal normal-case text-slate-400">({folderFiles.length})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {folderFiles.map((file) => {
                const isImage = imageExts.has(file.ext.toLowerCase())
                const isCopied = copied === file.path

                return (
                  <div
                    key={file.path}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-indigo-300 hover:shadow-sm transition-all"
                  >
                    {/* Preview */}
                    <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                      {isImage ? (
                        <img
                          src={file.path}
                          alt={file.name}
                          className="w-full h-full object-contain p-1"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <div className={`text-slate-400 text-2xl ${isImage ? 'hidden' : ''}`}>
                        {file.ext.toUpperCase().replace('.', '')}
                      </div>
                    </div>

                    {/* Info + Copy */}
                    <div className="p-2.5">
                      <p className="text-xs text-slate-700 font-medium truncate mb-1.5" title={file.name}>
                        {file.name}
                      </p>
                      <button
                        onClick={() => copyPath(file.path)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors w-full"
                      >
                        {isCopied ? (
                          <>
                            <Check size={12} className="text-green-500 shrink-0" />
                            <span className="text-green-600 truncate">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} className="shrink-0" />
                            <span className="truncate">Copy path</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
