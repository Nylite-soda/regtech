// components/dashboard/SectionWrapper.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Utility for classNames concatenation

interface SectionWrapperProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

interface SectionWrapperProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  actionButton?: ReactNode;
  variant?: 'default' | 'danger' | 'warning';
}

export const SectionWrapper = ({
  icon,
  title,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
  actionButton,
  variant = 'default'
}: SectionWrapperProps) => {
  const variantStyles = {
    default: 'border-[#AD0000]',
    danger: 'border-red-600',
    warning: 'border-yellow-500'
  };

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm p-6 border-l-4',
      variantStyles[variant],
      className
    )}>
      <div className={cn(
        'flex items-center justify-between mb-4 pb-4 border-b border-gray-200',
        headerClassName
      )}>
        <div className="flex items-center">
          <div className={cn(
            'mr-3',
            variant === 'danger' ? 'text-red-600' :
            variant === 'warning' ? 'text-yellow-500' : 'text-[#AD0000]'
          )}>
            {icon}
          </div>
          <h2 className="text-xl font-semibold">
            {title}
          </h2>
        </div>
        {actionButton}
      </div>

      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
};