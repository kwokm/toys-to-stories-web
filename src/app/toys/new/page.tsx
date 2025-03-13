'use client';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect, useRef, useCallback } from 'react';
import Stepper, { StepContent } from '@/components/stepper';
import { LanguageCard, OtherLanguageSelector, ReadingLevelCard } from '@/components/setup-cards';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { CameraIcon, Pencil, SwitchCameraIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ToyData, UserData, VocabData } from '@/types/types';
import { TypewriterEffectSmooth } from '@/components/typewriter';
import { redirect } from 'next/navigation';
import { saveUserDataToLocalStorage } from '@/lib/saveData';

import { processBMP } from '@/lib/utilityFunctions';
import router from 'next/router';

const steps = [{ label: 'Take a Picture' }, { label: 'Bring Them to Life' }];

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

  const stepContent3 = (
    <div className="flex flex-col gap-4 pb-8">
      <h2 className="pb-0 text-left text-4xl font-semibold text-gray-800">
        Let's bring your child's favorite toy to life!
      </h2>
      <p className="text-left text-base text-gray-600">
        Snap a photo of your child's favorite toy, and it will become an imaginary friend in a
        personalized story! Along the way, your child will learn four new words in the chosen
        language.
      </p>
      <div className="flex w-full flex-row items-center justify-center gap-8">
        <UploadButton
          endpoint="imageUploader"
          config={{ cn: twMerge }}
          content={{
            button: ({ ready }) => {
              if (!ready)
                return (
                  <div className="flex flex-row items-center gap-2 text-sm font-medium">
                    <CameraIcon className="h-4 w-4" />
                    Loading...
                  </div>
                );
              return capturedImage ? (
                <div className="flex flex-row items-center gap-2 text-sm font-medium">
                  <SwitchCameraIcon className="h-4 w-4" />
                  Retake Photo
                </div>
              ) : (
                <div className="flex flex-row items-center gap-2 text-sm font-medium">
                  <CameraIcon className="h-4 w-4" />
                  Take a Photo
                </div>
              );
            },
          }}
          className="motion-preset-compress ut-button:bg-black ut-allowed-content:hidden ut-button:ut-readying:bg-gray-600 ut-button:ut-uploading:bg-gray-600"
          onClientUploadComplete={res => {
            setIsProcessing(true);
            setCapturedImage(
              `https://${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${res[0].key}`
            );
            let newToy: ToyData = {
              key: res[0].key,
              image: res[0].url,
            };
            setUserData(prevUserData => ({
              ...prevUserData,
              toys: [newToy],
            }));
            console.log(res[0].url);

            // Download the image to the server
            fetch('/api/download-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageUrl: res[0].url,
                fileName: res[0].name,
              }),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Image downloaded to server:', data);
                // You can store the local server path if needed
                // For example, you might want to use this path instead of the uploadthing URL
                if (data.success) {
                  // console.log('Local server path:', data.filepath);
                  const geminiIdentifyData = JSON.parse(data.geminiIdentify);
                  const geminiVocabularyData = JSON.parse(data.geminiVocabulary);
                  newToy = {
                    name: geminiIdentifyData.Name,
                    title: geminiIdentifyData.Item,
                    vocab: geminiVocabularyData.VocabData,
                    key: res[0].key,
                    image: res[0].url,
                  };

                  setUserData(prevUserData => ({
                    ...prevUserData,
                    toys: [newToy],
                  }));

                  console.log('HELLO THE DATA IS ', data);
                  console.log('current userdata is ', userData);

                  // Set processing to false after updating the state
                  setIsProcessing(false);
                }
              })
              .catch(error => {
                console.error('Error downloading image to server:', error);
                setIsProcessing(false);
              });
          }}
          onUploadError={(error: Error) => {
            console.log(error);
            setIsProcessing(false);
          }}
        />
      </div>
      <div className="mx-auto mt-3 mb-12">
        <Card className="flex w-96 rotate-2 flex-col items-center gap-3 rounded-xs">
          {capturedImage ? (
            <Image
              src={capturedImage}
              alt="Captured toy"
              width={300}
              height={300}
              className="h-75 w-75 rounded-md object-cover"
            />
          ) : (
            <div className="h-75 w-75 rounded-md border border-gray-300 bg-gray-100"></div>
          )}

          <div className="h-20" />
        </Card>
      </div>
    </div>
  );

  async function Cleanup() {
    setCleaning(true);
    console.log('DATA AT START OF CLEANUP');
    console.log(userData);

    // Make sure we have toys and vocab data before proceeding
    if (!userData.toys || userData.toys.length === 0 || !userData.toys[0].vocab) {
      console.error('No toy or vocab data available for cleanup');
      setCleaning(false);
      return Promise.resolve(null);
    }

    return fetch('/api/gemini/get-toy-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vocab: JSON.stringify(userData.toys[0].vocab || []),
        filePath: 'tmp/file_list.txt',
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const result = JSON.parse(data.toyAudio);
          console.log('RECEIVED AT CLEANUP ', result);
          let newToy: ToyData = userData.toys[0];
          newToy = {
            ...newToy,
            vocab: result,
          };
          console.log('NEW TOY IS ', newToy);
          let finalUserData = { ...userData, toys: [...userData.toys, newToy] };
          saveUserDataToLocalStorage(finalUserData);
          console.log('USER DATA ON LOCALSTORAGE ');
          console.log(localStorage.getItem('userData'));
          fetch('/api/soundboard-prep', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userData: finalUserData,
              userDataBlobUrl: userData.userDataBlobUrl,
            }),
          });
          console.log('bmp saved');
          setCleaning(false);
          // redirect('/toys');
          return result;
        }
        setCleaning(false);
        return null;
      })
      .catch(error => {
        console.log('ERROR AT COMPLETEREADY ', error);
        setCleaning(false);
        throw error; // Re-throw the error so it can be caught by the caller
      });
  }

  // Convert stepContent4 from a function to a React component
  const StepContent4 = () => {
    // Animation effect
    useEffect(() => {
      // Set a timeout to change the animation state after a set time.
      const timer = setTimeout(() => {
        setAnimationFirst(false);
      }, 5500);

      // Clean up the timeout if the component unmounts
      return () => clearTimeout(timer);
    }, []); // Empty dependency array means this runs once when the component mounts

    // Define animation classes based on the animationFirst state
    const typewriter = (
      <div className="font-weight-400 mt-4 pb-2 text-2xl leading-none text-gray-600">
        I found four vocabulary words for your child to learn.
      </div>
    );
    const titleClass = animationFirst ? 'motion-preset-blur-right-sm motion-duration-[1200ms]' : '';
    const adjustClass = animationFirst
      ? 'motion-delay-[5000ms] motion-preset-blur-up-md motion-duration-[500ms]'
      : '';
    const cardClass = animationFirst
      ? 'starting:shadow-base starting:rotate-z-2 starting:rotate-y-0 starting:rotate-x-0 delay-[1000ms] starting:opacity-0 transition-all duration-1500 motion-delay-[1200ms]'
      : '';
    const gridClass = animationFirst
      ? 'motion-delay-[1000ms] motion-preset-fade motion-duration-[2000ms]'
      : '';

    // Safely access vocab data with fallbacks for undefined values
    const currentToy = userData.toys && userData.toys.length > 0 ? userData.toys[0] : null;
    const vocabData = currentToy?.vocab || [];

    return (
      <div className="motion-preset-fade-in flex flex-col gap-4 motion-duration-[500ms]">
        <div className={`mb-4 flex flex-col gap-0 ${titleClass}`}>
          {/* Title */}
          <h1 className={`text-[80px] leading-none font-bold text-gray-800 ${titleClass}`}>
            Hello!
          </h1>
          {animationFirst ? (
            <TypewriterEffectSmooth
              className="mx-auto mt-4 mb-0"
              words={[
                {
                  text: 'I found four vocabulary words for your child to learn.',
                  className: 'leading-none text-2xl font-weight-400 text-gray-600',
                },
              ]}
            />
          ) : (
            typewriter
          )}

          <div className={`font-weight-400 text-lg text-gray-400 ${adjustClass}`}>
            Feel free to adjust the words or my name!
          </div>
        </div>
        {/* Grid */}
        <div className="mx-auto my-4 grid grid-cols-2 gap-40">
          {/* Column 1 */}
          {/* Toy Polaroid */}
          <Card
            className={`motion-translate-y-loop-10 motion-translate-x-loop-5 flex w-96 rotate-2 rotate-x-15 rotate-y-0 rotate-z-5 flex-col items-center gap-3 rounded-xs opacity-100 shadow-xl motion-ease-in-out motion-duration-2000 ${cardClass}`}
          >
            {capturedImage ? (
              <Image
                src={capturedImage}
                alt="Captured toy"
                width={300}
                height={300}
                className="h-75 w-75 rounded-md object-cover"
              />
            ) : (
              <div className="h-75 w-75 rounded-md border border-gray-300 bg-gray-100"></div>
            )}
            <div className="flex flex-col items-center gap-0">
              <Input
                className="mx-4 h-auto w-7/10 border-none text-center font-lily font-bold shadow-none placeholder:text-gray-400 md:text-4xl"
                type="text"
                placeholder={currentToy?.name || ''}
              />
              <p className="mt-[-2] text-gray-400">{currentToy?.name && 'the'}</p>
              <Input
                className="mx-4 h-auto w-7/10 border-none text-center font-medium shadow-none placeholder:text-gray-400 md:text-xl"
                type="text"
                placeholder={currentToy?.title || ''}
              />
            </div>
          </Card>
          {/* End Column 1 */}

          {/* Column 2 */}
          <div className={`my-auto flex w-full flex-col gap-4 ${gridClass}`}>
            <Button variant="outline" className="self-end">
              <Pencil></Pencil>
            </Button>
            <Input className="w-full" type="text" placeholder={vocabData[0]?.word || ''} />
            <Input className="w-full" type="text" placeholder={vocabData[1]?.word || ''} />
            <Input className="w-full" type="text" placeholder={vocabData[2]?.word || ''} />
            <Input className="w-full" type="text" placeholder={vocabData[3]?.word || ''} />
          </div>
          {/* End Column 2 */}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-screen bg-orange-50">
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
          handleComplete={() => {
            Cleanup();
            router.push('/toys');
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
          <StepContent>{stepContent3}</StepContent>
          <StepContent>
            <StepContent4 />
          </StepContent>
        </Stepper>
      </div>
    </div>
  );
}
