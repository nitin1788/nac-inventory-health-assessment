const WHATSAPP_NUMBER = '918779295873';

/**
 * Builds a wa.me deep link with the prefilled consultation-booking
 * message. assessmentNumber is optional — when unavailable (e.g. the
 * pre-assessment landing page CTAs, or a PDF downloaded before the
 * assessment number has come back from the server), only that value
 * is omitted; the rest of the message is unchanged.
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
