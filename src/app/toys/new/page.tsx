'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Stepper, { StepContent } from '@/components/setup/stepper';
import { ToyData, UserData } from '@/types/types';
import { redirect, useRouter } from 'next/navigation';
import { cleanupUserData, getExistingUserData } from '@/lib/cleanup';
import { saveUserDataToLocalStorage } from '@/lib/saveData';

// Import the step components
import LanguageSelection from '@/components/setup/LanguageSelection';
import ReadingLevelSelection from '@/components/setup/ReadingLevelSelection';
import TakePicture from '@/components/setup/TakePicture';
import { BringToLife } from '@/components/setup/BringToLife';

// Define the steps for the stepper
const steps = [
  { label: 'Take a Picture' },
  { label: 'Bring Them to Life' },
];

export default function AddToy() {
  const router = useRouter();
  const [existingUserData, setExistingUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize with a new empty toy
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

  // Load existing user data on component mount
  useEffect(() => {
    const loadExistingUserData = () => {
      const existingData = getExistingUserData();
      if (existingData) {
        setExistingUserData(existingData);
        // Copy language and reading level from existing user data
        setUserData(prevData => ({
          ...prevData,
          language: existingData.language,
          readingLevel: existingData.readingLevel,
        }));
      }
      setIsLoading(false);
    };

    loadExistingUserData();
  }, []);

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center py-8">
        <div className="text-center">
          <p className="text-xl">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex bg-orange-50">
      <div className="lg:mx-24 mx-4 w-full pt-16 gap-4 flex flex-col">
        <div className="mx-auto h-20 rounded-md overflow-hidden">
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
          handleComplete={() => {
            // Pass true to indicate this is a new toy to add to existing data
            cleanupUserData(userData, setCleaning, true).then(() => {
              router.push('/toys');
            });
          }}
          isStepValid={[
            capturedImage !== null, // Step 1: Image captured
            userData.toys[0]?.name !== '' && userData.toys[0]?.title !== '', // Step 2: Toy data is set
          ]}
          isLoading={[
            isProcessing, // Step 1: Loading when uploading image
            cleaning, // Step 2: Loading when processing toy data
          ]}
        >
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
    </div>
  );
}
