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

export function MediaGrid({ files }: MediaGridProps) {
  const [copied, setCopied] = useState<string | null>(null)

  function copyPath(path: string) {
    navigator.clipboard.writeText(path)
    setCopied(path)
    setTimeout(() => setCopied(null), 2000)
  }

  const folders = Array.from(new Set(files.map((f) => f.folder))).sort()

  if (files.length === 0) {
    return (
      <p className="text-slate-400 text-center py-12">
        No image files found in public/assets/images.
      </p>
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
              <span className="text-xs font-normal normal-case text-slate-400">
                ({folderFiles.length})
              </span>
            </h3>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="text-left px-4 py-2.5 font-medium">File</th>
                    <th className="text-left px-4 py-2.5 font-medium">Type</th>
                    <th className="text-left px-4 py-2.5 font-medium">Public Path</th>
                    <th className="px-4 py-2.5 font-medium">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {folderFiles.map((file) => {
                    const isCopied = copied === file.path
                    return (
                      <tr key={file.path} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-medium text-slate-800 max-w-xs">
                          <span className="truncate block" title={file.name}>
                            {file.name}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-400 uppercase text-xs font-mono">
                          {file.ext.replace('.', '')}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 font-mono text-xs max-w-sm">
                          <span className="truncate block" title={file.path}>
                            {file.path}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() => copyPath(file.path)}
                            title={isCopied ? 'Copied!' : 'Copy path'}
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                          >
                            {isCopied ? (
                              <Check size={13} className="text-green-500" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
