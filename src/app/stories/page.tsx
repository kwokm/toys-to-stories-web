'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Story } from '@/types/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Home, BookOpen, ScrollText, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/layout/PageHeader';

export default function StoriesPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to safely get stories from localStorage
    const getStoriesFromLocalStorage = () => {
      if (typeof window === 'undefined') {
        return []; // Return empty array during server-side rendering
      }

      try {
        const storiesString = localStorage.getItem('stories');
        if (!storiesString) {
          console.log('No stories found in localStorage');
          return [];
        }

        const parsedData = JSON.parse(storiesString) as Story[];
        console.log('Stories from localStorage:', parsedData);

        return parsedData;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
      }
    };

    // Get the data from localStorage
    const storiesFromStorage = getStoriesFromLocalStorage();
    setStories(storiesFromStorage);
    setIsLoading(false);
  }, []);

  // Function to handle reading a story
  const handleReadStory = (storyId: string) => {
    // Save current story ID to localStorage
    localStorage.setItem('currentStoryId', storyId);
    
    // Navigate to the story-mode page
    router.push('/stories/story-mode');
  };

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="motion-opacity-out-0 motion-duration-1000 motion-ease-out container mx-auto flex min-h-[50vh] items-center justify-center py-8">
        <div className="text-center">
          <p className="text-xl">Loading your stories...</p>
        </div>
      </div>
    );
  }

  // Prepare the header actions
  const headerActions = (
    <Button 
      onClick={() => router.push('/toys')}
      variant="outline"
      className="ml-auto"
    >
      <Image src="/assets/treasurechest.svg" alt="Toybox" width={20} height={20} className="mr-2" />
      Back to Toybox
    </Button>
  );

  // If there are no stories, show a message
  if (stories.length === 0) {
    return (
      <div className="min-h-screen h-full pb-24 bg-orange-50">
        {/* Header using PageHeader component */}
        <PageHeader
          icon={<Library />}
          title="Your Stories"
          description="Create stories with your toys and read them here!"
          actions={headerActions}
        />

        <div className="container mx-16 flex min-h-[50vh] items-center justify-center py-8">
          <div className="text-center">
            <p className="mb-4 text-xl">No stories found</p>
            <Button 
              onClick={() => router.push('/toys')}
              className="mesh-gradient overflow-clip text-black"
            >
              <ScrollText className="size-4 mr-1" />Create Your First Story
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full pb-24 bg-orange-50">
      {/* Header using PageHeader component */}
      <PageHeader
        icon={<Library />}
        title="Your Stories"
        description="Your magical stories created with your toys!"
        actions={headerActions}
      />

      {/* Start Story Cards */}
      <div className="px-12 pt-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard 
              key={story.id} 
              story={story} 
              onSelect={() => handleReadStory(story.id)}
            />
          ))}
          <EmptyStoryCard />
        </div>
      </div>
      {/* End Story Cards */}
    </div>
  );
}

