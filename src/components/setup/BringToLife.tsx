'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pencil, Volume } from 'lucide-react';
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

  // Function to update vocabulary word
  const updateVocabWord = (index: number, word: string) => {
    if (currentToy && currentToy.vocab && currentToy.vocab.length > index) {
      const updatedVocab = [...currentToy.vocab];
      updatedVocab[index] = { ...updatedVocab[index], word };
      const updatedToy = { ...currentToy, vocab: updatedVocab };
      setUserData(prev => ({ ...prev, toys: [updatedToy] }));
    }
  };

  return (
    <div className="motion-preset-fade-in flex flex-col gap-4 motion-duration-[500ms]">
      <div className={`mb-4 flex flex-col gap-0 ${titleClass}`}>
        {/* Title */}
        <h1 className={`text-[80px] leading-none font-bold text-gray-800 ${titleClass}`}>Hello!</h1>
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
      <div className="mx-auto my-4 flex flex-row gap-24">
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
              onChange={e => {
                if (currentToy) {
                  const updatedToy = { ...currentToy, name: e.target.value };
                  setUserData(prev => ({ ...prev, toys: [updatedToy] }));
                }
              }}
            />
            <p className="mt-[-2] text-gray-400">{currentToy?.name && 'the'}</p>
            <Input
              className="mx-4 h-auto w-7/10 border-none text-center font-medium shadow-none placeholder:text-gray-400 md:text-xl"
              type="text"
              placeholder={currentToy?.title || ''}
              onChange={e => {
                if (currentToy) {
                  const updatedToy = { ...currentToy, title: e.target.value };
                  setUserData(prev => ({ ...prev, toys: [updatedToy] }));
                }
              }}
            />
          </div>
        </Card>
        {/* End Column 1 */}

        {/* Column 2 - Vocabulary Cards */}
        <div className={`my-auto flex flex-col gap-4 ${gridClass}`}>
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map(index => (
              <div
                key={index}
                className="group max-w-[250px] rounded-lg border border-none bg-none py-4 shadow-none"
              >
                <div className="mb-1 flex items-center justify-between border-b-2 border-dashed border-orange-500 pb-2">
                  <div className="relative flex-1">
                    <Input
                      className="w-full border-none border-orange-400 bg-transparent p-0 pr-6 font-bricolage text-3xl font-semibold text-gray-700 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-2xl"
                      type="text"
                      placeholder={`Vocabulary word ${index + 1}`}
                      value={vocabData[index]?.word || ''}
                      onChange={e => updateVocabWord(index, e.target.value)}
                    />
                    <Pencil className="absolute top-1/2 right-0 h-3.5 w-3.5 -translate-y-1/2 text-orange-300 transition-colors group-hover:text-orange-400" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Volume className="h-4 w-4" />
                  </Button>
                </div>

                {vocabData[index]?.translation && (
                  <p className="text-left text-base text-lg text-zinc-500">
                    {vocabData[index]?.translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* End Column 2 */}
      </div>
    </div>
  );
};
