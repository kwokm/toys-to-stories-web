'use client';

import { useState } from 'react';
import Image from 'next/image';
import Stepper, { StepContent } from '@/components/setup/stepper';
import { ToyData, UserData } from '@/types/types';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { saveUserData } from '@/lib/dataService';

// Import the step components
import LanguageSelection from '@/components/setup/LanguageSelection';
import ReadingLevelSelection from '@/components/setup/ReadingLevelSelection';
import TakePicture from '@/components/setup/TakePicture';
import { BringToLife } from '@/components/setup/BringToLife';
import router from 'next/router';

// Define the steps for the stepper
const steps = [
  { label: 'Choose Language' },
  { label: 'Reading Level' },
  { label: 'Take a Picture' },
  { label: 'Bring Them to Life' },
];

export default function NewUser() {
  const [userData, setUserData] = useState<UserData>({
    language: null,
    readingLevel: null,
    toys: [
      {
        name: '',
        title: '',
        vocab: [],
        key: '',
        image: '',
      },
    ],
  });

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [animationFirst, setAnimationFirst] = useState<boolean>(true);
  const [cleaning, setCleaning] = useState<boolean>(false);

  // Function to handle completion of the setup process
  const handleComplete = async () => {
    try {
      setCleaning(true);
      
      // Prepare the soundboard with the user data
      await fetch('/api/soundboard-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData,
        }),
      });
      
      // Save the user data using our dataService
      saveUserData(userData);
      
      // Redirect to the toys page
      router.push('/toys');
    } catch (error) {
      console.error('Error during user setup:', error);
    } finally {
      setCleaning(false);
    }
  };

  return (
    <motion.div 
      className="flex min-h-screen w-screen bg-orange-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-4 flex w-full flex-col gap-4 pt-16 lg:mx-24">
        <div className="mx-auto h-20 overflow-hidden rounded-md">
          <Image
            className="h-full w-auto"
            src="/ToysToStoriesNoBG.svg"
            alt="banner"
            width={1187}
            height={176}
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
        <Stepper
          steps={steps}
          handleComplete={handleComplete}
          isStepValid={[
            userData.language !== null, // Step 1: Language selected
            userData.readingLevel !== null, // Step 2: Reading level selected
            capturedImage !== null, // Step 3: Image captured
            userData.toys[0]?.name !== '' && userData.toys[0]?.title !== '', // Step 4: Toy data is set
          ]}
          isLoading={[
            false, // Step 1: No loading state
            false, // Step 2: No loading state
            isProcessing, // Step 3: Loading when uploading image
            cleaning, // Step 4: Loading when processing toy data
          ]}
        >
          <StepContent>
            <LanguageSelection userData={userData} setUserData={setUserData} />
          </StepContent>
          <StepContent>
            <ReadingLevelSelection userData={userData} setUserData={setUserData} />
          </StepContent>
          <StepContent>
            <TakePicture
              userData={userData}
              setUserData={setUserData}
              capturedImage={capturedImage}
              setCapturedImage={setCapturedImage}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </StepContent>
          <StepContent>
            <BringToLife
              userData={userData}
              setUserData={setUserData}
              capturedImage={capturedImage}
              animationFirst={animationFirst}
              setAnimationFirst={setAnimationFirst}
            />
          </StepContent>
        </Stepper>
      </div>
    </motion.div>
  );
}
