'use client';

import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import Image from 'next/image';
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
  handleComplete: () => void;
  isStepValid: boolean[];
  isCurrentStepValid: boolean;
}

const defaultStepperContext: StepperContextType = {
  currentStep: 0,
  totalSteps: 0,
  handleComplete: () => {},
  isStepValid: [],
  isCurrentStepValid: false
};

const StepperContext = createContext<StepperContextType>(defaultStepperContext);

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
  <div className="flex gap-10 mx-auto align-center justify-center items-center">
    {steps.map((step, index) => (
      <div key={step.label} className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <Image className={`w-10 h-10 transition-all duration-300 ease-in-out ${index <= currentStep ? 'saturate-100' : 'saturate-0'}`} src={`/assets/step${index + 1}.svg`} alt={step.label} width={40} height={40} />
          {/* <div className="mt-2 text-sm font-medium text-slate-600">{step.label}</div> */}
        </div>
      </div>
    ))}
  </div>
);

/*
const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <motion.div
    className="mt-4 h-2 rounded-full bg-red-500"
    initial={{ width: '0%' }}
    animate={{ width: `${Math.min((currentStep / (totalSteps - 1)) * 100 + 1, 100)}%` }}
  />
);
*/

// Updated StepContent to use context and display children
interface StepContentProps {
  children: ReactNode;
}

const StepContent: React.FC<StepContentProps> = ({ children }) => {
  return (
    <div className="motion-preset-focus motion-duration-[500ms] mb-6 mt-10 flex min-h-[30vh] w-full justify-center rounded-lg text-center dark:border-gray-600">
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
  handleComplete: () => void;
  isCurrentStepValid: boolean;
  isLoading?: boolean;
}> = ({ 
  currentStep, 
  totalSteps, 
  handlePrev, 
  handleNext, 
  handleComplete, 
  isCurrentStepValid,
  isLoading = false
}) => (
  <div className="flex flex-col items-end gap-2">
    <div className="flex justify-end gap-3">
      {currentStep === 0 ? null : (
        <Button variant="outline" onClick={handlePrev} disabled={isLoading}>
          Previous
        </Button>
      )}
      {currentStep === totalSteps - 1 ? null : (
        <Button onClick={handleNext} disabled={!isCurrentStepValid || isLoading}>
          {isLoading ? 'Processing...' : 'Next'}
        </Button>
      )}
      {currentStep === totalSteps - 1 ? (
        <Button
          variant="default"
          className="motion-scale-loop-[104%] motion-duration-2500 motion-ease-in-out bg-red-500"
          onClick={handleComplete}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Complete'}
        </Button>
      ) : null}
    </div>
   
   {/* HELPER TEXT - NOT BEING USED

    {!isCurrentStepValid && !isLoading && (
      <p className="text-sm text-red-500">
        {currentStep === 0
          ? "Please select a language"
          : currentStep === 1
          ? "Please select a reading level"
          : currentStep === 2
          ? "Please take a photo of the toy"
          : "Please wait for the toy data to be processed"}
      </p>
    )}
    {isLoading && (
      <p className="text-sm text-blue-500">
        Processing your data...
      </p>
    )}*/}
  </div>
);

// Updated Stepper component to accept steps as a prop and provide context
interface StepperProps {
  steps: StepProps[];
  children: ReactNode;
  handleComplete: () => void;
  isStepValid?: boolean[];
  isLoading?: boolean[];
}

const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  children, 
  handleComplete, 
  isStepValid = [],
  isLoading = []
}) => {
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

  // Check if the current step is valid
  const isCurrentStepValid = isStepValid[currentStep] !== undefined ? isStepValid[currentStep] : true;
  
  // Check if the current step is loading
  const isCurrentStepLoading = isLoading[currentStep] || false;

  return (
    <StepperContext.Provider value={{ 
      currentStep, 
      totalSteps: steps.length, 
      handleComplete,
      isStepValid,
      isCurrentStepValid
    }}>
      <div className="mx-auto w-full p-6 my-6 motion-preset-blur-right motion-duration-[500ms]">
        <StepIndicator currentStep={currentStep} steps={steps} />
        {/*<ProgressBar currentStep={currentStep} totalSteps={steps.length} />*/}
        {currentStepContent}
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleComplete={handleComplete}
          isCurrentStepValid={isCurrentStepValid}
          isLoading={isCurrentStepLoading}
        />
      </div>
    </StepperContext.Provider>
  );
};

export { Stepper, StepContent };
export default Stepper;
