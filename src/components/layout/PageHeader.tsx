import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface PageHeaderProps {
  icon: ReactNode | string; // Can be a React component (like Lucide icon) or an image path
  title: string;
  description: string;
  actions?: ReactNode; // For custom action buttons
  className?: string;
}

export function PageHeader({
  icon,
  title,
  description,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`flex flex-row rounded-b-2xl bg-white px-12 py-12 border-b-orange-300 border ${className}`}>
      <div className="flex flex-row gap-2">
        {/* Handle both component icons and image paths */}
        {typeof icon === 'string' ? (
          <Image 
            src={icon} 
            alt={title} 
            width={64} 
            height={64} 
            className="my-auto"
          />
        ) : (
          <div className="size-16 text-orange-400 my-auto">
            {icon}
          </div>
        )}
        
        <div className="flex gap-2 flex-col">
          <h1 className="font-bricolage text-4xl text-slate-900 not-only:font-[900]">{title}</h1>
          <p className="ml-1 text-base text-gray-600">
            {description}
          </p>
        </div>
      </div>
      
      {/* Action buttons area */}
      {actions && (
        <div className="flex flex-col gap-1 ml-auto my-auto">
          {actions}
        </div>
      )}
    </div>
  );
} 