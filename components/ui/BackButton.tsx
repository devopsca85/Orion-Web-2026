'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function BackButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.history.back()}
      icon={<ArrowLeft className="h-4 w-4" />}
      iconPosition="left"
    >
      Go back
    </Button>
  );
}
