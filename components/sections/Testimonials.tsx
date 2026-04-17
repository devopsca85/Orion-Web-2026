import { Quote } from 'lucide-react';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';

const testimonials = [
  {
    quote:
      "Orion Solutions transformed our entire technology infrastructure in under 18 months. They didn't just deliver code — they became strategic partners who understood our business goals and helped us achieve them through technology.",
    author: 'Sarah Mitchell',
    role: 'CTO, Regional Banking Group',
    company: 'Financial Services',
    rating: 5,
  },
  {
    quote:
      "The cloud migration was seamless. Zero downtime, on budget, and the new infrastructure handles our peak season traffic without breaking a sweat. I wish we had engaged Orion Solutions sooner.",
    author: 'James Okonkwo',
    role: 'VP of Engineering',
    company: 'National Retail Brand',
    rating: 5,
  },
  {
    quote:
      "Their cybersecurity team identified vulnerabilities in our systems that our previous provider had missed for years. The remediation was thorough and they left us with a much stronger security posture.",
    author: 'Dr. Linda Hu',
    role: 'CISO',
    company: 'Healthcare Network',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <Section className="bg-gray-50">
      <Container>
        <SectionHeader
          eyebrow="Client Stories"
          title="Trusted by Industry Leaders"
          description="Don't take our word for it — hear directly from the executives and teams who have partnered with Orion Solutions."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} padding="lg" className="flex flex-col">
              <Quote className="mb-4 h-8 w-8 text-secondary/30" />
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-secondary fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 italic mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">
                  {testimonial.role} · {testimonial.company}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
