import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Container';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = genMeta({
  title: 'Terms of Service',
  description: 'Orion Solutions Terms of Service — the terms and conditions governing use of our website and services.',
  path: '/terms-of-service',
  noIndex: false,
});

const lastUpdated = 'January 1, 2025';

export default function TermsPage() {
  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-12">
        <Container size="md">
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </Container>
      </div>

      <Section>
        <Container size="md">
          <div className="prose prose-gray max-w-none">
            <p className="lead text-lg text-gray-600">
              Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using the website located at {SITE_CONFIG.url} operated by {SITE_CONFIG.name} (&ldquo;Orion Solutions,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access our website or use our services.</p>

            <h2>2. Use of Website</h2>
            <p>You may use our website for lawful purposes only. You agree not to:</p>
            <ul>
              <li>Use the website in any way that violates applicable laws or regulations</li>
              <li>Transmit any unauthorized or unsolicited advertising or promotional material</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Engage in conduct that restricts or inhibits anyone&apos;s use of the website</li>
              <li>Introduce viruses, trojans, worms, or other malicious code</li>
              <li>Scrape, crawl, or extract data from the website without prior written consent</li>
            </ul>

            <h2>3. Intellectual Property</h2>
            <p>The website and its original content, features, and functionality are owned by {SITE_CONFIG.name} and are protected by intellectual property laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>

            <h2>4. Services</h2>
            <p>Any technology services provided by Orion Solutions are governed by separate service agreements, statements of work, or contracts entered into between Orion Solutions and the client. These Terms do not constitute a service agreement.</p>

            <h2>5. Disclaimer of Warranties</h2>
            <p>Our website is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranties of any kind, express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.</p>

            <h2>6. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, {SITE_CONFIG.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website or services, even if we have been advised of the possibility of such damages.</p>

            <h2>7. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of those sites and accept no responsibility for them.</p>

            <h2>8. Privacy</h2>
            <p>Your use of our website is also governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>

            <h2>9. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will notify you of material changes by updating the &ldquo;Last updated&rdquo; date. Your continued use of the website after any changes constitutes acceptance of the new Terms.</p>

            <h2>10. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes shall be subject to the exclusive jurisdiction of courts located in San Francisco County, California.</p>

            <h2>11. Contact Us</h2>
            <p>If you have questions about these Terms, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></li>
              <li><strong>Phone:</strong> {SITE_CONFIG.phone}</li>
              <li><strong>Mail:</strong> {SITE_CONFIG.address.street}, {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} {SITE_CONFIG.address.zip}</li>
            </ul>
          </div>
        </Container>
      </Section>
    </div>
  );
}
