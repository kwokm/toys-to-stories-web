import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

// Define loading variants using cva
const loadingVariants = cva(
  "flex items-center justify-center", 
  {
    variants: {
      size: {
        sm: "min-h-[20vh]",
        md: "min-h-[30vh]",
        lg: "min-h-[50vh]",
        xl: "min-h-[70vh]",
        full: "min-h-screen",
      },
      variant: {
        default: "text-slate-900",
        primary: "text-orange-500",
        secondary: "text-blue-500",
      },
      animation: {
        fade: "motion-opacity-out-0 motion-ease-out motion-duration-1000",
        scale: "motion-scale-out-0 motion-ease-out motion-duration-1000",
        both: "motion-opacity-out-0 motion-scale-out-0 motion-ease-out motion-duration-1000",
      }
    },
    defaultVariants: {
      size: "lg",
      variant: "primary",
      animation: "fade",
    }
  }
);

export interface LoadingProps extends VariantProps<typeof loadingVariants> {
  message?: string;
  className?: string;
  showSpinner?: boolean;
}

export function Loading({ 
  message = "Loading...", 
  size, 
  variant, 
  animation,
  className = "",
  showSpinner = true,
}: LoadingProps) {
  return (
    <div className={loadingVariants({ size, variant, animation, className })}>
      <div className="text-center">
        {showSpinner && (
          <Loader2 className={`mx-auto mb-4 h-8 w-8 animate-spin ${variant === 'primary' ? 'text-orange-500' : variant === 'secondary' ? 'text-blue-500' : 'text-slate-900'}`} />
        )}
        <motion.p 
          className="text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}

// Export a simpler version for inline loading indicators
export function LoadingSpinner({ 
  size = "sm", 
  className = "" 
}: { 
  size?: "sm" | "md" | "lg"; 
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
} 