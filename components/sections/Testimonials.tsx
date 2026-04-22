import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { prisma } from '@/lib/prisma';
import { TestimonialsCarousel } from './TestimonialsCarousel';

const fallback = [
  {
    id: '1',
    quote: "Orion eSolutions transformed our entire technology infrastructure in under 18 months. They didn't just deliver code — they became strategic partners who understood our business goals.",
    name: 'Sarah Mitchell',
    title: 'CTO',
    company: 'Regional Banking Group',
    rating: 5,
  },
  {
    id: '2',
    quote: "The cloud migration was seamless. Zero downtime, on budget, and the new infrastructure handles our peak season traffic without breaking a sweat.",
    name: 'James Okonkwo',
    title: 'VP of Engineering',
    company: 'National Retail Brand',
    rating: 5,
  },
  {
    id: '3',
    quote: "Their cybersecurity team identified vulnerabilities our previous provider had missed for years. The remediation was thorough and left us with a much stronger security posture.",
    name: 'Dr. Linda Hu',
    title: 'CISO',
    company: 'Healthcare Network',
    rating: 5,
  },
  {
    id: '4',
    quote: "Did you ever try to do 'the impossible' within a time frame of just one week? We got a recommendation from a colleague to call the guys at Orion eSolutions. Now we have our system up and running exactly according to our specifications.",
    name: 'Peter Fauland',
    title: null,
    company: null,
    rating: 5,
  },
  {
    id: '5',
    quote: "Amazing job. Very honest, trustworthy and best of all — great at what they do. Hire this team right now, you'll be happy you did. DevOps and Cloud Support.",
    name: 'Mark',
    title: null,
    company: null,
    rating: 5,
  },
  {
    id: '6',
    quote: "Orion eSolutions worked with us on a very big deliverable. Throughout the process they communicated regularly and are very knowledgeable about the subject area. DevOps and Cloud Support.",
    name: 'Tellarc',
    title: null,
    company: null,
    rating: 5,
  },
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
        <div className="px-6">
          <TestimonialsCarousel items={testimonials} />
        </div>
      </Container>
    </Section>
  )
}
