import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import { FormField } from '@/shared/components/FormField';
import { ROUTES } from '@/config/constants';
import { companyInfoSchema, type CompanyInfoFormValues } from '../assessment.schema';
import { COMPANY_SIZE_OPTIONS, INDUSTRY_OPTIONS } from '../assessment.data';

/**
 * Captures company info before the 52-question flow (PRD Section 4 —
 * a partial drop-off still yields a contactable lead). Purely
 * client-side for now: no submission endpoint exists yet, so
 * "Begin Assessment" just carries the validated values forward via
 * router state and moves to the (still placeholder) questions page.
 */
export function CompanyInfoForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      industry: '',
      companySize: '',
    },
  });

  const onSubmit = (values: CompanyInfoFormValues) => {
    navigate(ROUTES.assessmentQuestions, { state: values });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      onSubmit={handleSubmit(onSubmit)}
      className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Company Name" htmlFor="companyName" error={errors.companyName?.message}>
          <Input
            id="companyName"
            placeholder="Acme Manufacturing Pvt. Ltd."
            hasError={!!errors.companyName}
            {...register('companyName')}
          />
        </FormField>

        <FormField label="Your Full Name" htmlFor="contactName" error={errors.contactName?.message}>
          <Input
            id="contactName"
            placeholder="Jane Doe"
            hasError={!!errors.contactName}
            {...register('contactName')}
          />
        </FormField>

        <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="jane@company.com"
            hasError={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField label="Phone Number (optional)" htmlFor="phone" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            hasError={!!errors.phone}
            {...register('phone')}
          />
        </FormField>

        <FormField label="Industry" htmlFor="industry" error={errors.industry?.message}>
          <Select id="industry" hasError={!!errors.industry} defaultValue="" {...register('industry')}>
            <option value="" disabled>
              Select your industry
            </option>
            {INDUSTRY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Company Size" htmlFor="companySize" error={errors.companySize?.message}>
          <Select
            id="companySize"
            hasError={!!errors.companySize}
            defaultValue=""
            {...register('companySize')}
          >
            <option value="" disabled>
              Select company size
            </option>
            {COMPANY_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <Button type="submit" variant="primary" size="lg" className="mt-8 w-full" disabled={isSubmitting}>
        Begin Assessment
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-brand" />
        Your information is 100% confidential and used only to prepare your report.
      </p>
    </motion.form>
  );
}
