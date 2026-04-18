'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Phone, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS, SITE_CONFIG, type NavLink, type NavLinkMega, type NavLinkDropdown } from '@/lib/constants'

interface BrandingData {
  logoUrl: string
  logoAlt: string
  phone: string
  companyName: string
}

interface HeaderProps {
  branding?: BrandingData
}

function isMega(link: NavLink): link is NavLinkMega {
  return 'mega' in link && link.mega === true
}

function hasChildren(link: NavLink): link is NavLinkDropdown {
  return 'children' in link
}

export function Header({ branding }: HeaderProps = {}) {
  const [isOpen, setIsOpen]               = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen]         = useState<Set<string>>(new Set())
  const pathname                            = usePathname()
  const headerRef                           = useRef<HTMLElement>(null)

  const logoSrc = branding?.logoUrl || '/assets/images/logo.png'
  const logoAlt = branding?.logoAlt || 'Orion eSolutions'
  const phone   = branding?.phone   || SITE_CONFIG.phone

  useEffect(() => {
    setIsOpen(false)
    setActiveDropdown(null)
    setMobileOpen(new Set())
  }, [pathname])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  function toggleMobileSection(href: string) {
    setMobileOpen((prev) => {
      const next = new Set(prev)
      if (next.has(href)) { next.delete(href) } else { next.add(href) }
      return next
    })
  }

  const navItems = NAV_LINKS.filter((l) => l.label !== 'Contact Us')
  const contactLink = NAV_LINKS.find((l) => l.label === 'Contact Us')

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-100 shadow-sm">

      {/* ─── Desktop bar ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <nav className="flex h-[70px] items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 mr-4" aria-label="Orion eSolutions Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt={logoAlt}
              width={160}
              height={44}
              className="h-10 w-auto"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement
                img.style.display = 'none'
                const fb = img.nextElementSibling as HTMLElement | null
                if (fb) fb.style.display = 'flex'
              }}
            />
            <span className="text-xl font-bold text-primary hidden items-center gap-1" id="logo-fallback">
              Orion <span className="text-secondary">eSolutions</span>
            </span>
          </Link>

          {/* Desktop nav items */}
          <div className="hidden lg:flex items-center flex-1 gap-0.5">
            {navItems.map((link) => {
              const active = isActive(link.href)
              const isOpen = activeDropdown === link.href

              const baseCls = active
                ? 'text-primary font-semibold'
                : 'text-gray-700 font-semibold hover:text-primary'

              if (isMega(link) || hasChildren(link)) {
                return (
                  <div key={link.href} className="relative">
                    <button
                      onClick={() => setActiveDropdown(isOpen ? null : link.href)}
                      className={cn('flex items-center gap-0.5 rounded-lg px-3 py-2 text-sm transition-colors', baseCls)}
                      aria-expanded={isOpen}
                    >
                      {link.label}
                      <ChevronDown className={cn('h-3.5 w-3.5 ml-0.5 transition-transform', isOpen && 'rotate-180')} />
                    </button>
                  </div>
                )
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn('rounded-lg px-3 py-2 text-sm transition-colors', baseCls)}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right: phone + CTA */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {phone && phone !== '+1 (800) 000-0000' && (
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            )}
            <Link
              href="/contact"
              className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors whitespace-nowrap shadow-sm"
            >
              Let&apos;s Talk <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* ─── Dropdown panels (desktop) ───────────────────────────── */}
      {navItems.map((link) => {
        if (activeDropdown !== link.href) return null

        if (isMega(link)) {
          return (
            <div key={link.href} className="hidden lg:block absolute inset-x-0 top-full bg-white border-t border-gray-100 shadow-2xl z-40">
              <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-5 gap-8">
                  {/* 4 service columns */}
                  {link.columns.map((col) => (
                    <div key={col.href}>
                      <Link
                        href={col.href}
                        onClick={() => setActiveDropdown(null)}
                        className={cn(
                          'block text-sm font-bold mb-3 pb-2 border-b border-gray-100 transition-colors',
                          pathname.startsWith(col.href) ? 'text-primary' : 'text-gray-900 hover:text-primary'
                        )}
                      >
                        {col.title}
                      </Link>
                      <ul className="space-y-1.5">
                        {col.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className={cn(
                                'block text-sm transition-colors leading-snug',
                                pathname === item.href
                                  ? 'text-primary font-medium'
                                  : 'text-gray-600 hover:text-primary'
                              )}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* 5th column: CTA panel */}
                  <div className="bg-primary/5 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Why Orion?</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Achieve digital excellence for your business through Orion&apos;s transformative services, gaining a distinct competitive advantage.
                      </p>
                    </div>
                    <Link
                      href="/contact"
                      onClick={() => setActiveDropdown(null)}
                      className="mt-5 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Get in Touch <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        if (hasChildren(link)) {
          const cols = link.children.length > 6 ? 2 : 1
          return (
            <div
              key={link.href}
              className="hidden lg:block absolute top-full bg-white border border-gray-100 shadow-xl rounded-xl z-40 overflow-hidden"
              style={{ left: 'auto', minWidth: cols === 2 ? '400px' : '220px' }}
            >
              <div className={cn('py-2', cols === 2 && 'grid grid-cols-2 gap-x-0')}>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setActiveDropdown(null)}
                    className={cn(
                      'block px-4 py-2.5 text-sm transition-colors hover:bg-primary/5 hover:text-primary',
                      pathname === child.href ? 'text-primary font-medium bg-primary/5' : 'text-gray-700'
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          )
        }

        return null
      })}

      {/* ─── Mobile menu ─────────────────────────────────────────── */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg lg:hidden max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const hasSub = isMega(link) || hasChildren(link)
              const isExpanded = mobileOpen.has(link.href)

              return (
                <div key={link.href}>
                  {hasSub ? (
                    <button
                      onClick={() => toggleMobileSection(link.href)}
                      className={cn(
                        'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-semibold transition-colors',
                        isActive(link.href) ? 'bg-primary/5 text-primary' : 'text-gray-800 hover:bg-gray-50 hover:text-primary'
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        'block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors',
                        link.href === '/contact'
                          ? 'text-white bg-primary rounded-xl text-center mt-2'
                          : isActive(link.href)
                            ? 'bg-primary/5 text-primary'
                            : 'text-gray-800 hover:bg-gray-50 hover:text-primary'
                      )}
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Mobile sub-items */}
                  {hasSub && isExpanded && (
                    <div className="ml-4 mt-1 border-l-2 border-gray-100 pl-4 space-y-0.5">
                      {isMega(link)
                        ? link.columns.map((col) => (
                            <div key={col.href}>
                              <Link
                                href={col.href}
                                className="block py-1.5 text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
                              >
                                {col.title}
                              </Link>
                              <div className="ml-3 space-y-0.5 mb-2">
                                {col.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block py-1 text-sm text-gray-500 hover:text-primary transition-colors"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))
                        : hasChildren(link) && link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'block rounded-lg px-2 py-2 text-sm transition-colors',
                                pathname === child.href ? 'text-primary font-medium' : 'text-gray-500 hover:text-primary'
                              )}
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

            {/* Mobile Let's Talk */}
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-3 rounded-xl mt-3 transition-colors hover:bg-primary/90"
            >
              Let&apos;s Talk <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Invisible click-away overlay for desktop dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-30 hidden lg:block"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </header>
  )
}
