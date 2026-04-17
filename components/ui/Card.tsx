import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingMap = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white shadow-soft',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardIconProps {
  icon: React.ReactNode;
  className?: string;
}

export function CardIcon({ icon, className }: CardIconProps) {
  return (
    <div
      className={cn(
        'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary',
        className
      )}
    >
      {icon}
    </div>
  );
}
