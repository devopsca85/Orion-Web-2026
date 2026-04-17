import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Container';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = genMeta({
  title: 'Privacy Policy',
  description: 'Orion Solutions Privacy Policy — how we collect, use, and protect your personal information.',
  path: '/privacy-policy',
  noIndex: false,
});

const lastUpdated = 'January 1, 2025';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-12">
        <Container size="md">
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </Container>
      </div>

      <Section>
        <Container size="md">
          <div className="prose prose-gray max-w-none">
            <p className="lead text-lg text-gray-600">
              {SITE_CONFIG.name} (&ldquo;Orion Solutions,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit {SITE_CONFIG.url} or interact with our services.
            </p>

            <h2>1. Information We Collect</h2>
            <h3>Information You Provide</h3>
            <p>We collect information you voluntarily provide when you:</p>
            <ul>
              <li>Submit our contact or inquiry forms</li>
              <li>Subscribe to our newsletter</li>
              <li>Apply for a job or send us your resume</li>
              <li>Communicate with us via email or phone</li>
            </ul>
            <p>This may include your name, email address, phone number, company name, and message content.</p>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect certain information about your device and usage, including:</p>
            <ul>
              <li>IP address and approximate geographic location</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Referring URL</li>
              <li>Device type and operating system</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries and provide requested services</li>
              <li>Send you relevant updates, newsletters, and marketing communications (with your consent)</li>
              <li>Improve our website, services, and user experience</li>
              <li>Comply with legal obligations and prevent fraud</li>
              <li>Analyze website traffic and usage patterns</li>
            </ul>

            <h2>3. How We Share Your Information</h2>
            <p>We do not sell, rent, or trade your personal information. We may share your information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our website and services (e.g., email service providers, analytics tools), bound by confidentiality agreements</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our legal rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>

            <h2>4. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to enhance your experience, analyze website traffic, and improve our services. You can control cookie settings through your browser settings. Disabling certain cookies may affect website functionality.</p>

            <h2>5. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include encryption, access controls, and regular security assessments. However, no method of transmission over the Internet is 100% secure.</p>

            <h2>6. Data Retention</h2>
            <p>We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Contact form submissions are typically retained for 24 months.</p>

            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability (receive your data in a structured format)</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>To exercise these rights, contact us at <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.</p>

            <h2>8. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.</p>

            <h2>9. Children&apos;s Privacy</h2>
            <p>Our services are not directed to individuals under 16 years of age. We do not knowingly collect personal information from children.</p>

            <h2>10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of material changes by updating the &ldquo;Last updated&rdquo; date above. Continued use of our website after changes constitutes acceptance of the updated policy.</p>

            <h2>11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
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
