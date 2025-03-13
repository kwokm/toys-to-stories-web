import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Animation variants for individual books - with subtle 3D effects
export const bookItemVariants = {
  hidden: { 
    opacity: 0, 
    x: 40,
    y: 10,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12
    }
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      duration: 1
    }
  },
  tap: {
    scale: .98,
    rotateZ: 4,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
      duration: 1
    }
  }
};

// Individual book with animations - with subtle 3D effects
export const AnimatedBookItem = ({
  children,
  className="",
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
        "relative mx-auto cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}; 