const StoryCard = ({ 
  story, 
  onSelect,
  className
}: { 
  story: Story; 
  onSelect: () => void;
  className?: string;
}) => {
  // Get a random color for the book cover from a set of darker warm colors
  const getRandomBookColor = () => {
    const colors = [
      'bg-orange-600', 'bg-amber-700', 'bg-yellow-700', 
      'bg-red-800', 'bg-rose-700', 'bg-pink-800',
      'bg-emerald-700', 'bg-teal-700', 'bg-cyan-800'
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  
  // Get a random spine color that's even darker than the cover
  const getRandomSpineColor = () => {
    const colors = [
      'bg-orange-900', 'bg-amber-900', 'bg-yellow-900', 
      'bg-red-900', 'bg-rose-900', 'bg-pink-900',
      'bg-emerald-900', 'bg-teal-900', 'bg-cyan-950'
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  // Generate random colors for this book
  const coverColor = getRandomBookColor();
  const spineColor = getRandomSpineColor();

  return (
    <div 
      className={cn(
        "relative cursor-pointer transition-all duration-500 hover:rotate-x-4 hover:rotate-z-2 motion-translate-y-loop-10 motion-duration-2000 motion-translate-x-loop-5 motion-ease-in-out rotate-2 mx-auto",
        className
      )}
      onClick={onSelect}
    >
      {/* Book container */}
      <div className="relative h-[350px] w-[250px] shadow-xl">
        {/* Book spine */}
        <div className={`absolute left-0 top-0 h-full w-[35px] rounded-l-md ${spineColor} shadow-inner`}>
          {/* No spine title */}
        </div>
        
        {/* Book cover */}
        <div className={`absolute right-0 top-0 h-full w-[225px] rounded-r-md ${coverColor} p-6 flex flex-col`}>
          {/* Book title */}
          <h3 className="text-white font-bricolage text-2xl text-center mt-2 mb-6 line-clamp-2 font-bold">
            {story.Story.Title}
          </h3>
          
          {/* Character image in a circular frame */}
          <div className="mx-auto relative">
            {story.characters && story.characters.length > 0 ? (
              <>
                {/* If 3 or fewer characters, show all of them */}
                {story.characters.length <= 3 ? (
                  <div className="flex justify-center items-center">
                    {story.characters.map((character, index) => (
                      <div 
                        key={character.key} 
                        className={`h-[70px] w-[70px] rounded-full bg-white p-1 shadow-inner overflow-hidden ${
                          index > 0 ? '-ml-4' : ''
                        } border-2 border-white`}
                        style={{ zIndex: story.characters.length - index }}
                      >
                        <Image
                          src={character.image}
                          alt={character.name || character.title || 'Character'}
                          width={70}
                          height={70}
                          className="rounded-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // If more than 3 characters, show the first one with a +X badge
                  <>
                    <div className="h-[100px] w-[100px] rounded-full bg-white p-1 shadow-inner overflow-hidden">
                      <Image
                        src={story.characters[0].image}
                        alt={story.characters[0].name || story.characters[0].title || 'Character'}
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                      />
                    </div>
                    
                    {/* Character count badge for more than 3 characters */}
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-orange-300 shadow-md">
                      <p className="text-xs font-medium text-orange-800">+{story.characters.length - 1}</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              // Fallback for when there are no characters
              <div className="h-[100px] w-[100px] rounded-full bg-white p-1 shadow-inner overflow-hidden">
                <Image
                  src="/assets/storyPlaceholder.svg"
                  alt={story.Story.Title}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Story summary */}
          <p className="mt-6 text-white text-sm font-medium line-clamp-4 text-center">
            {story.Story['Two Sentence Summary']}
          </p>
          
          {/* Date at the bottom */}
          <p className="mt-auto text-xs text-white/60 text-center">
            {new Date(story.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Book pages - right edge */}
        <div className="absolute right-0 top-[5px] bottom-[5px] w-[5px] bg-white/90 rounded-r-sm"></div>
      </div>
    </div>
  );
};

const EmptyStoryCard = () => {
  const router = useRouter();
  
  return (
    <div className="relative mx-auto h-[350px] w-[250px]">
      <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
        <Link href="/toys">
          <Button className="rotate-2 shadow-md">
            <ScrollText className="h-6 w-6 text-white mr-2" />
            <p className="text-white">Create a Story</p>
          </Button>
        </Link>
      </div>
      
      {/* Empty book */}
      <div className="relative h-full w-full blur-[12px] opacity-70">
        {/* Book spine */}
        <div className="absolute left-0 top-0 h-full w-[35px] rounded-l-md bg-gray-400 shadow-inner"></div>
        
        {/* Book cover */}
        <div className="absolute right-0 top-0 h-full w-[225px] rounded-r-md bg-gray-300 p-6 flex flex-col">
          {/* Placeholder for title */}
          <div className="h-8 w-3/4 bg-gray-400/50 rounded mx-auto mt-2 mb-6"></div>
          
          {/* Placeholder for image */}
          <div className="mx-auto">
            <div className="h-[100px] w-[100px] rounded-full bg-gray-400/50 shadow-inner"></div>
          </div>
          
          {/* Placeholder for text */}
          <div className="mt-6 h-4 w-full bg-gray-400/50 rounded"></div>
          <div className="mt-2 h-4 w-5/6 bg-gray-400/50 rounded mx-auto"></div>
          <div className="mt-2 h-4 w-4/6 bg-gray-400/50 rounded mx-auto"></div>
          <div className="mt-2 h-4 w-3/4 bg-gray-400/50 rounded mx-auto"></div>
        </div>
        
        {/* Book pages - right edge */}
        <div className="absolute right-0 top-[5px] bottom-[5px] w-[5px] bg-white/90 rounded-r-sm"></div>
      </div>
    </div>
  );
};
