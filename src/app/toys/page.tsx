'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ScrollText, Library, Icon } from 'lucide-react';
import { chest } from '@lucide/lab';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/layout/PageLayout';
import { HeaderActions, ActionButton } from '@/components/layout/HeaderActions';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { getUserData, getStories, saveSelectedToys, hasStories, saveUserData } from '@/lib/dataService';
import { buildToyCards } from '@/components/toys/toy-cards';
import { UserData, ToyData } from '@/types/types';
import { toast } from 'sonner';
import { EditToyModal } from '@/components/modals/edit-toy-modal';
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

export default function ToysPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedToys, setSelectedToys] = useState<string[]>([]);
  const [hasUserStories, setHasUserStories] = useState(false);
  const [toyToDelete, setToyToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toyToEdit, setToyToEdit] = useState<ToyData | null>(null);

  // Function to handle toy selection
  const handleToySelection = (toyKey: string) => {
    setSelectedToys(prev => {
      // If toy is already selected, remove it from selection
      if (prev.includes(toyKey)) {
        return prev.filter(key => key !== toyKey);
      }
      // Otherwise add it to selection
      return [...prev, toyKey];
    });
  };

  // Function to handle creating a story
  const handleCreateStory = () => {
    // Save selected toys using our dataService
    saveSelectedToys(selectedToys);
    // Navigate to the stories/new page
    router.push('/stories/new');
  };

  // Function to handle editing a toy
  const handleToyEdit = (toyKey: string) => {
    if (!userData) return;
    
    // Find the toy to edit
    const toyData = userData.toys.find(toy => toy.key === toyKey);
    
    if (toyData) {
      // Set the toy to edit and open the edit modal
      setToyToEdit(toyData);
      setIsEditModalOpen(true);
    } else {
      toast.error("Toy not found");
    }
  };

  // Function to save edited toy
  const handleSaveToy = (updatedToy: ToyData) => {
    if (!userData) return;
    
    try {
      // Update the toy in the user data
      const updatedToys = userData.toys.map(toy => 
        toy.key === updatedToy.key ? updatedToy : toy
      );
      
      // Create updated user data
      const updatedUserData = {
        ...userData,
        toys: updatedToys
      };
      
      // Save the updated user data
      saveUserData(updatedUserData);
      
      // Update the local state
      setUserData(updatedUserData);
      
      // Show success message
      toast.success("Toy updated successfully");
    } catch (error) {
      console.error("Error updating toy:", error);
      toast.error("Failed to update toy");
    }
  };

  // Function to handle deleting a toy
  const handleToyDelete = (toyKey: string) => {
    // Set the toy to delete and open the confirmation dialog
    setToyToDelete(toyKey);
    setIsDeleteDialogOpen(true);
  };

  // Function to confirm toy deletion
  const confirmToyDeletion = () => {
    if (!userData || !toyToDelete) return;

    try {
      // Filter out the toy to delete
      const updatedToys = userData.toys.filter(toy => toy.key !== toyToDelete);
      
      // Create updated user data
      const updatedUserData = {
        ...userData,
        toys: updatedToys
      };
      
      // Save the updated user data
      saveUserData(updatedUserData);
      
      // Update the local state
      setUserData(updatedUserData);
      
      // Remove from selected toys if it was selected
      setSelectedToys(prev => prev.filter(key => key !== toyToDelete));
      
      // Show success message
      toast.success("Toy deleted successfully");
    } catch (error) {
      console.error("Error deleting toy:", error);
      toast.error("Failed to delete toy");
    } finally {
      // Close the dialog and reset the toy to delete
      setIsDeleteDialogOpen(false);
      setToyToDelete(null);
    }
  };

  useEffect(() => {
    // Get the data using our dataService
    const userDataFromStorage = getUserData();
    setUserData(userDataFromStorage);
    setHasUserStories(hasStories());
    setIsLoading(false);
  }, []);

  // If still loading, show the Loading component
  if (isLoading) {
    return <Loading message="Loading your toys..." />;
  }

  // If there are no toys, show the EmptyState component
  if (!userData || !userData.toys || userData.toys.length === 0) {
    return (
      <PageLayout
        icon={<Icon iconNode={chest} className="h-16 w-16" />}
        title="Your Toybox"
        description="Add toys to create stories with them!"
        actions={
          <HeaderActions 
            showSettings={true}
          />
        }
      >
        <EmptyState
          title="No toys found"
          description="Start by adding your first toy to create stories with it."
          icon={<Icon iconNode={chest} className="h-16 w-16" />}
          action={{
            label: "Add Your First Toy",
            onClick: () => router.push('/toys/new'),
            icon: <ScrollText className="h-4 w-4" />
          }}
        />
      </PageLayout>
    );
  }

  // Prepare custom actions for the header
  const customActions = (
    <>
      <div className={`flex ${hasUserStories ? 'flex-row' : 'flex-col'} gap-2`}>
        {hasUserStories && (
          <ActionButton
            icon={<Library className="size-4" />}
            label="Library"
            onClick={() => router.push('/stories')}
            variant="outline"
          />
        )}
        <Button
          disabled={selectedToys.length === 0}
          onClick={handleCreateStory}
          className={`${selectedToys.length > 0 ? 'motion-scale-loop-[102%] grayscale-0 motion-duration-[1500ms]' : ''}grayscale-100 mesh-gradient my-auto ml-auto overflow-clip text-black transition-all duration-[1500ms]`}
        >
          <ScrollText className="mr-1 size-4" />
          Create a Story
        </Button>
        <p
        className={`${selectedToys.length === 0 ? 'opacity-100' : 'opacity-0'} ${hasUserStories ? 'hidden' : 'flex'} my-auto ml-4 text-[13px] transition-opacity duration-300`}
        >
          Tap some toys to get started!
        </p>
      </div>
    </>
  );

  return (
    <>
      <PageLayout
        icon={<Icon iconNode={chest} className="h-16 w-16" />}
        title="Your Toybox"
        description="Each toy you add here syncs directly to the soundboard!"
        actions={
          <HeaderActions 
            showSettings={true}
            customActions={customActions}
          />
        }
      >
        {buildToyCards(
          userData.toys || [], 
          selectedToys, 
          handleToySelection,
          handleToyEdit,
          handleToyDelete
        )}
      </PageLayout>

      {/* Edit Toy Modal */}
      <EditToyModal
        toy={toyToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setToyToEdit(null);
        }}
        onSave={handleSaveToy}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this toy?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the toy and remove it from any stories it appears in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmToyDeletion}
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
