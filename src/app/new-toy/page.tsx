'use client';

import { useState } from 'react';
import Stepper, { StepContent } from '@/components/stepper';
import { LanguageCard, OtherLanguageSelector } from '@/components/language-card';
import Image from 'next/image';

const steps = [
  { label: 'Choose Language' },
  { label: 'Reading Level' },
  { label: 'Take a Picture' },
  { label: 'Name Your Toy' },
];

export default function NewToy() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const stepContent1 = (
    <div className="flex flex-col gap-4">
      <h2 className="text-4xl font-medium text-gray-800">
        What language would you like your child to learn?
      </h2>
      <div className="flex flex-row flex-wrap gap-4">
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
          <StepContent>Reading Level Content</StepContent>
          <StepContent>Take a Picture Content</StepContent>
          <StepContent>Name Your Toy Content</StepContent>
        </Stepper>
      </div>
    </div>
  );
}
