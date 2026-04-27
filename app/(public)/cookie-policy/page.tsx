import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui/Container';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = genMeta({
  title: 'Cookie Policy',
  description: 'Orion eSolutions Cookie Policy — how we use cookies and similar technologies on our website.',
  path: '/cookie-policy',
});

export default function CookiePolicyPage() {
  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-12">
        <Container size="md">
          <h1 className="text-4xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: January 1, 2025</p>
        </Container>
      </div>
      <Section>
        <Container size="md">
          <div className="prose prose-gray max-w-none">
            <p className="lead text-lg text-gray-600">
              This Cookie Policy explains how {SITE_CONFIG.name} (&ldquo;Orion eSolutions,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) uses cookies and similar tracking technologies on {SITE_CONFIG.url}. It should be read alongside our <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
            <h2>What Are Cookies?</h2>
            <p>Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences, understand how you use the site, and deliver relevant content. Cookies are not malicious — they cannot access other files on your computer or install software.</p>
            <h2>Types of Cookies We Use</h2>
            <h3>Strictly Necessary Cookies</h3>
            <p>These cookies are essential for the website to function and cannot be switched off. They are typically set in response to actions you take, such as submitting a form or logging in.</p>
            <table>
              <thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr></thead>
              <tbody>
                <tr><td>__session</td><td>Session management</td><td>Session</td></tr>
                <tr><td>csrf_token</td><td>Cross-site request forgery protection</td><td>Session</td></tr>
              </tbody>
            </table>
            <h3>Analytics Cookies</h3>
            <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use Google Analytics for this purpose.</p>
            <table>
              <thead><tr><th>Cookie</th><th>Provider</th><th>Purpose</th><th>Duration</th></tr></thead>
              <tbody>
                <tr><td>_ga</td><td>Google Analytics</td><td>Distinguishes unique users</td><td>2 years</td></tr>
                <tr><td>_ga_*</td><td>Google Analytics</td><td>Persists session state</td><td>2 years</td></tr>
                <tr><td>_gid</td><td>Google Analytics</td><td>Distinguishes users</td><td>24 hours</td></tr>
              </tbody>
            </table>
            <h3>Marketing Cookies</h3>
            <p>These cookies may be set by our advertising partners to build a profile of your interests and show you relevant adverts on other sites. We currently use limited marketing tracking.</p>
            <h3>Functional Cookies</h3>
            <p>These cookies enable enhanced functionality and personalisation, such as remembering your preferences or language settings.</p>
            <h2>How to Control Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            <ul>
              <li><strong>Browser settings:</strong> Most browsers allow you to view, manage, and delete cookies. See your browser&apos;s help documentation for instructions.</li>
              <li><strong>Opt-out tools:</strong> You can opt out of Google Analytics tracking at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a>.</li>
              <li><strong>Do Not Track:</strong> Some browsers support a &ldquo;Do Not Track&rdquo; feature. We respect this signal where technically feasible.</li>
            </ul>
            <p>Please note that disabling certain cookies may affect website functionality.</p>
            <h2>Changes to This Policy</h2>
            <p>We may update this Cookie Policy periodically. We will notify you of material changes by updating the date above. Continued use of the website constitutes acceptance of any changes.</p>
            <h2>Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us at <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.</p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
