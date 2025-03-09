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
            className="absolute"
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
      <div
        style={{
          width: `${64}px`,
          height: `${64}px`,
        }}
      />
    </div>
  );
};

export default FlagCascade;
