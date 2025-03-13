'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Library, ScrollText } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { HeaderActions } from '@/components/layout/HeaderActions';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { getStories, saveCurrentStoryId } from '@/lib/dataService';
import { Story } from '@/types/types';
import { StoryCardGrid } from '@/components/stories/story-cards';

export default function StoriesPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the data using our dataService
    const storiesFromStorage = getStories();
    setStories(storiesFromStorage);
    setIsLoading(false);
  }, []);

  // Function to handle reading a story
  const handleReadStory = (storyId: string) => {
    // Save current story ID using our dataService
    saveCurrentStoryId(storyId);
    // Navigate to the story-mode page
    router.push('/stories/story-mode');
  };

  // If still loading, show the Loading component
  if (isLoading) {
    return <Loading message="Loading your stories..." />;
  }

  // If there are no stories, show the EmptyState component
  if (stories.length === 0) {
    return (
      <PageLayout
        icon={<Library className="h-16 w-16" />}
        title="Your Stories"
        description="Create stories with your toys and read them here!"
        actions={
          <HeaderActions 
            showSettings={true}
            showToybox={true}
          />
        }
      >
        <EmptyState
          title="No stories found"
          description="Start by creating your first story with your toys."
          icon={<Library className="h-16 w-16" />}
          action={{
            label: "Create Your First Story",
            onClick: () => router.push('/toys'),
            icon: <ScrollText className="h-4 w-4" />
          }}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      icon={<Library className="h-16 w-16" />}
      title="Your Stories"
      description="Your magical stories created with your toys!"
      actions={
        <HeaderActions 
          showSettings={true}
          showToybox={true}
        />
      }
    >
      <StoryCardGrid 
        stories={stories}
        onSelectStory={handleReadStory}
      />
    </PageLayout>
  );
}
