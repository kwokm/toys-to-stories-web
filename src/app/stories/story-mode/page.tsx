'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen, Volume, Icon, Library } from 'lucide-react';
import { chest } from '@lucide/lab';
import { Story, VocabWord } from '@/types/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import Link from 'next/link';

// Sample story data for development and testing
const sampleStoryData: Story[] = [
  {
    Story: {
      'Life Lesson':
        'The best friendships are built on understanding and helping each other, even when we have different strengths and weaknesses.',
      'Page Contents': [
        "Once upon a time, in a cozy playroom filled with sunshine, lived Scarlett the Letter, Goldie the Teddy Bear, and Quackers the Duck. Scarlett, a bright red letter 'A,' loved to spell words. (Page 1)",
        'Goldie the Teddy Bear was soft and cuddly, always ready for a hug. Quackers the Duck, with his sunny yellow feathers, loved to waddle and splash! (Page 2)',
        'One day, Scarlett decided to write a special song for her friends. She wanted to spell out all the things she loved about them! But oh no! Scarlett needed help! (Page 3)',
        '"I can\'t hold a pen!" cried Scarlett. "How can I write this song?" Goldie waddled near. "Don\'t you worry, Scarlett," he said. "I can help!" (Page 4)',
        'Goldie carefully held the pen with his paws. But the pen slipped and slid! "Oh dear," Goldie sighed. "I\'m too fluffy!" (Page 5)',
        'Quackers waddled up, his little feet going *pat pat*. "Maybe I can help!" he quacked. He tried to hold the pen with his beak, but it just wouldn\'t stay put. (Page 6)',
        'Scarlett felt a little sad. "I wanted to write such a special song," she sighed. Then Goldie had an idea! "We can work together!" he exclaimed. (Page 7)',
        '"I can tell you the letters, Scarlett!" said Goldie. "And I can quack to make a beat!" added Quackers. So, Scarlett spelled out the words, Goldie spoke them aloud, and Quackers made the music with his quacks! (Page 8)',
        'Together, they created the most wonderful song! It told about how much they cared for each other, how fun it was to play together, and how special their friendship was. (Page 9)',
        'Scarlett, Goldie, and Quackers sang and danced. They were so happy they found a way to create together, even with their different strengths. (Page 10)',
      ],
      'Recommended Vocabulary Words': {
        'Vocabulary Word': [
          {
            Definition: 'To move with short steps.',
            'Translated Word': '蹒跚 (Pán shān)',
            Word: 'Waddled',
          },
          {
            Definition: 'To say something in a loud voice.',
            'Translated Word': '呼喊 (Hūhǎn)',
            Word: 'Exclaimed',
          },
          {
            Definition: 'To make a sound like a duck.',
            'Translated Word': '嘎嘎 (Gā gā)',
            Word: 'Quacked',
          },
          {
            Definition: 'A feeling of being happy and contented.',
            'Translated Word': '满意 (Mǎnyì)',
            Word: 'Contented',
          },
        ],
      },
      Title: "Scarlett's Song",
      'Two Sentence Summary':
        'Scarlett the Letter wants to write a song for her friends Goldie the Teddy Bear and Quackers the Duck, but she needs their help. They learn that by working together and using their unique talents, they can create something wonderful.',
    },
    id: 'story_1741856142025',
    createdAt: '2025-03-13T08:55:42.025Z',
    characters: [
      {
        key: 'O02Jv06CkHPwlnp0XT74KHwSUoTJhuZQq0WxBfGDAej1Vz9O',
        name: 'Scarlett',
        title: 'Letter',
        image: 'https://utfs.io/f/O02Jv06CkHPwlnp0XT74KHwSUoTJhuZQq0WxBfGDAej1Vz9O',
      },
      {
        key: 'O02Jv06CkHPwOv9pVE6CkHPwAldJqS5QaZfX83Fs7eKcy6vz',
        name: 'Goldie',
        title: 'Teddy Bear',
        image: 'https://utfs.io/f/O02Jv06CkHPwOv9pVE6CkHPwAldJqS5QaZfX83Fs7eKcy6vz',
      },
      {
        key: 'O02Jv06CkHPwxX1uTHktQpFyEfPkRu1wizbrHXo7ZUD20G69',
        name: 'Quackers',
        title: 'Duck',
        image: 'https://utfs.io/f/O02Jv06CkHPwxX1uTHktQpFyEfPkRu1wizbrHXo7ZUD20G69',
      },
    ],
  },
];

