'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Wrench,
  BookOpen,
  Mail,
  Bell,
  UserCheck,
  UserCog,
  ImageIcon,
  LogOut,
  ChevronRight,
  Layout,
  Palette,
  Home,
  Quote,
  Building2,
  Layers,
  Trophy,
  HelpCircle,
  Code2,
  GraduationCap,
  FormInput,
  Settings,
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    title: 'Pages',
    items: [
      { href: '/admin/home', label: 'Home Page', icon: <Home size={16} /> },
      { href: '/admin/pages', label: 'Custom Pages', icon: <Layout size={16} /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/blog', label: 'Blog Posts', icon: <FileText size={16} /> },
      { href: '/admin/portfolio', label: 'Portfolio', icon: <Briefcase size={16} /> },
      { href: '/admin/testimonials', label: 'Testimonials', icon: <Quote size={16} /> },
      { href: '/admin/team', label: 'Team', icon: <Users size={16} /> },
      { href: '/admin/services', label: 'Services', icon: <Wrench size={16} /> },
      { href: '/admin/products', label: 'Products', icon: <Layers size={16} /> },
      { href: '/admin/resources', label: 'Resources', icon: <BookOpen size={16} /> },
    ],
  },
  {
    title: 'Site Sections',
    items: [
      { href: '/admin/client-logos', label: 'Client Logos', icon: <Building2 size={16} /> },
      { href: '/admin/tech-stack', label: 'Tech Stack', icon: <Code2 size={16} /> },
      { href: '/admin/engagement-models', label: 'Engagement Models', icon: <Layers size={16} /> },
      { href: '/admin/awards', label: 'Awards', icon: <Trophy size={16} /> },
      { href: '/admin/faqs', label: 'FAQs', icon: <HelpCircle size={16} /> },
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
      { href: '/admin/contacts', label: 'Contacts', icon: <Mail size={16} /> },
      { href: '/admin/subscribers', label: 'Subscribers', icon: <Bell size={16} /> },
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
    title: 'Settings',
    items: [
      { href: '/admin/branding', label: 'Branding', icon: <Palette size={16} /> },
      { href: '/admin/email-settings', label: 'Email Settings', icon: <Settings size={16} /> },
    ],
  },
]

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
  signOutAction: () => Promise<void>
}

export function Sidebar({ user, signOutAction }: SidebarProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-slate-900 border-r border-slate-800 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-white tracking-tight">Orion</span>
          <span className="text-lg font-bold text-indigo-400">.</span>
          <span className="text-lg font-bold text-white tracking-tight">CMS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="px-3 mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        active
                          ? 'bg-indigo-500/20 text-indigo-400 border-l-2 border-indigo-400 pl-[10px]'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className={active ? 'text-indigo-400' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      {item.label}
                      {active && (
                        <ChevronRight size={14} className="ml-auto text-indigo-400" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
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
            <LogOut size={15} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
