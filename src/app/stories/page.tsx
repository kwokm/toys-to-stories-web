'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Story } from '@/types/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Home, BookOpen, ScrollText, Library, Settings, Icon } from 'lucide-react';
import { chest } from '@lucide/lab';
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
      <div className="container mx-auto flex min-h-[50vh] motion-opacity-out-0 items-center justify-center py-8 motion-ease-out motion-duration-1000">
        <div className="text-center">
          <p className="text-xl">Loading your stories...</p>
        </div>
      </div>
    );
  }

  // Prepare the header actions
  const headerActions = (
    <div className="flex flex-row gap-2">
      <Button onClick={() => router.push('/toys')} variant="outline" className="ml-auto">
        <Icon iconNode={chest} className="mr-1 size-5" />
        Back to Toybox
      </Button>
      <Button
        onClick={() => router.push('/settings')}
        variant="ghost"
        size="icon"
        className=""
        title="Settings"
      >
        <Settings className="size-4 text-gray-900 hover:border" />
      </Button>
    </div>
  );

  // If there are no stories, show a message
  if (stories.length === 0) {
    return (
      <div className="h-full min-h-screen bg-orange-50 pb-24">
        {/* Header using PageHeader component */}
        <PageHeader
          icon={<Library className="h-16 w-16" />}
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
              <ScrollText className="mr-1 size-4" />
              Create Your First Story
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen bg-orange-50 pb-24">
      {/* Header using PageHeader component */}
      <PageHeader
        icon={<Library className="h-16 w-16" />}
        title="Your Stories"
        description="Your magical stories created with your toys!"
        actions={headerActions}
      />

      {/* Start Story Cards */}
      <div className="px-12 pt-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
          {stories.map(story => (
            <StoryCard key={story.id} story={story} onSelect={() => handleReadStory(story.id)} />
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
  className,
}: {
  story: Story;
  onSelect: () => void;
  className?: string;
}) => {
  // Get a random color for the book cover from a set of darker warm colors
  const getRandomBookColor = () => {
    const colors = [
      'bg-orange-600',
      'bg-amber-700',
      'bg-yellow-700',
      'bg-red-800',
      'bg-rose-700',
      'bg-pink-800',
      'bg-emerald-700',
      'bg-teal-700',
      'bg-cyan-800',
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  // Get a random spine color that's even darker than the cover
  const getRandomSpineColor = () => {
    const colors = [
      'bg-orange-900',
      'bg-amber-900',
      'bg-yellow-900',
      'bg-red-900',
      'bg-rose-900',
      'bg-pink-900',
      'bg-emerald-900',
      'bg-teal-900',
      'bg-cyan-950',
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
        'motion-translate-y-loop-10 motion-translate-x-loop-5 relative mx-auto rotate-2 cursor-pointer transition-all duration-500 motion-ease-in-out motion-duration-2000 hover:rotate-x-4 hover:rotate-z-2',
        className
      )}
      onClick={onSelect}
    >
      {/* Book container */}
      <div className="relative h-[350px] w-[250px] shadow-xl">
        {/* Book spine */}
        <div
          className={`absolute top-0 left-0 h-full w-[35px] rounded-l-md ${spineColor} shadow-inner`}
        >
          {/* No spine title */}
        </div>

        {/* Book cover */}
        <div
          className={`absolute top-0 right-0 h-full w-[225px] rounded-r-md ${coverColor} flex flex-col p-6`}
        >
          {/* Book title */}
          <h3 className="mt-2 mb-6 line-clamp-2 text-center font-bricolage text-2xl font-bold text-white">
            {story.Story.Title}
          </h3>

          {/* Character image in a circular frame */}
          <div className="relative mx-auto">
            {story.characters && story.characters.length > 0 ? (
              <>
                {/* If 3 or fewer characters, show all of them */}
                {story.characters.length <= 3 ? (
                  <div className="flex items-center justify-center">
                    {story.characters.map((character, index) => (
                      <div
                        key={character.key}
                        className={`h-[70px] w-[70px] overflow-hidden rounded-full bg-white p-1 shadow-inner ${
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
                    <div className="h-[100px] w-[100px] overflow-hidden rounded-full bg-white p-1 shadow-inner">
                      <Image
                        src={story.characters[0].image}
                        alt={story.characters[0].name || story.characters[0].title || 'Character'}
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                      />
                    </div>

                    {/* Character count badge for more than 3 characters */}
                    <div className="absolute -right-2 -bottom-2 rounded-full border border-orange-300 bg-white p-1 shadow-md">
                      <p className="text-xs font-medium text-orange-800">
                        +{story.characters.length - 1}
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              // Fallback for when there are no characters
              <div className="h-[100px] w-[100px] overflow-hidden rounded-full bg-white p-1 shadow-inner">
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
          <p className="mt-6 line-clamp-4 text-center text-sm font-medium text-white">
            {story.Story['Two Sentence Summary']}
          </p>

          {/* Date at the bottom */}
          <p className="mt-auto text-center text-xs text-white/60">
            {new Date(story.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Book pages - right edge */}
        <div className="absolute top-[5px] right-0 bottom-[5px] w-[5px] rounded-r-sm bg-white/90"></div>
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
            <ScrollText className="mr-2 h-6 w-6 text-white" />
            <p className="text-white">Create a Story</p>
          </Button>
        </Link>
      </div>

      {/* Empty book */}
      <div className="relative h-full w-full opacity-70 blur-[10px]">
        {/* Book spine */}
        <div className="absolute top-0 left-0 h-full w-[35px] rounded-l-md bg-gray-400 shadow-inner"></div>

        {/* Book cover */}
        <div className="absolute top-0 right-0 flex h-full w-[225px] flex-col rounded-r-md bg-gray-300 p-6">
          {/* Placeholder for title */}
          <div className="mx-auto mt-2 mb-6 h-8 w-3/4 rounded bg-gray-400/50"></div>

          {/* Placeholder for image */}
          <div className="mx-auto">
            <div className="h-[100px] w-[100px] rounded-full bg-gray-400/50 shadow-inner"></div>
          </div>

          {/* Placeholder for text */}
          <div className="mt-6 h-4 w-full rounded bg-gray-400/50"></div>
          <div className="mx-auto mt-2 h-4 w-5/6 rounded bg-gray-400/50"></div>
          <div className="mx-auto mt-2 h-4 w-4/6 rounded bg-gray-400/50"></div>
          <div className="mx-auto mt-2 h-4 w-3/4 rounded bg-gray-400/50"></div>
        </div>

        {/* Book pages - right edge */}
        <div className="absolute top-[5px] right-0 bottom-[5px] w-[5px] rounded-r-sm bg-white/90"></div>
      </div>
    </div>
  );
};
