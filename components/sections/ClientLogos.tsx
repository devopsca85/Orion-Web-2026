import { prisma } from '@/lib/prisma';

const fallback = [
  { id: '1', name: 'Microsoft', logoUrl: 'https://cdn.simpleicons.org/microsoft/gray', href: null },
  { id: '2', name: 'AWS', logoUrl: 'https://cdn.simpleicons.org/amazonaws/gray', href: null },
  { id: '3', name: 'Google Cloud', logoUrl: 'https://cdn.simpleicons.org/googlecloud/gray', href: null },
  { id: '4', name: 'Salesforce', logoUrl: 'https://cdn.simpleicons.org/salesforce/gray', href: null },
  { id: '5', name: 'SAP', logoUrl: 'https://cdn.simpleicons.org/sap/gray', href: null },
  { id: '6', name: 'Oracle', logoUrl: 'https://cdn.simpleicons.org/oracle/gray', href: null },
];

async function getLogos() {
  try {
    const rows = await prisma.clientLogo.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }],
      select: { id: true, name: true, logoUrl: true, href: true },
    });
    return rows.length > 0 ? rows : fallback;
  } catch {
    return fallback;
  }
}

export async function ClientLogos() {
  const logos = await getLogos();

  return (
    <section className="border-y border-gray-100 bg-white py-10">
      <div className="mb-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-gray-400">
          Trusted by industry leaders worldwide
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-ticker gap-16 w-max">
          {/* Duplicate for seamless loop */}
          {[...logos, ...logos].map((logo, i) => (
            <div key={`${logo.id}-${i}`} className="flex items-center justify-center w-32 shrink-0">
              {logo.href ? (
                <a href={logo.href} target="_blank" rel="noopener noreferrer" title={logo.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="h-8 w-auto max-w-[120px] object-contain opacity-50 grayscale hover:opacity-80 hover:grayscale-0 transition-all"
                  />
                </a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="h-8 w-auto max-w-[120px] object-contain opacity-50 grayscale"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
