import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import { Textarea } from '@/shared/components/Textarea';
import { FormField } from '@/shared/components/FormField';
import { submitLead } from '@/services/api/leadsApi';
import { ApiError } from '@/services/api/apiClient';
import {
  contactFormSchema,
  CONTACT_FORM_FIELDS,
  SERVICE_INTEREST_OPTIONS,
  type ContactFormValues,
} from './contactFormSchema';

/**
 * The Contact Us page's lead form — submits to POST /api/v1/leads, which
 * emails the enquiry to NAC via Resend (no Supabase persistence; see
 * NAC_TECHNICAL_SEO_FINAL_REPORT.md §27 for why). Purely a lead-capture
 * form: on success it shows a confirmation and resets, it doesn't
 * navigate anywhere.
 */
export function ContactForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);
    try {
      await submitLead(values);
      setSubmitted(true);
      reset();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : 'Something went wrong sending your message. Please try again, or reach out via WhatsApp/phone below.'
      );
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-accent" />
        <h2 className="text-lg font-semibold text-slate-900">Thanks — we&apos;ve got your message.</h2>
        <p className="text-sm text-slate-600">
          We typically respond within one business day. In the meantime, feel free to reach out on WhatsApp
          for a faster response.
        </p>
        <Button variant="ghost" onClick={() => setSubmitted(false)} className="mt-2">
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {CONTACT_FORM_FIELDS.map((field) => {
          const fieldError = errors[field.name]?.message;

          return (
            <FormField key={field.name} label={field.label} htmlFor={field.name} error={fieldError}>
              {field.type === 'select' ? (
                <Select id={field.name} hasError={!!fieldError} defaultValue="" {...register(field.name)}>
                  <option value="" disabled>
                    Select {field.label.toLowerCase()}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  hasError={!!fieldError}
                  {...register(field.name)}
                />
              )}
            </FormField>
          );
        })}

        <FormField label="I'm Interested In" htmlFor="serviceInterest" error={errors.serviceInterest?.message}>
          <Select id="serviceInterest" hasError={!!errors.serviceInterest} defaultValue="" {...register('serviceInterest')}>
            <option value="" disabled>
              Select a service
            </option>
            {SERVICE_INTEREST_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="mt-5">
        <FormField label="Message (optional)" htmlFor="message" error={errors.message?.message}>
          <Textarea
            id="message"
            rows={4}
            placeholder="Tell us a bit about what you need help with..."
            hasError={!!errors.message}
            {...register('message')}
          />
        </FormField>
      </div>

      {submitError ? <p className="mt-4 text-sm text-red-600">{submitError}</p> : null}

      <Button type="submit" variant="primary" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
