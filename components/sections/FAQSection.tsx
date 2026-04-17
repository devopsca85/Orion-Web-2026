'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container, Section, SectionHeader } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {faqs.map((faq) => (
        <div key={faq.id}>
          <button
            onClick={() => setOpen(open === faq.id ? null : faq.id)}
            className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
            aria-expanded={open === faq.id}
          >
            <span className="text-base font-semibold text-gray-900 pr-4">{faq.question}</span>
            <ChevronDown
              className={cn(
                'h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200',
                open === faq.id && 'rotate-180'
              )}
            />
          </button>
          {open === faq.id && (
            <div className="px-6 pb-5 text-sm leading-relaxed text-gray-600 border-t border-gray-100 pt-4">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function FAQSection({ faqs }: FAQSectionProps) {
  if (faqs.length === 0) return null;

  const categories = [...new Set(faqs.map((f) => f.category).filter(Boolean))] as string[];
  const hasCategories = categories.length > 1;

  return (
    <Section className="bg-gray-50">
      <Container>
        <SectionHeader
          eyebrow="Got Questions?"
          title="Frequently Asked Questions"
          description="Everything you need to know about working with Orion eSolutions."
        />

        {hasCategories ? (
          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">{cat}</h3>
                <FAQAccordion faqs={faqs.filter((f) => f.category === cat)} />
              </div>
            ))}
            {faqs.filter((f) => !f.category).length > 0 && (
              <FAQAccordion faqs={faqs.filter((f) => !f.category)} />
            )}
          </div>
        ) : (
          <FAQAccordion faqs={faqs} />
        )}
      </Container>
    </Section>
  );
}
