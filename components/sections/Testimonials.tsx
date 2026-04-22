import { Container, Section, SectionHeader } from '@/components/ui/Container'
import { HorizontalCarousel } from '@/components/ui/HorizontalCarousel'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'

const fallback = [
  { id: '1', quote: "Orion eSolutions transformed our entire technology infrastructure in under 18 months. They didn't just deliver code — they became strategic partners who understood our business goals.", name: 'Sarah Mitchell', title: 'CTO', company: 'Regional Banking Group', rating: 5 },
  { id: '2', quote: "The cloud migration was seamless. Zero downtime, on budget, and the new infrastructure handles our peak season traffic without breaking a sweat.", name: 'James Okonkwo', title: 'VP of Engineering', company: 'National Retail Brand', rating: 5 },
  { id: '3', quote: "Their cybersecurity team identified vulnerabilities our previous provider had missed for years. The remediation was thorough and left us with a much stronger security posture.", name: 'Dr. Linda Hu', title: 'CISO', company: 'Healthcare Network', rating: 5 },
  { id: '4', quote: "Did you ever try to do 'the impossible' within a time frame of just one week? We got a recommendation from a colleague to call the guys at Orion eSolutions. Now we have our system up and running exactly according to our specifications.", name: 'Peter Fauland', title: null, company: null, rating: 5 },
  { id: '5', quote: "Amazing job. Very honest, trustworthy and best of all — great at what they do. Hire this team right now, you'll be happy you did. DevOps and Cloud Support.", name: 'Mark', title: null, company: null, rating: 5 },
  { id: '6', quote: "Orion eSolutions worked with us on a very big deliverable. Throughout the process they communicated regularly and are very knowledgeable about the subject area. DevOps and Cloud Support.", name: 'Tellarc', title: null, company: null, rating: 5 },
]

async function getTestimonials() {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, name: true, title: true, company: true, quote: true, rating: true },
    })
    return rows.length > 0 ? rows : fallback
  } catch {
    return fallback
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={cn('h-4 w-4', i < rating ? 'text-secondary fill-current' : 'text-gray-200 fill-current')} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: typeof fallback[0] }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-7">
      <div className="text-secondary/25 mb-4">
        <svg className="h-8 w-8 fill-current" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/></svg>
      </div>
      <Stars rating={t.rating} />
      <blockquote className="flex-1 mt-4 text-sm leading-relaxed text-gray-700 italic">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {t.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
          <p className="text-xs text-gray-500">{[t.title, t.company].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
    </div>
  )
}

export async function Testimonials() {
  const testimonials = await getTestimonials()

  return (
    <Section className="bg-gray-50">
      <Container>
        <SectionHeader
          eyebrow="Client Stories"
          title="Trusted by Industry Leaders"
          description="Don't take our word for it — hear directly from the executives and teams who have partnered with Orion eSolutions."
        />
        <div className="px-8">
          <HorizontalCarousel autoPlayMs={5000}>
            {testimonials.map(t => <TestimonialCard key={t.id} t={t} />)}
          </HorizontalCarousel>
        </div>
      </Container>
    </Section>
  )
}