export default function StoryModePage() {
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [useSampleData, setUseSampleData] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    // Get current story ID from localStorage
    const getCurrentStoryFromStorage = () => {
      if (typeof window === 'undefined') {
        return null;
      }

      try {
        const currentStoryId = localStorage.getItem('currentStoryId');
        if (!currentStoryId) {
          console.log('No current story ID found in localStorage');
          return null;
        }

        // Get all stories from localStorage
        const storiesString = localStorage.getItem('stories');
        if (!storiesString) {
          console.log('No stories found in localStorage');
          return null;
        }

        const stories = JSON.parse(storiesString) as Story[];

        // Find the current story by ID
        const currentStory = stories.find(story => story.id === currentStoryId);
        if (!currentStory) {
          console.log('Current story not found in stories array');
          return null;
        }

        return currentStory;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    };

    const loadStory = async () => {
      const currentStory = getCurrentStoryFromStorage();

      if (currentStory) {
        setStory(currentStory);
        setUseSampleData(false);
      } else {
        // Use sample data if no story is found in localStorage
        setStory(sampleStoryData[0]);
        setUseSampleData(true);
      }

      setIsLoading(false);
    };

    loadStory();
  }, []);

  // Handle carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on('select', () => {
      setCurrentPage(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const toggleVocab = () => {
    setShowVocab(!showVocab);
  };

  const goToLibrary = () => {
    router.push('/stories');
  };

  // Function to clean page content by removing page numbers
  const cleanPageContent = (content: string) => {
    return content?.replace(/\(Page \d+\)$/, '').trim() || '';
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-8 text-white">
        <div className="text-center">
          <p className="text-xl">Loading your story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center bg-black py-8 text-white">
        <div className="text-center">
          <p className="text-xl text-red-500">Story not found</p>
          <div>
            <Button onClick={goToLibrary} variant="outline" className="mt-4 rounded-md border-white border-1 px-4 py-2 text-white">
              <Library className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasTranslation =
    story.Story['Page Contents Translated'] && story.Story['Page Contents Translated'].length > 0;

  // Extract page number for display
  const pageNumberMatch = story.Story['Page Contents'][currentPage].match(/\(Page (\d+)\)$/);
  const pageNumber = pageNumberMatch ? pageNumberMatch[1] : (currentPage + 1).toString();

  return (
    <div className="relative h-full min-h-screen motion-bg-in-[#fff7ea] overflow-hidden bg-black text-white motion-ease-out motion-duration-2000">
      {useSampleData && (
        <div className="bg-orange-600 px-4 py-2 text-center text-white">
          <p className="text-sm">Using sample story data. Create your own story to see it here!</p>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 motion-bg-in-[#fff7ea] border-b border-gray-800 bg-black p-6 motion-ease-out motion-duration-2000">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={goToLibrary} className="bg-none border border-white text-white hover:bg-gray-900">
            <Library className="mr-2 h-4 w-4" />
            Back to Library
          </Button>

          <Link href="/toys" className="flex items-center">
            <Image
              src="/assets/ToysToStoriesColoredText.svg"
              alt="Toys to Stories Logo"
              width={150}
              height={40}
              className="h-16 w-auto"
            />
          </Link>

          <div className="flex items-center space-x-4">
            {/* Character Icons */}
            <div className="flex -space-x-2">
              {story.characters.map((character, index) => (
                <div
                  key={character.key}
                  className="relative h-8 w-8 overflow-hidden rounded-full border border-orange-500 bg-gray-900"
                  title={`${character.name} the ${character.title}`}
                >
                  <Image
                    src={character.image}
                    alt={character.name || 'Character'}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              {hasTranslation && (
                <Button
                  variant={showTranslation ? 'default' : 'outline'}
                  onClick={toggleTranslation}
                  size="sm"
                  className={`${showTranslation ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-700 text-white hover:bg-gray-800'}`}
                >
                  {showTranslation ? 'Original' : 'Translation'}
                </Button>
              )}
              <Button
                variant={showVocab ? 'default' : 'outline'}
                onClick={toggleVocab}
                size="sm"
                className={`${showVocab ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-700 text-white hover:bg-gray-800'}`}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="z-10 container mx-auto flex h-full px-4 py-0">
        {showVocab ? (
          <div className="mx-auto mb-8 flex max-w-3xl rounded-xl bg-gray-900 p-8">
            <div className="relative z-10 space-y-6">
              <h2 className="mb-4 text-2xl font-bold text-orange-400">Vocabulary Words</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {story.Story['Recommended Vocabulary Words']['Vocabulary Word'].map(
                  (word, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-orange-400">{word.Word}</h3>
                        <Button variant="ghost" size="sm" className="h-auto p-1 text-orange-400">
                          <Volume className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-1 text-gray-300">{word.Definition}</p>
                      <p className="mt-2 text-gray-400 italic">{word['Translated Word']}</p>
                    </div>
                  )
                )}
              </div>
              <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
                <h2 className="mb-2 text-2xl font-bold text-orange-400">Life Lesson</h2>
                <p className="text-gray-300">{story.Story['Life Lesson']}</p>
              </div>
              <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
                <h2 className="mb-2 text-2xl font-bold text-orange-400">Story Summary</h2>
                <p className="text-gray-300">{story.Story['Two Sentence Summary']}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              {/* Story Title */}
              <div className="pointer-events-none absolute top-[7%] right-0 left-0 z-20 text-center">
                <h1 className="px-6 font-bricolage text-3xl font-bold text-orange-400 md:text-4xl">
                  {story.Story.Title}
                </h1>
              </div>

              {/* Gradient mask for top fade effect */}
              <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-[35%] motion-opacity-in-[0] bg-gradient-to-b from-black via-black to-transparent motion-ease-out motion-delay-2000 motion-duration-2000"></div>

              <Carousel
                setApi={setCarouselApi}
                className="h-full w-full"
                orientation="vertical"
                opts={{
                  align: 'center',
                  loop: false,
                  slidesToScroll: 1,
                }}
              >
                <CarouselContent className="-mt-1 h-[87vh]">
                  {story.Story['Page Contents'].map((content, index) => (
                    <CarouselItem key={index} className="flex pt-1 select-none md:basis-1/3">
                      <div className="mx-auto my-auto p-1">
                        <div
                          className={`${index === 0 ? 'mt-[50%]' : ''} ${index === story.Story['Page Contents'].length - 1 ? 'mb-[60%]' : ''} flex h-full flex-col justify-center rounded-xl p-6 transition-opacity duration-300 ${currentPage === index ? 'opacity-100' : 'opacity-20'}`}
                        >
                          <div className="mb-4 text-center">
                            <p className="text-left text-sm font-[700] text-orange-600">
                              {index + 1} / {story.Story['Page Contents'].length}
                            </p>
                          </div>
                          <p className="text-[40px] leading-[1.4] text-white">
                            {showTranslation && hasTranslation
                              ? story.Story['Page Contents Translated']?.[index]
                              : cleanPageContent(content)}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Add navigation controls 
                <div className="absolute right-4 bottom-[50%] z-20 flex flex-col gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={() => carouselApi?.scrollPrev()}
                    disabled={currentPage === 0}
                  >
                    <span className="sr-only">Previous page</span>
                    ↑
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={() => carouselApi?.scrollNext()}
                    disabled={currentPage === story.Story['Page Contents'].length - 1}
                  >
                    <span className="sr-only">Next page</span>
                    ↓
                  </Button>
                </div> */}
              </Carousel>

              {/* Gradient mask for bottom fade effect */}
              <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-[35%] motion-opacity-in-[0] bg-gradient-to-t from-black via-black to-transparent motion-ease-out motion-delay-1500 motion-duration-2000"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
