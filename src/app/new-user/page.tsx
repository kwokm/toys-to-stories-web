'use client';
import { twMerge } from 'tailwind-merge';

import { useState, useRef } from 'react';
import Stepper, { StepContent } from '@/components/stepper';
import { LanguageCard, OtherLanguageSelector, ReadingLevelCard } from '@/components/setup-cards';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { CameraIcon, SwitchCameraIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { identifyToy, storyCreation } from '@/lib/gemini';

const steps = [
  { label: 'Choose Language' },
  { label: 'Reading Level' },
  { label: 'Take a Picture' },
  { label: 'Bring Them to Life' },
];

let toyName = '';
let toyKey = '';
let toyTitle = '';
let personalityTraits = [''];
let toyImage = '';

export default function NewUser() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [readingLevel, setReadingLevel] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [toyName, setToyName] = useState<string>('');
  const [toyTitle, setToyTitle] = useState<string>('');

  // Add a wrapper function to log the selected language
  const handleLanguageSelect = (language: string) => {
    console.log('Selected language:', language);
    setSelectedLanguage(language);
  };

  const stepContent1 = (
    <div className="flex flex-col gap-4">
      <h2 className="pb-4 text-left text-4xl font-medium text-gray-800">
        What language would you like your child to learn?
      </h2>
      <div className="justify-center flex flex-row flex-wrap gap-4">
        <LanguageCard
          language="Spanish"
          countryCodes={['ES', 'MX']}
          selected={selectedLanguage === 'Spanish'}
          onSelect={() => setSelectedLanguage('Spanish')}
        />
        <LanguageCard
          language="French"
          countryCodes={['FR']}
          selected={selectedLanguage === 'French'}
          onSelect={() => setSelectedLanguage('French')}
        />
        <LanguageCard
          language="German"
          countryCodes={['DE']}
          selected={selectedLanguage === 'German'}
          onSelect={() => setSelectedLanguage('German')}
        />
        <LanguageCard
          language="Japanese"
          countryCodes={['JP']}
          selected={selectedLanguage === 'Japanese'}
          onSelect={() => setSelectedLanguage('Japanese')}
        />
        <LanguageCard
          language="Korean"
          countryCodes={['KR']}
          selected={selectedLanguage === 'Korean'}
          onSelect={() => setSelectedLanguage('Korean')}
        />
        <LanguageCard
          language="Hindi"
          countryCodes={['IN']}
          selected={selectedLanguage === 'Hindi'}
          onSelect={() => setSelectedLanguage('Hindi')}
        />
        <LanguageCard
          language="Chinese (Mandarin)"
          countryCodes={['CN', 'HK', 'TW']}
          selected={selectedLanguage === 'Chinese (Mandarin)'}
          onSelect={() => setSelectedLanguage('Chinese (Mandarin)')}
        />
      </div>
      <OtherLanguageSelector onSelect={language => setSelectedLanguage(language)} />
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
          selected={readingLevel === 1}
          onSelect={() => setReadingLevel(1)}
        />
        <ReadingLevelCard
          title="Recognizing Words"
          description="Points at pictures, repeats words nonstop, and loves rhymes even more than you do."
          ageRange="12-24 Months"
          selected={readingLevel === 2}
          onSelect={() => setReadingLevel(2)}
        />
        <ReadingLevelCard
          title="Listening to Stories"
          description='Follows simple stories, starts recognizing letters, but may still think "S" is just a cool squiggle.'
          ageRange="2-3 Years"
          selected={readingLevel === 3}
          onSelect={() => setReadingLevel(3)}
        />
        <ReadingLevelCard
          title="Learning Letters & Sounds"
          description="Knows their ABCs, understands basic story sequences, predicts what happens next."
          ageRange="3-4 Years"
          selected={readingLevel === 4}
          onSelect={() => setReadingLevel(4)}
        />
        <ReadingLevelCard
          title="Starting to Read"
          description='Recognizes words, enjoys a good plot twist, and uses "reading" as an excuse to stay up past bedtime.'
          ageRange="4-5 Years"
          selected={readingLevel === 5}
          onSelect={() => setReadingLevel(5)}
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
            button: ({ ready, isUploading }) => {
              if (!ready)
                return (
                  <div className="font-medium text-sm flex flex-row gap-2 items-center">
                    <CameraIcon className="w-4 h-4" />
                    Loading...
                  </div>
                );
              if (isUploading) return 'Uploading...';
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
          className="ut-allowed-content:hidden transition-all duration-300 ut-button:ut-readying:bg-gray-600 ut-button:ut-uploading:bg-gray-600 ut-button:bg-black"
          onClientUploadComplete={res => {
            setCapturedImage(
              `https://${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${res[0].key}`
            );
            let geminipath: string = "";
            toyKey = res[0].key;
            console.log(res[0].url);
            
            // Download the image to the server
            fetch('/api/download-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageUrl: res[0].url,
                fileName: res[0].name
              }),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Image downloaded to server:', data);
                // You can store the local server path if needed
                // For example, you might want to use this path instead of the uploadthing URL
                if (data.success) {
                  // console.log('Local server path:', data.filepath);
                  toyImage = data.filepath;
                  const result = identifyToy(`${data.filepath}`, res[0].type);
                  result.then(result => {
                    // console.log(result);
                    setToyName(JSON.parse(result).Name);
                    setToyTitle(JSON.parse(result).Item);
                  });

                }
              })
              .catch(error => {
                console.error('Error downloading image to server:', error);
              });
          }}
          onUploadError={(error: Error) => {
            console.log(error);
          }}
        />
      </div>
      <div className="my-4 mx-auto">
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

  const stepContent4 = (
    <div className="flex flex-col gap-4">
      <div className="my-4 mx-auto">
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

          <div className="flex flex-col gap-0 items-center">
            <Input
              className="w-7/10 shadow-none text-center placeholder:text-gray-400 mx-4 font-lily h-auto font-bold md:text-4xl border-none"
              type="text"
              placeholder={toyName}
          />
          <p className="text-gray-400 font-light mt-[-2]">{toyName && 'the'}</p>
                    <Input
              className="w-7/10 shadow-none text-center placeholder:text-gray-400 mx-4 h-auto font-medium md:text-xl border-none"
              type="text"
              placeholder={toyTitle}
          />
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex">
      <div className="lg:mx-24 mx-4 pt-16 gap-4 flex flex-col">
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
            console.log('Complete');
          }}
        >
          <StepContent>{stepContent1}</StepContent>
          <StepContent>{stepContent2}</StepContent>
          <StepContent>{stepContent3}</StepContent>
          <StepContent>{stepContent4}</StepContent>
        </Stepper>
      </div>
    </div>
  );
}
