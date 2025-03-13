import Link from 'next/link';
import { ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Story } from '@/types/types';
import { CardGrid } from '@/components/ui/card-grid';
import { BookVisualization, CharacterPortraits } from './book-visualization';
import { AnimatedBookContainer, AnimatedBookItem } from './book-animation';

export const StoryCardGrid = ({
  stories,
  onSelectStory,
}: {
  stories: Story[];
  onSelectStory: (storyId: string) => void;
}) => {
  return (
    <AnimatedBookContainer>
      <CardGrid layout="wide" spacing="loose">
        {stories.map((story, index) => (
          <AnimatedBookItem 
            key={story.id} 
            custom={index}
            onClick={() => onSelectStory(story.id)}
          >
            <StoryCard 
              story={story} 
            />
          </AnimatedBookItem>
        ))}
        <AnimatedBookItem custom={stories.length}>
          <EmptyStoryCard />
        </AnimatedBookItem>
      </CardGrid>
    </AnimatedBookContainer>
  );
};

export const StoryCard = ({
  story,
  className,
}: {
  story: Story;
  className?: string;
}) => {
  return (
    <div className={className}>
      <BookVisualization
        title={story.Story.Title}
        summary={story.Story['Two Sentence Summary']}
        date={new Date(story.createdAt).toLocaleDateString()}
      >
        <CharacterPortraits characters={story.characters || []} />
      </BookVisualization>
    </div>
  );
};

export const EmptyStoryCard = () => {
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

      <BookVisualization isEmpty={true} />
    </div>
  );
}; 