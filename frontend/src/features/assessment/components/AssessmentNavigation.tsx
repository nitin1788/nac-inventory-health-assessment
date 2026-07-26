import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/Button';

interface AssessmentNavigationProps {
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function AssessmentNavigation({
  isFirst,
  isLast,
  canProceed,
  onBack,
  onNext,
}: AssessmentNavigationProps) {
  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <Button type="button" variant="ghost" onClick={onBack} disabled={isFirst}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Button type="button" variant="primary" onClick={onNext} disabled={!canProceed}>
        {isLast ? 'Finish' : 'Next'}
        {isLast ? <CheckCircle2 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  );
}
