'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
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
  const logoAlt = branding?.logoAlt || 'Orion Solutions';
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
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white shadow-md backdrop-blur-sm'
          : 'bg-transparent'
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Orion Solutions Home">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={140}
              height={36}
              priority
              className={cn('h-9 w-auto transition-all', scrolled ? 'brightness-100' : 'brightness-0 invert')}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className={cn('text-xl font-bold transition-colors hidden', scrolled ? 'text-primary-900' : 'text-white')} id="logo-fallback">
              Orion <span className="text-secondary">Solutions</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div ref={dropdownRef} className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="relative">
                {'children' in link ? (
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === link.href ? null : link.href)
                    }
                    className={cn(
                      'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      scrolled
                        ? isActive(link.href)
                          ? 'text-primary'
                          : 'text-gray-700 hover:text-primary'
                        : isActive(link.href)
                        ? 'text-secondary'
                        : 'text-white/90 hover:text-white'
                    )}
                    aria-expanded={activeDropdown === link.href}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        activeDropdown === link.href && 'rotate-180'
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      scrolled
                        ? isActive(link.href)
                          ? 'text-primary'
                          : 'text-gray-700 hover:text-primary'
                        : isActive(link.href)
                        ? 'text-secondary'
                        : 'text-white/90 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                {'children' in link && activeDropdown === link.href && (
                  <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-4 py-2.5 text-sm transition-colors hover:bg-primary-50 hover:text-primary',
                          pathname === child.href ? 'bg-primary-50 text-primary font-medium' : 'text-gray-700'
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

          {/* CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium transition-colors',
                scrolled ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
              )}
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
            <Button href="/contact" size="sm" variant={scrolled ? 'primary' : 'white'}>
              Get in Touch
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'rounded-lg p-2 transition-colors lg:hidden',
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            )}
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
                      'block rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
                      isActive(link.href)
                        ? 'bg-primary-50 text-primary'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
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
              <div className="pt-4 pb-2">
                <Button href="/contact" className="w-full justify-center">
                  Get in Touch
                </Button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
