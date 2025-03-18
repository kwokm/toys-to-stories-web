'use client';

import { UserData } from '@/types/types';
import { LanguageCard, OtherLanguageSelector } from '@/components/setup/user-setup-cards';

interface LanguageSelectionProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export const LanguageSelection: React.FC<LanguageSelectionProps> = ({ userData, setUserData }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="pb-2 text-center text-[28px] font-[700] text-gray-800">
        What language would you like your child to learn?
      </h2>
      <div className="flex flex-row flex-wrap justify-center gap-4">
        <LanguageCard
          language="Spanish"
          countryCodes={['ES', 'MX']}
          selected={userData.language === 'es'}
          onSelect={() => setUserData({ ...userData, language: 'es' })}
        />
        <LanguageCard
          language="French"
          countryCodes={['FR']}
          selected={userData.language === 'fr'}
          onSelect={() => setUserData({ ...userData, language: 'fr' })}
        />
        <LanguageCard
          language="German"
          countryCodes={['DE']}
          selected={userData.language === 'de'}
          onSelect={() => setUserData({ ...userData, language: 'de' })}
        />
        <LanguageCard
          language="Japanese"
          countryCodes={['JP']}
          selected={userData.language === 'ja'}
          onSelect={() => setUserData({ ...userData, language: 'ja' })}
        />
        <LanguageCard
          language="Korean"
          countryCodes={['KR']}
          selected={userData.language === 'ko'}
          onSelect={() => setUserData({ ...userData, language: 'ko' })}
        />
        <LanguageCard
          language="Hindi"
          countryCodes={['IN']}
          selected={userData.language === 'hi'}
          onSelect={() => setUserData({ ...userData, language: 'hi' })}
        />
        <LanguageCard
          language="Chinese (Mandarin)"
          countryCodes={['CN', 'HK', 'TW']}
          selected={userData.language === 'zh'}
          onSelect={() => setUserData({ ...userData, language: 'zh' })}
        />
      </div>
      <OtherLanguageSelector
        className="mx-auto h-[48px] w-[300px]"
        initialLanguage={userData.language}
        onSelect={language => {
          console.log(language);
          setUserData({ ...userData, language: language });
        }}
      />
    </div>
  );
};

export default LanguageSelection;
