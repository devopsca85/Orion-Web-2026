import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, Briefcase, Users, DollarSign, CheckCircle2, ChevronLeft } from 'lucide-react';
import { PageHero } from '@/components/sections/Hero';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { JobApplicationForm } from '@/components/sections/JobApplicationForm';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const opening = await prisma.jobOpening.findUnique({ where: { id }, select: { title: true, department: true } });
    if (!opening) return {};
    return { title: `${opening.title} — Careers at Orion eSolutions` };
  } catch {
    return {};
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  let opening: {
    id: string; title: string; department: string; location: string;
    type: string; level: string; salary: string | null;
    description: string; requirements: unknown;
  } | null = null;

  try {
    opening = await prisma.jobOpening.findUnique({
      where: { id, active: true },
      select: { id: true, title: true, department: true, location: true, type: true, level: true, salary: true, description: true, requirements: true },
    });
  } catch { /* DB not migrated */ }

  if (!opening) notFound();

  const requirements = Array.isArray(opening.requirements) ? (opening.requirements as string[]) : [];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Careers', url: `${SITE_CONFIG.url}/careers` },
          { name: opening.title, url: `${SITE_CONFIG.url}/careers/${opening.id}` },
        ]}
      />

      <PageHero
        title={opening.title}
        description={`${opening.department} · ${opening.location}`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Careers', href: '/careers' }, { label: opening.title }]}
      />

      <Section className="bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{opening.department}</Badge>
                <Badge variant="default">{opening.type}</Badge>
                <Badge variant="default">{opening.level}</Badge>
              </div>

              {/* Quick facts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: MapPin, label: 'Location', value: opening.location },
                  { icon: Briefcase, label: 'Type', value: opening.type },
                  { icon: Users, label: 'Level', value: opening.level },
                  { icon: DollarSign, label: 'Salary', value: opening.salary || 'Competitive' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                      <Icon size={14} />
                      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {opening.description && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">About the Role</h2>
                  <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-wrap">{opening.description}</div>
                </div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Requirements</h2>
                  <ul className="space-y-2">
                    {requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                        <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link href="/careers" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors">
                <ChevronLeft size={15} /> Back to all openings
              </Link>
            </div>

            {/* Application form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <JobApplicationForm role={opening.title} jobId={opening.id} />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
