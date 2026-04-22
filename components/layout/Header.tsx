'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, ChevronDown, ArrowRight,
  Heart, TrendingUp, ShoppingBag, GraduationCap, Factory,
  Building2, Shield, Truck, Cpu, Code2, Cloud, Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  NAV_LINKS, SITE_CONFIG,
  type NavLink, type NavLinkMega, type NavLinkDropdown, type NavLinkProductMega,
} from '@/lib/constants'

/* ── Type guards ─────────────────────────────────────────────────── */
function isMega(l: NavLink): l is NavLinkMega               { return 'mega' in l && l.mega === true }
function isProductMega(l: NavLink): l is NavLinkProductMega { return 'productMega' in l && (l as NavLinkProductMega).productMega === true }
function hasChildren(l: NavLink): l is NavLinkDropdown       { return 'children' in l }

/* ── Icons ───────────────────────────────────────────────────────── */
const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  '/industries/healthcare':               <Heart className="h-4 w-4" />,
  '/industries/finance-banking':          <TrendingUp className="h-4 w-4" />,
  '/industries/retail-ecommerce':         <ShoppingBag className="h-4 w-4" />,
  '/industries/education':                <GraduationCap className="h-4 w-4" />,
  '/industries/manufacturing':            <Factory className="h-4 w-4" />,
  '/industries/real-estate':              <Building2 className="h-4 w-4" />,
  '/industries/government':               <Shield className="h-4 w-4" />,
  '/industries/logistics-transportation': <Truck className="h-4 w-4" />,
}

const COL_STYLES: Record<string, { icon: React.ReactNode; color: string }> = {
  '/services/artificial-intelligence': { icon: <Cpu className="h-4 w-4" />,    color: 'bg-violet-500' },
  '/services/application-development': { icon: <Code2 className="h-4 w-4" />,  color: 'bg-blue-500'   },
  '/services/cloud-services':          { icon: <Cloud className="h-4 w-4" />,   color: 'bg-sky-500'    },
  '/services/technology-development':  { icon: <Layers className="h-4 w-4" />, color: 'bg-indigo-500' },
}

/* gradient per product index */
const PRODUCT_GRADIENTS = [
  { bg: 'from-blue-600 to-indigo-700',    text: 'text-blue-100'   },
  { bg: 'from-violet-600 to-purple-700',  text: 'text-violet-100' },
  { bg: 'from-sky-500 to-blue-600',       text: 'text-sky-100'    },
  { bg: 'from-indigo-600 to-violet-700',  text: 'text-indigo-100' },
  { bg: 'from-emerald-500 to-teal-700',   text: 'text-emerald-100'},
]

interface BrandingData { logoUrl: string; logoAlt: string; phone: string; companyName: string }
interface HeaderProps  { branding?: BrandingData; navLinks?: NavLink[] }

