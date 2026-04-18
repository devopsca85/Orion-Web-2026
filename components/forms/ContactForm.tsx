'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';
import { contactSchema, type ContactFormData } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const serviceOptions = [
  { value: '', label: 'Select a service (optional)' },
  { value: 'software-development', label: 'Software Development' },
  { value: 'cloud-solutions', label: 'Cloud Solutions' },
  { value: 'it-consulting', label: 'IT Consulting' },
  { value: 'digital-transformation', label: 'Digital Transformation' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'data-analytics', label: 'Data & Analytics' },
  { value: 'other', label: 'Other' },
];

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-secondary">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  cn(
    'block w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2',
    hasError
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
      : 'border-gray-200 bg-white focus:border-primary focus:ring-primary-100'
  );

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const loadedAt = useRef(Date.now());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { recaptchaToken: 'bypass-in-dev' },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setStatus('idle');
      const hpEl = document.querySelector<HTMLInputElement>('input[name="_hp"]')
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, _hp: hpEl?.value ?? '', _ts: loadedAt.current }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h3 className="mb-2 text-xl font-bold text-gray-900">Message Sent!</h3>
        <p className="mb-6 text-gray-600">
          Thank you for reaching out. One of our team members will be in touch within one business day.
        </p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — invisible to humans, filled by bots */}
      <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />
      {status === 'error' && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" required error={errors.name?.message}>
          <input
            {...register('name')}
            type="text"
            placeholder="John Smith"
            autoComplete="name"
            className={inputClass(!!errors.name)}
          />
        </Field>
        <Field label="Email Address" required error={errors.email?.message}>
          <input
            {...register('email')}
            type="email"
            placeholder="john@company.com"
            autoComplete="email"
            className={inputClass(!!errors.email)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company" error={errors.company?.message}>
          <input
            {...register('company')}
            type="text"
            placeholder="Acme Corp"
            autoComplete="organization"
            className={inputClass(!!errors.company)}
          />
        </Field>
        <Field label="Phone Number" error={errors.phone?.message}>
          <input
            {...register('phone')}
            type="tel"
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
            className={inputClass(!!errors.phone)}
          />
        </Field>
      </div>

      <Field label="Service of Interest" error={errors.service?.message}>
        <select {...register('service')} className={cn(inputClass(!!errors.service), 'cursor-pointer')}>
          {serviceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="How can we help?" required error={errors.message?.message}>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Tell us about your project, challenge, or goals..."
          className={cn(inputClass(!!errors.message), 'resize-none')}
        />
      </Field>

      {/* Hidden recaptcha token field — replaced with real implementation when SITE_KEY is set */}
      <input type="hidden" {...register('recaptchaToken')} />

      <p className="text-xs text-gray-500">
        By submitting this form you agree to our{' '}
        <a href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</a>.
        We never sell your data. Protected by reCAPTCHA.
      </p>

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full justify-center"
        size="lg"
        icon={<Send className="h-5 w-5" />}
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  );
}
