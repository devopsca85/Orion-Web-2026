'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { Container } from '@/components/ui/Container';

interface BrandingData {
  logoUrl: string
  logoAlt: string
  phone: string
  companyName: string
}

interface HeaderProps {
  branding?: BrandingData
}

export function Header({ branding }: HeaderProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const logoSrc = branding?.logoUrl || '/assets/images/logo.png';
  const logoAlt = branding?.logoAlt || 'Orion eSolutions';
  const phone = branding?.phone || SITE_CONFIG.phone;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <Container>
        <nav className="flex h-16 items-center justify-between md:h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0" aria-label="Orion eSolutions Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt={logoAlt}
              width={160}
              height={44}
              className="h-10 w-auto"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="text-xl font-bold text-primary hidden" id="logo-fallback">
              Orion <span className="text-secondary">eSolutions</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div ref={dropdownRef} className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const isContact = link.href === '/contact';
              const active    = isActive(link.href);
              const baseCls   = isContact
                ? 'text-primary font-semibold hover:text-primary-700'
                : active
                  ? 'text-primary font-semibold'
                  : 'text-gray-800 font-semibold hover:text-primary';

              return (
                <div key={link.href} className="relative">
                  {'children' in link ? (
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === link.href ? null : link.href)
                      }
                      className={cn(
                        'flex items-center gap-0.5 rounded-lg px-3 py-2 text-sm transition-colors',
                        baseCls
                      )}
                      aria-expanded={activeDropdown === link.href}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform ml-0.5',
                          activeDropdown === link.href && 'rotate-180'
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        'rounded-lg px-3 py-2 text-sm transition-colors block',
                        baseCls
                      )}
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {'children' in link && activeDropdown === link.href && (
                    <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl border border-gray-100 bg-white py-2 shadow-xl ring-1 ring-black/5">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'block px-4 py-2.5 text-sm transition-colors hover:bg-primary-50 hover:text-primary',
                            pathname === child.href
                              ? 'bg-primary-50 text-primary font-medium'
                              : 'text-gray-700'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Phone CTA */}
          <div className="hidden items-center gap-4 lg:flex">
            {phone && phone !== '+1 (800) 000-0000' && (
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            )}
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
      </Container>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg lg:hidden">
          <Container>
            <div className="py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors',
                      link.href === '/contact'
                        ? 'text-primary'
                        : isActive(link.href)
                          ? 'bg-primary-50 text-primary'
                          : 'text-gray-800 hover:bg-gray-50 hover:text-primary'
                    )}
                  >
                    {link.label}
                  </Link>
                  {'children' in link && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'block rounded-lg px-3 py-2 text-sm transition-colors',
                            pathname === child.href
                              ? 'text-primary font-medium'
                              : 'text-gray-500 hover:text-primary'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
