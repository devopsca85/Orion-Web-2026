import type { Metadata } from 'next';
import { CheckCircle, Shield } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { CTA } from '@/components/sections/CTA';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { generateMetadata as genMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = genMeta({
  title: 'Certifications & Compliance',
  description: 'Orion Solutions holds ISO 27001, SOC 2 Type II, ISO 9001, and CMMI Level 3 certifications. Learn how our compliance posture protects your data and ensures delivery quality.',
  path: '/about/certifications',
});

const certs = [
  {
    name: 'ISO 27001:2022',
    body: 'BSI Group',
    since: '2019',
    scope: 'Information security management across all service delivery and client data handling',
    description: 'ISO 27001 is the international standard for information security management systems (ISMS). Our certification covers all aspects of how we handle client information — from access control and encryption to incident response and business continuity.',
    benefits: ['Client data protected by internationally recognized controls', 'Regular third-party audits and penetration testing', 'Incident response procedures tested annually', 'All staff trained on information security annually'],
  },
  {
    name: 'SOC 2 Type II',
    body: 'AICPA-accredited CPA firm',
    since: '2020',
    scope: 'Security, Availability, and Confidentiality Trust Services Criteria',
    description: 'SOC 2 Type II is the gold standard for technology service providers handling sensitive data. Unlike Type I (a point-in-time assessment), Type II evaluates the effectiveness of our controls over a 12-month period, providing strong assurance of operational security.',
    benefits: ['12-month audit period — not just a snapshot', 'Covers security, availability, and confidentiality', 'Available to enterprise clients under NDA', 'Reviewed annually by independent auditors'],
  },
  {
    name: 'ISO 9001:2015',
    body: 'BSI Group',
    since: '2018',
    scope: 'Quality management across project delivery, consulting, and managed services',
    description: 'ISO 9001 certifies our quality management system — the processes and controls that ensure we consistently deliver services to client requirements. It underpins our delivery methodology, change management processes, and continuous improvement culture.',
    benefits: ['Documented and audited delivery processes', 'Continuous improvement mechanisms built in', 'Customer feedback formally tracked and acted upon', 'Non-conformance tracking and root cause analysis'],
  },
  {
    name: 'CMMI Level 3',
    body: 'CMMI Institute',
    since: '2021',
    scope: 'Software development and IT services delivery capability',
    description: 'CMMI Level 3 (Defined) confirms that our software engineering and delivery processes are well-characterized, understood, and described in standards, procedures, and tools. It means our quality and performance are consistent — not dependent on individual heroics.',
    benefits: ['Standardized, repeatable delivery processes', 'Quantitative performance management', 'Risk management formally integrated into delivery', 'Recognized by US Federal Government procurement'],
  },
];

export default function CertificationsPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'About', url: `${SITE_CONFIG.url}/about` },
        { name: 'Certifications', url: `${SITE_CONFIG.url}/about/certifications` },
      ]} />

      <PageHero
        title="Certifications & Compliance"
        description="Our certifications are not just credentials — they represent the processes and controls that protect your data and ensure delivery quality."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Certifications' }]}
      />

      <Section className="bg-white">
        <Container>
          <div className="mb-12 grid grid-cols-2 gap-6 rounded-2xl bg-primary p-8 text-white md:grid-cols-4">
            {certs.map((c) => (
              <div key={c.name} className="text-center">
                <Shield className="mx-auto mb-2 h-8 w-8 text-secondary" />
                <p className="font-bold text-white">{c.name}</p>
                <p className="text-xs text-white/60">Since {c.since}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {certs.map((cert) => (
              <Card key={cert.name} padding="lg">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <div className="mb-2 flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">{cert.name}</h2>
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Active</span>
                    </div>
                    <p className="mb-1 text-sm text-gray-400">Issued by {cert.body} · Held since {cert.since}</p>
                    <p className="mb-4 text-sm font-medium text-gray-500 italic">Scope: {cert.scope}</p>
                    <p className="leading-relaxed text-gray-600">{cert.description}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="mb-3 text-sm font-bold text-gray-900">What This Means for You</p>
                    <ul className="space-y-2.5">
                      {cert.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-secondary mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Need Compliance Documentation?"
        description="Enterprise clients can request SOC 2 reports and certification documents under NDA. Contact us to arrange access."
        primaryCta={{ label: 'Request Documentation', href: '/contact' }}
        variant="light"
      />
    </>
  );
}
