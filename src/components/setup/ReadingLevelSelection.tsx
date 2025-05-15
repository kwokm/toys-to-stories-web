'use client';

import { UserData } from '@/types/types';
import { ReadingLevelCard } from '@/components/setup/user-setup-cards';

interface ReadingLevelSelectionProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export const ReadingLevelSelection: React.FC<ReadingLevelSelectionProps> = ({
  userData,
  setUserData,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="pb-2 text-center text-2xl md:text-[28px] font-[700] text-gray-800">
        What stage best describes the child's current reading level?
      </h2>
      <div className="flex flex-col gap-4">
        <ReadingLevelCard
          title="Meeting Books"
          description="Looks at pictures, listens to voices, and occasionally likes to chew on books."
          stepImage="/assets/lvl1.svg"
          ageRange="0-12 Months"
          selected={userData.readingLevel === 1}
          onSelect={() => setUserData({ ...userData, readingLevel: 1 })}
        />
        <ReadingLevelCard
          title="Talking & Pointing"
          stepImage="/assets/lvl2.svg"
          description="Points at pictures, repeats words nonstop, and loves rhymes even more than you do."
          ageRange="12-24 Months"
          selected={userData.readingLevel === 2}
          onSelect={() => setUserData({ ...userData, readingLevel: 2 })}
        />
        <ReadingLevelCard
          title="Enjoying Stories"
          stepImage="/assets/lvl3.svg"
          description='Follows simple stories, starts recognizing letters, but may still think "S" is just a cool squiggle.'
          ageRange="2-3 Years"
          selected={userData.readingLevel === 3}
          onSelect={() => setUserData({ ...userData, readingLevel: 3 })}
        />
        <ReadingLevelCard
          title="Exploring Letters & Sounds"
          stepImage="/assets/lvl4.svg"
          description="Knows their ABCs, understands basic story sequences, predicts what happens next."
          ageRange="3-4 Years"
          selected={userData.readingLevel === 4}
          onSelect={() => setUserData({ ...userData, readingLevel: 4 })}
        />
        <ReadingLevelCard
          title="Becoming a Reader"
          stepImage="/assets/lvl5.svg"
          description='Recognizes words, enjoys a good plot twist, and uses "reading" as an excuse to stay up past bedtime.'
          ageRange="4-5 Years"
          selected={userData.readingLevel === 5}
          onSelect={() => setUserData({ ...userData, readingLevel: 5 })}
        />
      </div>
    </div>
  );
};

export default ReadingLevelSelection;
