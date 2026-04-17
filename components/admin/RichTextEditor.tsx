'use client'

import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
import { useState } from 'react'

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-48 bg-slate-50 animate-pulse flex items-center justify-center text-slate-400 text-sm rounded-b-lg">
      Loading editor…
    </div>
  ),
})

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image'],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
}

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'align', 'link', 'image', 'blockquote', 'code-block',
]

interface RichTextEditorProps {
  content?: string
  name: string
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({
  content = '',
  name,
  placeholder = 'Start writing…',
  minHeight = '400px',
}: RichTextEditorProps) {
  const [value, setValue] = useState(content)

  return (
    <div className="quill-editor-wrap rounded-lg border border-slate-200 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      <style>{`.quill-editor-wrap .ql-editor { min-height: ${minHeight}; }`}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <input type="hidden" name={name} value={value} />
    </div>
  )
}
