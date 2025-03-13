'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Library, ScrollText } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { HeaderActions } from '@/components/layout/HeaderActions';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { getStories, saveCurrentStoryId, saveStories } from '@/lib/dataService';
import { Story } from '@/types/types';
import { StoryCardGrid } from '@/components/stories/book-cards';
import { toast } from 'sonner';
import { EditStoryModal } from '@/components/modals/edit-story-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function StoriesPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [storyToEdit, setStoryToEdit] = useState<Story | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Function to handle editing a story
  const handleEditStory = (storyId: string) => {
    // Find the story to edit
    const story = stories.find(s => s.id === storyId);
    
    if (story) {
      // Set the story to edit and open the edit modal
      setStoryToEdit(story);
      setIsEditModalOpen(true);
    } else {
      toast.error("Story not found");
    }
  };

  // Function to save edited story
  const handleSaveStory = (updatedStory: Story) => {
    try {
      // Update the story in the stories array
      const updatedStories = stories.map(story => 
        story.id === updatedStory.id ? updatedStory : story
      );
      
      // Save the updated stories
      saveStories(updatedStories);
      
      // Update the local state
      setStories(updatedStories);
      
      // Show success message
      toast.success("Story updated successfully");
    } catch (error) {
      toast.error("Failed to update story");
      console.error('Error updating story:', error);
    }
  };

  // Function to regenerate a story
  const handleRegenerateStory = (storyId: string) => {
    // In a real app, this would call an API to regenerate the story
    toast.info("Regenerating Story", {
      description: "This would call an API to regenerate the story content."
    });
    
    // For now, just simulate a regeneration by showing a success message
    setTimeout(() => {
      // In a real implementation, this would update the story with new content
      // and then save it to localStorage and the cloud
      
      // For demonstration purposes, we'll just show a success message
      // and ensure the current stories are saved to the cloud
      saveStories(stories);
      
      toast.success("Story regenerated successfully");
    }, 2000);
  };

  // Function to handle deleting a story
  const handleDeleteStory = (storyId: string) => {
    // Set the story to delete and open the confirmation dialog
    setStoryToDelete(storyId);
    setIsDeleteDialogOpen(true);
  };

  // Function to confirm story deletion
  const confirmStoryDeletion = () => {
    if (!storyToDelete) return;

    try {
      // Filter out the story to delete
      const updatedStories = stories.filter(story => story.id !== storyToDelete);
      
      // Save the updated stories
      saveStories(updatedStories);
      
      // Update the local state
      setStories(updatedStories);
      
      // Show success message
      // toast.success("Story deleted successfully");
    } catch (error) {
      toast.error("Failed to delete story");
      console.error('Error deleting story:', error);
    } finally {
      // Close the dialog and reset the story to delete
      setIsDeleteDialogOpen(false);
      setStoryToDelete(null);
    }
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
    <>
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
          onEditStory={handleEditStory}
          onDeleteStory={handleDeleteStory}
        />
      </PageLayout>

      {/* Edit Story Modal */}
      <EditStoryModal
        story={storyToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setStoryToEdit(null);
        }}
        onSave={handleSaveStory}
        onRegenerate={handleRegenerateStory}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this story?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the story and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStoryToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStoryDeletion}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
