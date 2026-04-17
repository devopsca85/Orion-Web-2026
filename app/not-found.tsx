import Link from 'next/link';
import type { Metadata } from 'next';
import { Home } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
      <Container size="sm">
        <div className="text-center">
          <p className="text-8xl font-extrabold text-primary/20">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or deleted.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/" icon={<Home className="h-4 w-4" />} iconPosition="left">
              Go home
            </Button>
            <BackButton />
          </div>
          <div className="mt-12">
            <p className="text-sm text-gray-500">
              Looking for something specific? Try these pages:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {[
                { label: 'Services', href: '/services' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
