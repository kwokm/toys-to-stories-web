import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ScrollText, Pencil, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Story } from '@/types/types';
import { CardGrid, StoryGrid } from '@/components/ui/card-grid';
import { BookVisualization, CharacterPortraits } from './book-visualization';
import { AnimatedBookItem } from './book-animation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const StoryCardGrid = ({
  stories,
  onSelectStory,
  onEditStory,
  onDeleteStory,
}: {
  stories: Story[];
  onSelectStory: (storyId: string) => void;
  onEditStory?: (storyId: string) => void;
  onDeleteStory?: (storyId: string) => void;
}) => {
  const router = useRouter();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  
  const handleStoryClick = (storyId: string) => {
    setSelectedStoryId(selectedStoryId === storyId ? null : storyId);
  };

  const handleReadStory = (storyId: string) => {
    onSelectStory(storyId);
  };

  const handleEditStory = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    if (onEditStory) {
      onEditStory(storyId);
    } else {
      // Fallback if no edit handler is provided
      toast.info("Editing Story", {
        description: `Editing story with ID: ${storyId}`
      });
      router.push(`/stories/edit/${storyId}`);
    }
  };

  const handleDeleteStory = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    if (onDeleteStory) {
      onDeleteStory(storyId);
    } else {
      // Fallback if no delete handler is provided
      toast.error("Story Deleted", {
        description: "Your story has been deleted successfully."
      });
      
      // Reset selection if the deleted story was selected
      if (selectedStoryId === storyId) {
        setSelectedStoryId(null);
      }
    }
  };
  
  return (
      <StoryGrid layout="wide" spacing="loose">
        {stories.map((story, index) => (
          <AnimatedBookItem 
            key={story.id} 
            custom={index}
            onClick={() => handleStoryClick(story.id)}
          >
            <StoryCard 
              story={story} 
              isSelected={selectedStoryId === story.id}
              onRead={() => handleReadStory(story.id)}
              onEdit={(e) => handleEditStory(e, story.id)}
              onDelete={(e) => handleDeleteStory(e, story.id)}
            />
          </AnimatedBookItem>
        ))}
        <AnimatedBookItem 
          custom={stories.length}
          onClick={() => router.push('/toys')}
        >
          <EmptyStoryCard />
        </AnimatedBookItem>
      </StoryGrid>
  );
};

export const StoryCard = ({
  story,
  isSelected = false,
  onRead,
  onEdit,
  onDelete,
  className="",
}: {
  story: Story;
  isSelected?: boolean;
  onRead?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Show action buttons when hovered or selected
  const showActions = isHovered || isSelected;
  
  // Classes for selected state
  const selectedClasses = isSelected 
    ? "ring-4 rounded-md ring-orange-500 shadow-lg" 
    : "";

  return (
    <div 
      className={cn(
        "relative group hover:rotate-x-4 hover:rotate-z-2 duration-600",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BookVisualization
        title={story.Story.Title}
        summary={story.Story['Two Sentence Summary']}
        date={new Date(story.createdAt).toLocaleDateString()}
        className={cn(
          "cursor-pointer transition-all duration-300 hover:shadow-2xl", 
          selectedClasses
        )}
      >
        <CharacterPortraits characters={story.characters || []} />
      </BookVisualization>
      
      {/* Action buttons - visible on hover or when selected */}
      <AnimatePresence>
        {showActions && (
          <motion.div 
            className="absolute bottom-3 right-3 flex gap-2"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {onEdit && (
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full bg-white hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                  onClick={onEdit}
                  title="Edit story"
                >
                  <Pencil className="h-4 w-4 text-orange-600" />
                </Button>
              </motion.div>
            )}
            {onDelete && (
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full bg-white hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                  onClick={onDelete}
                  title="Delete story"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Read button - only visible when selected */}
      <AnimatePresence>
        {isSelected && onRead && (
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              className="shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onRead();
              }}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Read Story
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const EmptyStoryCard = () => {
  return (
    <div className="relative mx-auto h-[350px] w-[250px] cursor-pointer transition-all duration-300 hover:shadow-2xl">
      <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform pointer-events-none">
        <Button className="rotate-z-2 shadow-md">
          <ScrollText className="mr-2 h-6 w-6 text-white" />
          <p className="text-white">Create a Story</p>
        </Button>
      </div>

      <BookVisualization isEmpty={true} />
    </div>
  );
}; 