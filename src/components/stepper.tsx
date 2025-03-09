'use client';

import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { Button } from './ui/button';

interface FieldProps {
  name: string;
  type: string;
  placeholder: string;
}

interface StepProps {
  label: string;
  fields?: FieldProps[];
}

// Create a context for the stepper
interface StepperContextType {
  currentStep: number;
  totalSteps: number;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

// Hook to use the stepper context
const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepperContext must be used within a StepperProvider');
  }
  return context;
};

const StepIndicator: React.FC<{ currentStep: number; steps: StepProps[] }> = ({
  currentStep,
  steps,
}) => (
  <div className="flex gap-4 justify-between">
    {steps.map((step, index) => (
      <div key={step.label} className="flex flex-col items-center">
        <motion.div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            index <= currentStep ? 'bg-red-500/15 text-red-500' : 'bg-secondary'
          }`}
          initial={false}
          animate={{ scale: index === currentStep ? 1.2 : 1 }}
        >
          {index <= currentStep ? <CheckCircle size={20} /> : <Circle size={20} />}
        </motion.div>
        <div className="mt-2 text-slate-600 font-medium text-sm">{step.label}</div>
      </div>
    ))}
  </div>
);

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <motion.div
    className="mt-4 h-2 rounded-full bg-red-500"
    initial={{ width: '0%' }}
    animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
  />
);

// Updated StepContent to use context and display children
interface StepContentProps {
  children: ReactNode;
}

const StepContent: React.FC<StepContentProps> = ({ children }) => {
  return (
    <div className="my-4 flex min-h-[30vh] w-full items-center justify-center rounded-lg text-center dark:border-gray-600">
      {children}
    </div>
  );
};

const ButtonClasses = 'rounded-2xl bg-red-500 px-2 py-1 text-sm font-medium text-white';

const NavigationButtons: React.FC<{
  currentStep: number;
  totalSteps: number;
  handlePrev: () => void;
  handleNext: () => void;
}> = ({ currentStep, totalSteps, handlePrev, handleNext }) => (
  <div className="flex justify-end gap-3">
    {currentStep === 0 ? null : (
      <Button variant="outline" onClick={handlePrev}>
        Previous
      </Button>
    )}
    {currentStep === totalSteps - 1 ? null : <Button onClick={handleNext}>Next</Button>}
  </div>
);

// Updated Stepper component to accept steps as a prop and provide context
interface StepperProps {
  steps: StepProps[];
  children: ReactNode;
}

const Stepper: React.FC<StepperProps> = ({ steps, children }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const handlePrev = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Filter children to find StepContent components
  const childrenArray = React.Children.toArray(children);

  // Get the current step content based on the current step index
  const currentStepContent = childrenArray[currentStep] || null;

  return (
    <StepperContext.Provider value={{ currentStep, totalSteps: steps.length }}>
      <div className="mx-auto w-full p-6">
        <StepIndicator currentStep={currentStep} steps={steps} />
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
        {currentStepContent}
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      </div>
    </StepperContext.Provider>
  );
};

export { Stepper, StepContent };
export default Stepper;
