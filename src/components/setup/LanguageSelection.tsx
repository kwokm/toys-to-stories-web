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
      <h2 className="pb-2 text-[28px] font-[700] text-center text-gray-800">
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
        onSelect={language => {
          console.log(language);
          setUserData({ ...userData, language: language });
        }}
      />
    </div>
  );
};

export default LanguageSelection;