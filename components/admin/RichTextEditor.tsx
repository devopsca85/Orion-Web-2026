'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from 'lucide-react'

interface RichTextEditorProps {
  content?: string
  name: string
  placeholder?: string
  minHeight?: string
}

function Divider() {
  return <div className="w-px h-5 bg-slate-200 mx-1 self-center" />
}

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active = false, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 rounded text-sm font-medium transition-colors flex items-center justify-center ${
        active
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )
}

export function RichTextEditor({
  content = '',
  name,
  placeholder = 'Start writing…',
  minHeight = '400px',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none px-4 py-3',
      },
    },
  })

  if (!editor) return null

  const handleLinkInsert = () => {
    const url = window.prompt('Enter URL:', editor.getAttributes('link').href ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: url }).run()
  }

  const handleImageInsert = () => {
    const url = window.prompt('Enter image URL:')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-slate-50 border-b border-slate-200">
        {/* Heading / Paragraph */}
        <select
          value={
            editor.isActive('heading', { level: 1 })
              ? '1'
              : editor.isActive('heading', { level: 2 })
              ? '2'
              : editor.isActive('heading', { level: 3 })
              ? '3'
              : '0'
          }
          onChange={(e) => {
            const val = e.target.value
            if (val === '0') {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level: parseInt(val) as 1 | 2 | 3 }).run()
            }
          }}
          className="text-sm rounded border border-slate-200 bg-white text-slate-700 px-1.5 py-1 focus:outline-none focus:border-indigo-400 cursor-pointer"
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <Divider />

        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </ToolbarButton>

        <Divider />

        {/* Text alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight size={14} />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered size={14} />
        </ToolbarButton>

        <Divider />

        {/* Block elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code2 size={14} />
        </ToolbarButton>

        <Divider />

        {/* Link & Image */}
        <ToolbarButton
          onClick={handleLinkInsert}
          active={editor.isActive('link')}
          title="Insert Link"
        >
          <LinkIcon size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleImageInsert}
          active={false}
          title="Insert Image"
        >
          <ImageIcon size={14} />
        </ToolbarButton>

        <Divider />

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo2 size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo2 size={14} />
        </ToolbarButton>
      </div>

      {/* Editor content area */}
      <div style={{ minHeight }}>
        <EditorContent editor={editor} style={{ minHeight }} />
      </div>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={editor.getHTML()} />

      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
        .tiptap {
          min-height: ${minHeight};
        }
        .tiptap h1 { font-size: 1.75rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .tiptap h2 { font-size: 1.4rem; font-weight: 600; margin: 0.875rem 0 0.4rem; }
        .tiptap h3 { font-size: 1.15rem; font-weight: 600; margin: 0.75rem 0 0.35rem; }
        .tiptap p { margin: 0.5rem 0; line-height: 1.6; }
        .tiptap ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .tiptap ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .tiptap li { margin: 0.25rem 0; }
        .tiptap blockquote { border-left: 3px solid #6366f1; padding-left: 1rem; margin: 0.75rem 0; color: #475569; font-style: italic; }
        .tiptap pre { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.75rem 0; font-size: 0.875rem; }
        .tiptap code { background: #f1f5f9; color: #4f46e5; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875em; }
        .tiptap pre code { background: transparent; color: inherit; padding: 0; }
        .tiptap a { color: #4f46e5; text-decoration: underline; }
        .tiptap img { max-width: 100%; border-radius: 0.375rem; margin: 0.5rem 0; }
        .tiptap table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; }
        .tiptap th, .tiptap td { border: 1px solid #e2e8f0; padding: 0.5rem 0.75rem; }
        .tiptap th { background: #f8fafc; font-weight: 600; }
      `}</style>
    </div>
  )
}
