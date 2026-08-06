import { Check } from 'lucide-react';
import type { ReportTierOption } from '@/config/constants';
import { Button } from '@/shared/components/Button';
import { clsx } from '@/shared/utils/clsx';

interface PurchaseOptionCardProps {
  tier: ReportTierOption;
  highlighted?: boolean;
  onSelect: (tier: ReportTierOption) => void;
}

/**
 * A single purchase-tier card (Report Summary / Full Professional
 * Report) on the results page. Purely presentational — the click
 * handler is the only thing wired by the parent, so this component
 * doesn't need to know anything about assessment or payment state.
 */
export function PurchaseOptionCard({ tier, highlighted = false, onSelect }: PurchaseOptionCardProps) {
  return (
    <div
      className={clsx(
        'flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm sm:p-8',
        highlighted ? 'border-brand ring-1 ring-brand' : 'border-slate-200'
      )}
    >
      {highlighted ? (
        <span className="mb-3 inline-flex w-fit items-center rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      ) : null}
      <h3 className="text-lg font-semibold text-slate-900">{tier.title}</h3>
      <p className="mt-2 text-3xl font-bold text-brand">{tier.priceDisplay}</p>
      <ul className="mt-5 flex-1 space-y-2.5 text-sm text-slate-700">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant={highlighted ? 'primary' : 'secondary'}
        className="mt-6 w-full"
        onClick={() => onSelect(tier)}
      >
        Get This Report
      </Button>
    </div>
  );
}
