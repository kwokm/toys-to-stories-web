import React from 'react';

interface FlagCascadeProps {
  children: React.ReactNode;
  className?: string;
}

export const FlagCascade: React.FC<FlagCascadeProps> = ({ children, className = '' }) => {
  // Convert children to array to handle them individually
  const childrenArray = React.Children.toArray(children);
  const isTwoChildren = childrenArray.length === 2;

  return (
    <div className={`relative inline-block ${className}`}>
      {childrenArray.map((child, index) => {
        return (
          <div
            key={index}
            className="absolute scale-100 sm:scale-100 scale-[0.625] origin-top-left"
            style={{
              top: `${index * (isTwoChildren ? 18 : 12) - 6}px`,
              left: `${index * 6}px`,
              width: `${isTwoChildren ? 56 : 48}px`,
              height: `${isTwoChildren ? 56 : 48}px`,
              zIndex: childrenArray.length,
            }}
          >
            {child}
          </div>
        );
      })}
      {/* This empty div ensures the container has the right size */}
      <div className="sm:w-16 sm:h-16 w-10 h-10" />
    </div>
  );
};

export default FlagCascade;
