const WHATSAPP_NUMBER = '918779295873';

/**
 * Builds a wa.me deep link with a prefilled consultation-booking
 * message. When assessmentNumber is supplied (the post-payment Thank
 * You page — see features/payment/ThankYouView.tsx, untouched by the
 * Phase 1 repositioning), the message references the completed
 * assessment. Every other caller (Hero, service/industry pages, Contact
 * page, FinalCTABanner) calls this with no argument and gets a general
 * consultation-enquiry message instead.
 */
export function buildConsultationWhatsAppUrl(assessmentNumber?: string): string {
  const message = assessmentNumber
    ? [
        'Hi Nitin,',
        '',
        'I have completed the NAC Inventory Health Assessment.',
        '',
        'Assessment Number:',
        assessmentNumber,
        '',
        'I would like to book a 30-minute Inventory Assessment Review & Consultation.',
        '',
        'Company Name:',
        '',
        'Contact Number:',
      ].join('\n')
    : [
        'Hi Nitin,',
        '',
        'I would like to book a free consultation with Nitin Anand Consulting.',
        '',
        'I\'m interested in:',
        '',
        'Company Name:',
        '',
        'Contact Number:',
      ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
