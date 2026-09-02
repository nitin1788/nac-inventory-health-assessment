const WHATSAPP_NUMBER = '919619994347';

/**
 * Builds a wa.me deep link with the prefilled consultation-booking
 * message. Mirrors frontend/src/shared/utils/whatsapp.ts — kept in
 * sync deliberately rather than shared, per this project's convention
 * of not sharing code between the two apps (see docs/ARCHITECTURE.md).
 * assessmentNumber is optional so callers can still build a link if it
 * is ever unavailable; only that value is omitted from the message.
 */
export function buildConsultationWhatsAppUrl(assessmentNumber?: string): string {
  const message = [
    'Hi Nitin,',
    '',
    'I have completed the NAC Inventory Health Assessment.',
    '',
    'Assessment Number:',
    assessmentNumber ?? '',
    '',
    'I would like to book a 30-minute Inventory Assessment Review & Consultation.',
    '',
    'Company Name:',
    '',
    'Contact Number:',
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
