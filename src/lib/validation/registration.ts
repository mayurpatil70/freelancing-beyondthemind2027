import { z } from 'zod';

export const registrationSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name cannot exceed 100 characters' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase(),
  country_code: z
    .string()
    .min(1, { message: 'Country code is required' })
    .default('+91'),
  phone: z
    .string()
    .trim()
    .min(6, { message: 'Phone number must have at least 6 digits' })
    .max(20, { message: 'Phone number is too long' })
    .regex(/^[0-9\s\-()+]+$/, { message: 'Please enter a valid phone number' }),
  country: z
    .string()
    .trim()
    .min(2, { message: 'Country is required' }),
  city: z
    .string()
    .trim()
    .min(2, { message: 'City is required' }),
  programme: z
    .string()
    .min(1, { message: 'Please select a programme' })
    .default('4-Day Divine Retreat Rishikesh (Oct 6–9, 2027)'),
  language_preference: z
    .enum(['English', 'Hindi', 'English & Hindi'], {
      errorMap: () => ({ message: 'Please select a preferred language' }),
    })
    .default('English'),
  dietary_requirements: z
    .string()
    .max(300, { message: 'Dietary notes cannot exceed 300 characters' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .max(1000, { message: 'Message cannot exceed 1000 characters' })
    .optional()
    .or(z.literal('')),
  privacy_consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to our privacy policy to proceed' }),
  }),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().min(6, 'Valid phone number is required'),
  subject: z.string().trim().min(3, 'Subject is required'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

