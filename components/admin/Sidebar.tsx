'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  LayoutDashboard, FileText, Briefcase, Users, Wrench, BookOpen,
  Mail, Bell, UserCheck, UserCog, ImageIcon, LogOut, ChevronDown,
  Layout, Navigation, Palette, Home, Quote, Building2, Layers,
  Trophy, HelpCircle, Code2, GraduationCap, FormInput, Settings,
  BarChart2, ShieldCheck, Send, Lightbulb,
} from 'lucide-react'
import { filterNavItems } from '@/lib/role-permissions'
import type { Role } from '@/lib/role-permissions'

interface NavItem  { href: string; label: string; icon: React.ReactNode }
interface NavGroup { title: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { href: '/admin',           label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
      { href: '/admin/analytics', label: 'Analytics', icon: <BarChart2 size={16} /> },
      { href: '/admin/security',  label: 'Security',  icon: <ShieldCheck size={16} /> },
    ],
  },
  {
    title: 'Pages',
    items: [
      { href: '/admin/home/sections', label: 'Page Manager',  icon: <Layers size={16} /> },
      { href: '/admin/home',          label: 'Hero & CTA',        icon: <Home size={16} /> },
      { href: '/admin/home/stats',    label: 'Stats Bar',         icon: <BarChart2 size={16} /> },
      { href: '/admin/pages',         label: 'Custom Pages',      icon: <Layout size={16} /> },
      { href: '/admin/navigation',    label: 'Navigation',        icon: <Navigation size={16} /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/blog',         label: 'Blog Posts',   icon: <FileText size={16} /> },
      { href: '/admin/portfolio',    label: 'Portfolio',    icon: <Layers size={16} /> },
      { href: '/admin/testimonials', label: 'Testimonials', icon: <Quote size={16} /> },
      { href: '/admin/team',         label: 'Team',         icon: <Users size={16} /> },
      { href: '/admin/services',     label: 'Services',     icon: <Wrench size={16} /> },
      { href: '/admin/products',     label: 'Products',     icon: <Layers size={16} /> },
      { href: '/admin/resources',    label: 'Resources',    icon: <BookOpen size={16} /> },
    ],
  },
  {
    title: 'Site Sections',
    items: [
      { href: '/admin/features',          label: 'Why Us / Features',  icon: <Lightbulb size={16} /> },
      { href: '/admin/client-logos',      label: 'Client Logos',       icon: <Building2 size={16} /> },
      { href: '/admin/tech-stack',        label: 'Tech Stack',          icon: <Code2 size={16} /> },
      { href: '/admin/engagement-models', label: 'Engagement Models',  icon: <Layers size={16} /> },
      { href: '/admin/awards',            label: 'Awards',              icon: <Trophy size={16} /> },
      { href: '/admin/faqs',              label: 'FAQs',                icon: <HelpCircle size={16} /> },
    ],
  },
  {
    title: 'Careers',
    items: [
      { href: '/admin/job-openings', label: 'Job Openings', icon: <GraduationCap size={16} /> },
      { href: '/admin/applications', label: 'Applications', icon: <UserCheck size={16} /> },
    ],
  },
  {
    title: 'Forms',
    items: [
      { href: '/admin/forms', label: 'Form Builder', icon: <FormInput size={16} /> },
    ],
  },
  {
    title: 'Inbox',
    items: [
      { href: '/admin/contacts',    label: 'Contacts',        icon: <Mail size={16} /> },
      { href: '/admin/subscribers', label: 'Subscribers',     icon: <Bell size={16} /> },
      { href: '/admin/newsletter',  label: 'Send Newsletter', icon: <Send size={16} /> },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/users', label: 'Users', icon: <UserCog size={16} /> },
      { href: '/admin/media', label: 'Media', icon: <ImageIcon size={16} /> },
    ],
  },
  {
    title: 'Footer',
    items: [
      { href: '/admin/footer/sections', label: 'Footer Layout',  icon: <Layers size={16} /> },
      { href: '/admin/country-offices', label: 'Country Offices',icon: <Building2 size={16} /> },
      { href: '/admin/footer-links',    label: 'Footer Links',   icon: <Layout size={16} /> },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/design',           label: 'Design & CSS',     icon: <Palette size={16} /> },
      { href: '/admin/branding',         label: 'Branding',         icon: <Palette size={16} /> },
      { href: '/admin/contact-settings', label: 'Calendly Settings',icon: <FormInput size={16} /> },
      { href: '/admin/email-settings',   label: 'Email Settings',   icon: <Settings size={16} /> },
    ],
  },
]

/* Collapsible group */
function NavGroupSection({
  group,
  isActive,
  defaultOpen,
}: {
  group: NavGroup
  isActive: (href: string) => boolean
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const hasActive = group.items.some(i => isActive(i.href))

  /* Keep open if a child becomes active after navigation */
  useEffect(() => {
    if (hasActive) setOpen(true)
  }, [hasActive])

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          w-full flex items-center justify-between px-3 py-1.5 mb-0.5 rounded-md
          text-[11px] font-semibold uppercase tracking-wider transition-colors duration-150
          ${hasActive
            ? 'text-indigo-400 hover:text-indigo-300'
            : 'text-slate-500 hover:text-slate-300'}
        `}
      >
        <span>{group.title}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {/* Animated content */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: open ? `${(contentRef.current?.scrollHeight ?? group.items.length * 40) + 8}px` : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <ul className="space-y-0.5 pb-2">
          {group.items.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-150
                    ${active
                      ? 'bg-indigo-500/20 text-indigo-400 border-l-2 border-indigo-400 pl-[10px]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <span className={active ? 'text-indigo-400' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

interface SidebarProps {
  user: { name?: string | null; email?: string | null; role?: string }
  signOutAction: () => Promise<void>
}

export function Sidebar({ user, signOutAction }: SidebarProps) {
  const pathname = usePathname()
  const role = (user.role ?? 'AUTHOR') as Role

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  function groupHasActive(group: NavGroup) {
    return group.items.some(i => isActive(i.href))
  }

  // Filter nav items the current role can see
  const visibleGroups = navGroups
    .map((g) => ({ ...g, items: filterNavItems(role, g.items) }))
    .filter((g) => g.items.length > 0)

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-slate-900 border-r border-slate-800 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
        <span className="text-lg font-bold text-white tracking-tight">Orion</span>
        <span className="text-lg font-bold text-indigo-400">.</span>
        <span className="text-lg font-bold text-white tracking-tight">CMS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {visibleGroups.map((group) => (
          <NavGroupSection
            key={group.title}
            group={group}
            isActive={isActive}
            defaultOpen={groupHasActive(group)}
          />
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.name?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
