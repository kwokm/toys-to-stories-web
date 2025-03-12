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
import { saveUserDataToFile } from '@/lib/saveData';
import { set } from 'react-hook-form';
import { processBMP } from '@/lib/utilityFunctions';


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
      }
    ],
  });


  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [animationFirst, setAnimationFirst] = useState<boolean>(true);
  const [cleaning, setCleaning] = useState<boolean>(false);

  const stepContent1 = (
    <div className="flex flex-col gap-4">
      <h2 className="pb-4 text-left text-4xl font-medium text-gray-800">
        What language would you like your child to learn?
      </h2>
      <div className="justify-center flex flex-row flex-wrap gap-4">
        <LanguageCard
          language="Spanish"
          countryCodes={['ES', 'MX']}
          selected={userData.language === 'ES'}
          onSelect={() => setUserData({ ...userData, language: 'ES' })}
        />
        <LanguageCard
          language="French"
          countryCodes={['FR']}
          selected={userData.language === 'FR'}
          onSelect={() => setUserData({ ...userData, language: 'FR' })}
        />
        <LanguageCard
          language="German"
          countryCodes={['DE']}
          selected={userData.language === 'DE'}
          onSelect={() => setUserData({ ...userData, language: 'DE' })}
        />
        <LanguageCard
          language="Japanese"
          countryCodes={['JP']}
          selected={userData.language === 'JP'}
          onSelect={() => setUserData({ ...userData, language: 'JP' })}
        />
        <LanguageCard
          language="Korean"
          countryCodes={['KR']}
          selected={userData.language === 'KR'}
          onSelect={() => setUserData({ ...userData, language: 'KR' })}
        />
        <LanguageCard
          language="Hindi"
          countryCodes={['IN']}
          selected={userData.language === 'IN'}
          onSelect={() => setUserData({ ...userData, language: 'IN' })}
        />
        <LanguageCard
          language="Chinese (Mandarin)"
          countryCodes={['CN', 'HK', 'TW']}
          selected={userData.language === 'CN'}
          onSelect={() => setUserData({ ...userData, language: 'CN' })}
        />
      </div>
      <OtherLanguageSelector
      className="mx-auto w-[300px] h-[48px]"
      onSelect={
        language => {
          console.log(language);
          setUserData({ ...userData, language: language });
        }
      } />
    </div>
  );

  const stepContent2 = (
    <div className="flex flex-col gap-4">
      <h2 className="pb-4 text-left text-4xl font-medium text-gray-800">
        What stage best describes the child's current reading level?
      </h2>
      <div className="flex flex-col gap-4">
        <ReadingLevelCard
          title="Exploring Books"
          description={
            'Looks at pictures, listens to voices, and occasionally likes to chew on books.'
          }
          ageRange="0-12 Months"
          selected={userData.readingLevel === 1}
          onSelect={() => setUserData({ ...userData, readingLevel: 1 })}
        />
        <ReadingLevelCard
          title="Recognizing Words"
          description="Points at pictures, repeats words nonstop, and loves rhymes even more than you do."
          ageRange="12-24 Months"
          selected={userData.readingLevel === 2}
          onSelect={() => setUserData({ ...userData, readingLevel: 2 })}
        />
        <ReadingLevelCard
          title="Listening to Stories"
          description='Follows simple stories, starts recognizing letters, but may still think "S" is just a cool squiggle.'
          ageRange="2-3 Years"
          selected={userData.readingLevel === 3}
          onSelect={() => setUserData({ ...userData, readingLevel: 3 })}
        />
        <ReadingLevelCard
          title="Learning Letters & Sounds"
          description="Knows their ABCs, understands basic story sequences, predicts what happens next."
          ageRange="3-4 Years"
          selected={userData.readingLevel === 4}
          onSelect={() => setUserData({ ...userData, readingLevel: 4 })}
        />
        <ReadingLevelCard
          title="Starting to Read"
          description='Recognizes words, enjoys a good plot twist, and uses "reading" as an excuse to stay up past bedtime.'
          ageRange="4-5 Years"
          selected={userData.readingLevel === 5}
          onSelect={() => setUserData({ ...userData, readingLevel: 5 })}
        />
      </div>
    </div>
  );

  const stepContent3 = (
    <div className="flex flex-col gap-4 pb-8">
      <h2 className="pb-0 text-left text-4xl font-medium text-gray-800">
        Let's bring your child's favorite toy to life!
      </h2>
      <p className="text-left text-base text-gray-600">
        Snap a photo of your child's favorite toy, and it will become an imaginary friend in a
        personalized story! Along the way, your child will learn four new words in the chosen
        language.
      </p>
      <div className="flex flex-row gap-8 w-full items-center justify-center">
        <UploadButton
          endpoint="imageUploader"
          config={{ cn: twMerge }}
          content={{
            button: ({ ready }) => {
              if (!ready)
                return (
                  <div className="font-medium text-sm flex flex-row gap-2 items-center">
                    <CameraIcon className="w-4 h-4" />
                    Loading...
                  </div>
                );
              return capturedImage ? (
                <div className="font-medium text-sm flex flex-row gap-2 items-center">
                  <SwitchCameraIcon className="w-4 h-4" />
                  Retake Photo
                </div>
              ) : (
                <div className="font-medium text-sm flex flex-row gap-2 items-center">
                  <CameraIcon className="w-4 h-4" />
                  Take a Photo
                </div>
              );
            },
          }}
          className="motion-preset-compress ut-allowed-content:hidden ut-button:ut-readying:bg-gray-600 ut-button:ut-uploading:bg-gray-600 ut-button:bg-black"
          onClientUploadComplete={res => {
            setIsProcessing(true);
            setCapturedImage(
              `https://${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${res[0].key}`
            );
            let newToy: ToyData = {
              key: res[0].key,
              image: res[0].url,
            }
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
                  }

                  setUserData(prevUserData => ({
                    ...prevUserData,
                    toys: [newToy],
                  }));
                  
                  console.log("HELLO THE DATA IS ", data);
                  console.log("current userdata is ", userData);
                  
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
      <div className="mt-3 mb-12 mx-auto">
        <Card className="rotate-2 flex w-96 flex-col gap-3 items-center rounded-xs">
          {capturedImage ? (
            <Image
              src={capturedImage}
              alt="Captured toy"
              width={300}
              height={300}
              className="rounded-md object-cover h-75 w-75"
            />
          ) : (
            <div className="h-75 w-75 bg-gray-100 rounded-md border border-gray-300"></div>
          )}

          <div className="h-20" />
        </Card>
      </div>
    </div>
  );
  

  async function Cleanup() {
    setCleaning(true);
    console.log("DATA AT START OF CLEANUP");
    console.log(userData);
    
    // Make sure we have toys and vocab data before proceeding
    if (!userData.toys || userData.toys.length === 0 || !userData.toys[0].vocab) {
      console.error("No toy or vocab data available for cleanup");
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
        filePath: "tmp/file_list.txt"
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const result = JSON.parse(data.toyAudio);
          console.log("RECEIVED AT CLEANUP ", result);
          let newToy: ToyData = userData.toys[0];
          newToy = {
            ...newToy,
            vocab: result
          }
          console.log("NEW TOY IS ", newToy);
          let finalUserData = {...userData, toys: [newToy]};
          saveUserDataToFile(finalUserData);
          console.log("USER DATA SAVED");
          processBMP(newToy);
          console.log("bmp saved");
          setCleaning(false);
          // redirect('/toys');
          return result;
        }
        setCleaning(false);
        return null;
      })
      .catch(error => {
        console.log("ERROR AT COMPLETEREADY ", error);
        setCleaning(false);
        throw error; // Re-throw the error so it can be caught by the caller
      });   
  };


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
    const typewriter = <div className="leading-none text-2xl font-weight-400 text-gray-600 mt-4 pb-2">I found four vocabulary words for your child to learn.</div>;
    const titleClass = animationFirst ? "motion-preset-blur-right-sm motion-duration-[1200ms]" : "";
    const adjustClass = animationFirst ? "motion-delay-[5000ms] motion-preset-blur-up-md motion-duration-[500ms]" : "";
    const cardClass = animationFirst ? "starting:shadow-base starting:rotate-z-2 starting:rotate-y-0 starting:rotate-x-0 delay-[1000ms] starting:opacity-0 transition-all duration-1500 motion-delay-[1200ms]" : "";
    const gridClass = animationFirst ? "motion-delay-[1000ms] motion-preset-fade motion-duration-[2000ms]" : "";
    
    // Safely access vocab data with fallbacks for undefined values
    const currentToy = userData.toys && userData.toys.length > 0 ? userData.toys[0] : null;
    const vocabData = currentToy?.vocab || [];
    
    return (
      <div className="flex flex-col gap-4 motion-preset-fade-in motion-duration-[500ms]">
        <div className={`flex flex-col gap-0 mb-4 ${titleClass}`}>
          {/* Title */}
          <h1 className={`text-[80px] leading-none font-bold text-gray-800 ${titleClass}`}>Hello!</h1>
          {animationFirst ? <TypewriterEffectSmooth className="mt-4 mb-0 mx-auto" words={[{text: "I found four vocabulary words for your child to learn.", className: "leading-none text-2xl font-weight-400 text-gray-600"}]} /> : typewriter}
          
          <div className={`text-lg font-weight-400 text-gray-400 ${adjustClass}`}>Feel free to adjust the words or my name!</div>
        </div>
        {/* Grid */}
        <div className="my-4 mx-auto grid gap-40 grid-cols-2">
          {/* Column 1 */}
          {/* Toy Polaroid */}
          <Card className={`opacity-100 rotate-x-15 rotate-y-0 rotate-z-5 shadow-xl motion-translate-y-loop-10 motion-duration-2000 motion-translate-x-loop-5 motion-ease-in-out rotate-2 flex w-96 flex-col gap-3 items-center rounded-xs ${cardClass}`}>
            {capturedImage ? (
              <Image
                src={capturedImage}
                alt="Captured toy"
                width={300}
                height={300}
                className="rounded-md object-cover h-75 w-75"
              />
            ) : (
              <div className="h-75 w-75 bg-gray-100 rounded-md border border-gray-300"></div>
            )}
            <div className="flex flex-col gap-0 items-center">
              <Input
                className="w-7/10 shadow-none text-center placeholder:text-gray-400 mx-4 font-lily h-auto font-bold md:text-4xl border-none"
                type="text"
                placeholder={currentToy?.name || ''}
              />
              <p className="text-gray-400 mt-[-2]">{currentToy?.name && 'the'}</p>
              <Input
                className="w-7/10 shadow-none text-center placeholder:text-gray-400 mx-4 h-auto font-medium md:text-xl border-none"
                type="text"
                placeholder={currentToy?.title || ''}
              />
            </div>
          </Card>
          {/* End Column 1 */}

          {/* Column 2 */}
          <div className={`flex flex-col gap-4 w-full my-auto ${gridClass}`}>
            <Button variant="outline" className="self-end"><Pencil></Pencil></Button>
            <Input
              className="w-full"
              type="text"
              placeholder={vocabData[0]?.word || ''} />
            <Input
              className="w-full"
              type="text"
              placeholder={vocabData[1]?.word || ''} />
            <Input
              className="w-full"
              type="text"
              placeholder={vocabData[2]?.word || ''} />
            <Input
              className="w-full"
              type="text"
              placeholder={vocabData[3]?.word || ''} />
          </div>
          {/* End Column 2 */}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex animate-in fade-in zoom-in ">
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
            Cleanup();
            saveUserDataToFile(userData);
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
          <StepContent>{stepContent1}</StepContent>
          <StepContent>{stepContent2}</StepContent>
          <StepContent>{stepContent3}</StepContent>
          <StepContent><StepContent4 /></StepContent>
        </Stepper>
      </div>
    </div>
  );
}
