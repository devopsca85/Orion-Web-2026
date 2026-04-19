import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { DeleteForm } from '@/components/admin/DeleteForm'
import { deleteNavItem, moveToTopLevel, seedNavFromConstants } from '@/lib/admin/nav-actions'
import Link from 'next/link'
import { Plus, Pencil, ArrowUpToLine } from 'lucide-react'

const TYPE_BADGE: Record<string, string> = {
  mega:        'bg-blue-100 text-blue-700',
  megaGroup:   'bg-indigo-100 text-indigo-700',
  dropdown:    'bg-purple-100 text-purple-700',
  productMega: 'bg-cyan-100 text-cyan-700',
  productCard: 'bg-teal-100 text-teal-700',
  link:        'bg-slate-100 text-slate-600',
}

type NavRow = {
  id: string
  label: string
  href: string
  type: string
  sortOrder: number
  active: boolean
}

type NavChild = NavRow & { children: NavRow[] }
type NavTop   = NavRow & { children: NavChild[] }

export default async function NavigationAdminPage() {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = (await prisma.navItem.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: 'asc' },
    include: {
      children: {
        orderBy: { sortOrder: 'asc' },
        include: {
          children: { orderBy: { sortOrder: 'asc' } },
        },
      },
    },
  })) as unknown as NavTop[]

  function renderRow(item: NavRow, depth: number, isChild: boolean) {
    const deleteAction = deleteNavItem.bind(null, item.id)
    const moveAction = moveToTopLevel.bind(null, item.id)
    return (
      <tr key={item.id} className="hover:bg-slate-50">
        <td className="px-5 py-3">
          <span className="font-medium text-slate-800" style={{ paddingLeft: `${depth * 20}px` }}>
            {depth > 0 && <span className="text-slate-300 mr-2">{depth === 1 ? '└─' : '  └─'}</span>}
            {item.label}
          </span>
        </td>
        <td className="px-5 py-3 text-slate-500 font-mono text-xs">{item.href}</td>
        <td className="px-5 py-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[item.type] ?? TYPE_BADGE.link}`}>
            {item.type}
          </span>
        </td>
        <td className="px-5 py-3 text-slate-500 text-xs">{item.sortOrder}</td>
        <td className="px-5 py-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {item.active ? 'Active' : 'Hidden'}
          </span>
        </td>
        <td className="px-5 py-3">
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/navigation/${item.id}`}
              className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 transition-colors"
            >
              <Pencil size={13} /> Edit
            </Link>
            {isChild && (
              <form action={moveAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1 text-slate-600 hover:text-amber-700 px-2.5 py-1.5 rounded-lg text-sm bg-slate-50 hover:bg-amber-50 transition-colors"
                  title="Move to top level"
                >
                  <ArrowUpToLine size={13} /> Top
                </button>
              </form>
            )}
            <DeleteForm action={deleteAction} />
          </div>
        </td>
      </tr>
    )
  }

  return (
    <>
      <AdminTopBar title="Navigation" user={session!.user} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{items.length} top-level item{items.length !== 1 ? 's' : ''}</p>
          <div className="flex items-center gap-3">
            <form action={seedNavFromConstants}>
              <button
                type="submit"
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Seed from Defaults
              </button>
            </form>
            <Link
              href="/admin/navigation/new"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={15} /> Add Item
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">Label</th>
                  <th className="text-left px-5 py-3 font-medium">Href</th>
                  <th className="text-left px-5 py-3 font-medium">Type</th>
                  <th className="text-left px-5 py-3 font-medium">Sort</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      No nav items yet.{' '}
                      <Link href="/admin/navigation/new" className="text-indigo-600 hover:underline">Add one</Link> or{' '}
                      <form action={seedNavFromConstants} className="inline">
                        <button type="submit" className="text-indigo-600 hover:underline">seed from defaults</button>
                      </form>.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <>
                      {renderRow(item, 0, false)}
                      {item.children.map((child) => (
                        <>
                          {renderRow(child, 1, true)}
                          {child.children.map((grandchild) =>
                            renderRow(grandchild, 2, true)
                          )}
                        </>
                      ))}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
