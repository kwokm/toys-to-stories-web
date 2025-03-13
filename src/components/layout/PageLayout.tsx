'use client';

import { ReactNode } from 'react';
import { PageHeader } from './PageHeader';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  icon: ReactNode | string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
  className?: string;
  contentClassName?: string;
}

export function PageLayout({
  icon,
  title,
  description,
  actions,
  children,
  isLoading = false,
  loadingMessage = 'Loading...',
  className = '',
  contentClassName = 'px-12 pt-12',
}: PageLayoutProps) {
  // Common loading state used across multiple pages
  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] motion-opacity-out-0 items-center justify-center py-8 motion-ease-out motion-duration-1000">
        <div className="text-center">
          <p className="text-xl">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`h-full min-h-screen bg-orange-50 pb-24 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header using the PageHeader component */}
      <PageHeader
        icon={icon}
        title={title}
        description={description}
        actions={actions}
      />

      {/* Content area with customizable padding */}
      <div className={contentClassName}>
        {children}
      </div>
    </motion.div>
  );
} 