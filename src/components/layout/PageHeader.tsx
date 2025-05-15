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

export function PageHeader({ icon, title, description, actions, className = '' }: PageHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-50 flex flex-row rounded-b-2xl border border-b-orange-300 bg-white px-4 py-4 md:px-12 md:py-12 ${className}`}
    >
      <div className="flex flex-row gap-2">
        {/* Handle both component icons and image paths */}
        {typeof icon === 'string' ? (
          <Image src={icon} alt={title} width={64} height={64} className="my-auto" />
        ) : (
          <div className="my-auto size-16 text-orange-400">{icon}</div>
        )}

        <div className="flex flex-col gap-2">
          <h1 className="font-bricolage text-4xl text-slate-900 not-only:font-[900]">{title}</h1>
          <p className="ml-1 text-base text-gray-600">{description}</p>
        </div>
      </div>

      {/* Action buttons area */}
      {actions && <div className="my-auto ml-auto flex flex-col gap-1">{actions}</div>}
    </div>
  );
}