export function Header({ branding, navLinks }: HeaderProps = {}) {
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileSections, setMobileSections] = useState<Set<string>>(new Set())
  const [scrolled, setScrolled]             = useState(false)
  const pathname  = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const logoSrc = branding?.logoUrl || '/assets/images/logo.png'
  const logoAlt = branding?.logoAlt || 'Orion eSolutions'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
    setMobileSections(new Set())
  }, [pathname])

  /* ── Hover helpers ───────────────────────────────────────────────
     Key insight: mega panels are DOM children of <header>, so moving
     the mouse from the trigger into the panel does NOT fire a header
     onMouseLeave. We put open on each trigger and close on the header.
  ── */
  const openDropdown  = useCallback((key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(key)
  }, [])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  function toggleMobile(href: string) {
    setMobileSections(prev => {
      const next = new Set(prev)
      next.has(href) ? next.delete(href) : next.add(href)
      return next
    })
  }

  const navItems = (navLinks ?? NAV_LINKS).filter(l => l.label !== 'Contact Us')

  function navItemCls(link: NavLink) {
    const active = isActive(link.href)
    return cn(
      'relative flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-150',
      active ? 'text-[var(--brand-secondary)]' : 'text-[var(--brand-nav)] hover:text-[var(--brand-secondary)]',
    )
  }

  function ActiveDot({ link }: { link: NavLink }) {
    return isActive(link.href)
      ? <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[var(--brand-secondary)]" />
      : null
  }

  return (
    /* onMouseLeave on the whole header → covers both the nav bar AND the
       absolute mega panels below, so the dropdown only closes when the
       mouse truly exits the header area.                               */
    <header
      ref={headerRef}
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-shadow duration-300 bg-[var(--brand-nav-bg)]',
        scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.28)]' : 'shadow-lg border-b border-black/20',
      )}
    >
      {/* ── Desktop bar ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <nav className="flex h-[70px] items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 mr-6" aria-label="Orion eSolutions Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc} alt={logoAlt} width={160} height={44} className="h-10 w-auto"
              onError={e => {
                const img = e.currentTarget as HTMLImageElement
                img.style.display = 'none'
                const fb = img.nextElementSibling as HTMLElement | null
                if (fb) fb.style.display = 'flex'
              }}
            />
            <span className="text-xl font-bold text-white hidden items-center gap-1">
              Orion <span className="text-[var(--brand-secondary)]">eSolutions</span>
            </span>
          </Link>

          {/* Desktop nav items */}
          <div className="hidden lg:flex items-center flex-1 gap-0.5">
            {navItems.map((link) => {
              const isOpen  = activeDropdown === link.href
              const withDrop = isMega(link) || isProductMega(link) || hasChildren(link)

              return (
                <div
                  key={link.href}
                  className="relative"
                  /* onMouseEnter here opens the dropdown; close is handled by
                     the header-level onMouseLeave above.                      */
                  onMouseEnter={() => withDrop ? openDropdown(link.href) : undefined}
                >
                  {withDrop ? (
                    <button
                      /* click still toggles so keyboard/touch users can open  */
                      onClick={() => setActiveDropdown(isOpen ? null : link.href)}
                      className={navItemCls(link)}
                      aria-expanded={isOpen}
                    >
                      {link.label}
                      <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />
                      <ActiveDot link={link} />
                    </button>
                  ) : (
                    <Link href={link.href} className={navItemCls(link)}>
                      {link.label}
                      <ActiveDot link={link} />
                    </Link>
                  )}

                  {/* ── Industries simple dropdown ── */}
                  {hasChildren(link) && !isMega(link) && !isProductMega(link) && (
                    <div className={cn(
                      'absolute left-0 top-full w-72 transition-all duration-200 origin-top-left',
                      isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none',
                    )}>
                      {/* invisible bridge fills gap between button and panel */}
                      <div className="h-1 w-full" />
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                        {link.children.map((child) => {
                          const icon = INDUSTRY_ICONS[child.href]
                          const itemActive = pathname === child.href
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setActiveDropdown(null)}
                              className={cn(
                                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                                itemActive ? 'text-blue-700 font-semibold bg-blue-50' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                              )}
                            >
                              {icon && (
                                <span className={cn(
                                  'flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 transition-colors',
                                  itemActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500',
                                )}>
                                  {icon}
                                </span>
                              )}
                              {child.label}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right: Let's Talk */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-[var(--brand-secondary)] hover:bg-orange-500 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-orange-500/40 hover:shadow-lg whitespace-nowrap"
            >
              Let&apos;s Talk <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-white hover:bg-white/10 transition-colors lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* ── Services mega panel ────────────────────────────────────── */}
      {navItems.map((link) => {
        if (!isMega(link)) return null
        const isOpen = activeDropdown === link.href
        return (
          <div
            key={link.href}
            className={cn(
              'hidden lg:block absolute inset-x-0 top-[70px] transition-all duration-200 origin-top',
              isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none',
            )}
          >
            <div className="bg-white border-t border-gray-100 shadow-2xl">
              <div className="mx-auto max-w-[1400px] px-8 py-8">
                <div className="grid grid-cols-5 gap-8">
                  {link.columns.map((col) => {
                    const style = COL_STYLES[col.href]
                    return (
                      <div key={col.href}>
                        <Link
                          href={col.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2.5 mb-4 group/col"
                        >
                          {style && (
                            <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg text-white flex-shrink-0', style.color)}>
                              {style.icon}
                            </span>
                          )}
                          <span className={cn(
                            'text-sm font-bold transition-colors',
                            pathname.startsWith(col.href) ? 'text-blue-700' : 'text-gray-900 group-hover/col:text-blue-700',
                          )}>
                            {col.title}
                          </span>
                        </Link>
                        <ul className="space-y-1">
                          {col.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className={cn(
                                  'flex items-center gap-1.5 text-sm py-1 transition-colors',
                                  pathname === item.href ? 'text-blue-700 font-medium' : 'text-gray-500 hover:text-blue-700',
                                )}
                              >
                                <span className="h-1 w-1 rounded-full bg-gray-300 flex-shrink-0" />
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}

                  {/* CTA panel */}
                  <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-700 p-6 flex flex-col justify-between text-white">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-orange-300 mb-2">Why Orion?</p>
                      <p className="text-sm text-blue-100 leading-relaxed">
                        Achieve digital excellence through Orion&apos;s transformative services — gaining a measurable competitive advantage.
                      </p>
                    </div>
                    <Link
                      href="/contact"
                      onClick={() => setActiveDropdown(null)}
                      className="mt-5 flex items-center justify-center gap-2 bg-[var(--brand-secondary)] hover:bg-orange-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Get in Touch <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* ── Products mega panel — big showcase cards ───────────────── */}
      {navItems.map((link) => {
        if (!isProductMega(link)) return null
        const isOpen = activeDropdown === link.href
        return (
          <div
            key={link.href}
            className={cn(
              'hidden lg:block absolute inset-x-0 top-[70px] transition-all duration-200 origin-top',
              isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none',
            )}
          >
            <div className="bg-white border-t border-gray-100 shadow-2xl">
              <div className="mx-auto max-w-[1400px] px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Our Products</p>
                    <p className="text-sm text-gray-500 mt-0.5">Purpose-built solutions for modern enterprises</p>
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    View all products <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* 3-col grid — first 3 full cards, last 2 in a second row or side panel */}
                <div className="grid grid-cols-3 gap-5">
                  {link.items.slice(0, 3).map((product, i) => {
                    const grad = PRODUCT_GRADIENTS[i % PRODUCT_GRADIENTS.length]
                    return (
                      <Link
                        key={product.href}
                        href={product.href}
                        onClick={() => setActiveDropdown(null)}
                        className="group/prod flex flex-col rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-250 overflow-hidden"
                      >
                        {/* gradient hero */}
                        <div className={cn('relative flex items-center justify-between p-6 bg-gradient-to-br min-h-[100px]', grad.bg)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.logoUrl} alt={product.label}
                            className="h-10 w-auto object-contain brightness-0 invert"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                          />
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white group-hover/prod:bg-white/30 transition-colors flex-shrink-0">
                            <ArrowRight className="h-4 w-4 group-hover/prod:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                        {/* content */}
                        <div className="flex flex-col flex-1 p-5 bg-white">
                          <p className="text-base font-bold text-gray-900 group-hover/prod:text-blue-700 transition-colors mb-2">
                            {product.label}
                          </p>
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                          <p className={cn('mt-4 text-xs font-semibold flex items-center gap-1 transition-colors', 'text-blue-600 group-hover/prod:text-blue-800')}>
                            Learn more <ArrowRight className="h-3 w-3" />
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* remaining products as wide horizontal cards */}
                {link.items.length > 3 && (
                  <div className="grid grid-cols-2 gap-5 mt-5">
                    {link.items.slice(3).map((product, i) => {
                      const grad = PRODUCT_GRADIENTS[(i + 3) % PRODUCT_GRADIENTS.length]
                      return (
                        <Link
                          key={product.href}
                          href={product.href}
                          onClick={() => setActiveDropdown(null)}
                          className="group/prod flex items-stretch rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-250 overflow-hidden"
                        >
                          {/* left accent */}
                          <div className={cn('flex items-center justify-center w-24 flex-shrink-0 bg-gradient-to-br', grad.bg)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.logoUrl} alt={product.label}
                              className="h-8 w-auto object-contain brightness-0 invert px-2"
                              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                            />
                          </div>
                          {/* right content */}
                          <div className="flex flex-col justify-center px-5 py-4 flex-1 bg-white">
                            <p className="text-sm font-bold text-gray-900 group-hover/prod:text-blue-700 transition-colors">
                              {product.label}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed mt-1 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex items-center pr-4 bg-white">
                            <ArrowRight className="h-4 w-4 text-gray-300 group-hover/prod:text-blue-600 group-hover/prod:translate-x-0.5 transition-all" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* ── Mobile menu ───────────────────────────────────────────── */}
      <div className={cn(
        'lg:hidden border-t border-white/10 bg-[var(--brand-nav-bg)] max-h-[80vh] overflow-y-auto transition-all duration-300 overflow-hidden',
        mobileOpen ? 'max-h-[80vh] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none',
      )}>
        <div className="px-4 py-4 space-y-1">
          {(navLinks ?? NAV_LINKS).map((link) => {
            const hasSub     = isMega(link) || isProductMega(link) || hasChildren(link)
            const isExpanded = mobileSections.has(link.href)
            const active     = isActive(link.href)

            return (
              <div key={link.href}>
                {hasSub ? (
                  <button
                    onClick={() => toggleMobile(link.href)}
                    className={cn(
                      'w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                      active ? 'bg-white/10 text-[var(--brand-secondary)]' : 'text-white hover:bg-white/10',
                    )}
                  >
                    {link.label}
                    <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isExpanded && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'block rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                      link.href === '/contact'
                        ? 'bg-[var(--brand-secondary)] text-white text-center mt-2'
                        : active
                          ? 'bg-white/10 text-[var(--brand-secondary)]'
                          : 'text-white hover:bg-white/10',
                    )}
                  >
                    {link.label}
                  </Link>
                )}

                {hasSub && isExpanded && (
                  <div className="mx-2 mt-1 mb-2 rounded-xl bg-white/5 overflow-hidden">
                    {isMega(link)
                      ? link.columns.map((col) => (
                          <div key={col.href} className="border-b border-white/5 last:border-0">
                            <Link href={col.href} className="block px-4 py-2.5 text-sm font-semibold text-white/90 hover:text-[var(--brand-secondary)]">
                              {col.title}
                            </Link>
                            <div className="px-4 pb-2 space-y-1">
                              {col.items.map((item) => (
                                <Link key={item.href} href={item.href} className="block py-1 text-sm text-white/60 hover:text-white transition-colors">
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))
                      : isProductMega(link)
                        ? link.items.map((product) => (
                            <Link key={product.href} href={product.href} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={product.logoUrl} alt={product.label} className="h-6 w-auto object-contain opacity-90 brightness-0 invert" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                              <span className="text-sm font-medium text-white/80">{product.label}</span>
                            </Link>
                          ))
                        : hasChildren(link) && link.children.map((child) => (
                            <Link
                              key={child.href} href={child.href}
                              className={cn('block px-4 py-2.5 text-sm transition-colors border-b border-white/5 last:border-0',
                                pathname === child.href ? 'text-[var(--brand-secondary)] font-medium' : 'text-white/70 hover:text-white')}
                            >
                              {child.label}
                            </Link>
                          ))
                    }
                  </div>
                )}
              </div>
            )
          })}

          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 bg-[var(--brand-secondary)] hover:bg-orange-500 text-white text-sm font-bold px-4 py-3 rounded-xl mt-3 transition-colors"
          >
            Let&apos;s Talk <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Click-away overlay */}
      {activeDropdown && (
        <div className="fixed inset-0 z-30 hidden lg:block" onClick={() => setActiveDropdown(null)} />
      )}
    </header>
  )
}
