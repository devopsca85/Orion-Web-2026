import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  phone: z
    .string()
    .regex(/^[+\d\s\-().]{7,20}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  service: z.enum([
    'software-development',
    'cloud-solutions',
    'it-consulting',
    'digital-transformation',
    'cybersecurity',
    'data-analytics',
    'other',
  ], { errorMap: () => ({ message: 'Please select a service' }) }).optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification required'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
