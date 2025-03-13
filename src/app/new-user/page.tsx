'use client';

import { useState } from 'react';
import Image from 'next/image';
import Stepper, { StepContent } from '@/components/setup/stepper';
import { ToyData, UserData } from '@/types/types';
import { redirect } from 'next/navigation';
import { cleanupUserData } from '@/lib/cleanup';
import { saveUserDataToLocalStorage } from '@/lib/saveData';

// Import the step components
import LanguageSelection from '@/components/setup/LanguageSelection';
import ReadingLevelSelection from '@/components/setup/ReadingLevelSelection';
import TakePicture from '@/components/setup/TakePicture';
import { BringToLife } from '@/components/setup/BringToLife';

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
            cleanupUserData(userData, setCleaning).then(() => {
              redirect('/toys');
            });
          }}
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
    </div>
  );
}
