'use client';
import { twMerge } from 'tailwind-merge'
import "@uploadthing/react/styles.css";

import { useState } from 'react';
import Stepper, { StepContent } from '@/components/stepper';
import { LanguageCard, OtherLanguageSelector, ReadingLevelCard } from '@/components/setup-cards';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { CameraIcon } from 'lucide-react';
const steps = [
  { label: 'Choose Language' },
  { label: 'Reading Level' },
  { label: 'Take a Picture' },
  { label: 'Name Your Toy' },
];

export default function NewToy() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [readingLevel, setReadingLevel] = useState<number | null>(null);
  
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
      <OtherLanguageSelector onSelect={(language) => setSelectedLanguage(language)} />
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
          description={"Looks at pictures, listens to voices, and occasionally likes to chew on books."}
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
          description="Recognizes words, enjoys a good plot twist, and uses &quot;reading&quot; as an excuse to stay up past bedtime."
          ageRange="4-5 Years"
          selected={readingLevel === 5}
          onSelect={() => setReadingLevel(5)}
        />
      </div>
    </div>
  );

  const stepContent3 = (
    <div className="flex flex-col gap-4">
      <h2 className="pb-4 text-left text-4xl font-medium text-gray-800">
      Let's bring your child's favorite toy to life!
      </h2>
      <p className="text-left text-base text-gray-600">Snap a photo of your child's favorite toy, and it will become an imaginary friend in a personalized story! Along the way, your child will learn four new words in the chosen language.</p>
      <div className="flex flex-row gap-8 w-full items-center justify-center">
      <UploadButton
        config= {{cn: twMerge}}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);

        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
                  <Button>
        <CameraIcon className="w-4 h-4" />
        <p>Take a Photo</p>
      </Button>
      </div>
    </div>
  );

  const stepContent4 = (
    <div className="flex flex-col gap-4">
      <h2 className="pb-4 text-left text-4xl font-medium text-gray-800">
      Ready for an Adventure?
      </h2>
      <p className="text-left text-base text-gray-600">Your child’s favorite toy is ready for an adventure! If everything looks good, let’s begin!</p>
      <div className="flex flex-row gap-4">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
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
        <Stepper steps={steps}>
          <StepContent>{stepContent1}</StepContent>
          <StepContent>{stepContent2}</StepContent>
          <StepContent>{stepContent3}</StepContent>
          <StepContent>Name Your Toy Content</StepContent>
        </Stepper>
      </div>
    </div>
  );
}
