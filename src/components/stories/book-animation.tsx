import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Animation variants for book container
export const bookContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Animation variants for individual books
export const bookItemVariants = {
  hidden: { 
    opacity: 0, 
    x: 50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    rotateX: 4,
    rotateZ: 2,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  },
  tap: {
    scale: 0.98,
    rotateX: 8,
    rotateZ: 3,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

// Book container with animations
export const AnimatedBookContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn("w-full", className)}
      initial="hidden"
      animate="visible"
      variants={bookContainerVariants}
    >
      {children}
    </motion.div>
  );
};

// Individual book with animations
export const AnimatedBookItem = ({
  children,
  className,
  custom,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  custom?: number;
  onClick?: () => void;
}) => {
  return (
    <motion.div 
      variants={bookItemVariants} 
      custom={custom}
      whileHover="hover"
      whileTap="tap"
      className={cn(
        "relative mx-auto cursor-pointer transition-all duration-500",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}; 