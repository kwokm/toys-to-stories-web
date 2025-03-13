'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserData } from '@/types/types';
import { TypewriterEffectSmooth } from '@/components/typewriter';

interface BringToLifeProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  capturedImage: string | null;
  animationFirst: boolean;
  setAnimationFirst: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BringToLife: React.FC<BringToLifeProps> = ({
  userData,
  setUserData,
  capturedImage,
  animationFirst,
  setAnimationFirst,
}) => {
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
    <div className="leading-none text-2xl font-weight-400 text-gray-600 mt-4 pb-2">
      I found four vocabulary words for your child to learn.
    </div>
  );
  const titleClass = animationFirst ? "motion-preset-blur-right-sm motion-duration-[1200ms]" : "";
  const adjustClass = animationFirst
    ? "motion-delay-[5000ms] motion-preset-blur-up-md motion-duration-[500ms]"
    : "";
  const cardClass = animationFirst
    ? "starting:shadow-base starting:rotate-z-2 starting:rotate-y-0 starting:rotate-x-0 delay-[1000ms] starting:opacity-0 transition-all duration-1500 motion-delay-[1200ms]"
    : "";
  const gridClass = animationFirst
    ? "motion-delay-[1000ms] motion-preset-fade motion-duration-[2000ms]"
    : "";

  // Safely access vocab data with fallbacks for undefined values
  const currentToy = userData.toys && userData.toys.length > 0 ? userData.toys[0] : null;
  const vocabData = currentToy?.vocab || [];

  return (
    <div className="flex flex-col gap-4 motion-preset-fade-in motion-duration-[500ms]">
      <div className={`flex flex-col gap-0 mb-4 ${titleClass}`}>
        {/* Title */}
        <h1 className={`text-[80px] leading-none font-bold text-gray-800 ${titleClass}`}>Hello!</h1>
        {animationFirst ? (
          <TypewriterEffectSmooth
            className="mt-4 mb-0 mx-auto"
            words={[
              {
                text: "I found four vocabulary words for your child to learn.",
                className: "leading-none text-2xl font-weight-400 text-gray-600",
              },
            ]}
          />
        ) : (
          typewriter
        )}

        <div className={`text-lg font-weight-400 text-gray-400 ${adjustClass}`}>
          Feel free to adjust the words or my name!
        </div>
      </div>
      {/* Grid */}
      <div className="my-4 mx-auto grid gap-40 grid-cols-2">
        {/* Column 1 */}
        {/* Toy Polaroid */}
        <Card
          className={`opacity-100 rotate-x-15 rotate-y-0 rotate-z-5 shadow-xl motion-translate-y-loop-10 motion-duration-2000 motion-translate-x-loop-5 motion-ease-in-out rotate-2 flex w-96 flex-col gap-3 items-center rounded-xs ${cardClass}`}
        >
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
              onChange={(e) => {
                if (currentToy) {
                  const updatedToy = { ...currentToy, name: e.target.value };
                  setUserData(prev => ({ ...prev, toys: [updatedToy] }));
                }
              }}
            />
            <p className="text-gray-400 mt-[-2]">{currentToy?.name && 'the'}</p>
            <Input
              className="w-7/10 shadow-none text-center placeholder:text-gray-400 mx-4 h-auto font-medium md:text-xl border-none"
              type="text"
              placeholder={currentToy?.title || ''}
              onChange={(e) => {
                if (currentToy) {
                  const updatedToy = { ...currentToy, title: e.target.value };
                  setUserData(prev => ({ ...prev, toys: [updatedToy] }));
                }
              }}
            />
          </div>
        </Card>
        {/* End Column 1 */}

        {/* Column 2 */}
        <div className={`flex flex-col gap-4 w-full my-auto ${gridClass}`}>
          <Button variant="outline" className="self-end">
            <Pencil></Pencil>
          </Button>
          <Input
            className="w-full"
            type="text"
            placeholder={vocabData[0]?.word || ''}
            onChange={(e) => {
              if (currentToy && currentToy.vocab && currentToy.vocab.length > 0) {
                const updatedVocab = [...currentToy.vocab];
                updatedVocab[0] = { ...updatedVocab[0], word: e.target.value };
                const updatedToy = { ...currentToy, vocab: updatedVocab };
                setUserData(prev => ({ ...prev, toys: [updatedToy] }));
              }
            }}
          />
          <Input
            className="w-full"
            type="text"
            placeholder={vocabData[1]?.word || ''}
            onChange={(e) => {
              if (currentToy && currentToy.vocab && currentToy.vocab.length > 1) {
                const updatedVocab = [...currentToy.vocab];
                updatedVocab[1] = { ...updatedVocab[1], word: e.target.value };
                const updatedToy = { ...currentToy, vocab: updatedVocab };
                setUserData(prev => ({ ...prev, toys: [updatedToy] }));
              }
            }}
          />
          <Input
            className="w-full"
            type="text"
            placeholder={vocabData[2]?.word || ''}
            onChange={(e) => {
              if (currentToy && currentToy.vocab && currentToy.vocab.length > 2) {
                const updatedVocab = [...currentToy.vocab];
                updatedVocab[2] = { ...updatedVocab[2], word: e.target.value };
                const updatedToy = { ...currentToy, vocab: updatedVocab };
                setUserData(prev => ({ ...prev, toys: [updatedToy] }));
              }
            }}
          />
          <Input
            className="w-full"
            type="text"
            placeholder={vocabData[3]?.word || ''}
            onChange={(e) => {
              if (currentToy && currentToy.vocab && currentToy.vocab.length > 3) {
                const updatedVocab = [...currentToy.vocab];
                updatedVocab[3] = { ...updatedVocab[3], word: e.target.value };
                const updatedToy = { ...currentToy, vocab: updatedVocab };
                setUserData(prev => ({ ...prev, toys: [updatedToy] }));
              }
            }}
          />
        </div>
        {/* End Column 2 */}
      </div>
    </div>
  );
};