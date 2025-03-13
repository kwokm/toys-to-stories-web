'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Story } from '@/types/types';
import { Wand2 } from 'lucide-react';

interface EditStoryModalProps {
  story: Story | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStory: Story) => void;
  onRegenerate: (storyId: string) => void;
}

export function EditStoryModal({ 
  story, 
  isOpen, 
  onClose, 
  onSave,
  onRegenerate
}: EditStoryModalProps) {
  const [pageContent, setPageContent] = useState<string[]>(
    story?.Story['Page Contents'] || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Reset form when story changes
  useState(() => {
    if (story) {
      setPageContent(story.Story['Page Contents'] || []);
    }
  });

  const handleSave = () => {
    if (!story) return;
    
    setIsSaving(true);
    
    try {
      // Create updated story object
      const updatedStory: Story = {
        ...story,
        Story: {
          ...story.Story,
          'Page Contents': pageContent
        }
      };
      
      // Call the save function
      onSave(updatedStory);
      
      // Show success toast
      toast.success('Story updated successfully');
      
      // Close the modal
      onClose();
    } catch (error) {
      toast.error('Failed to update story');
      console.error('Error updating story:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    if (!story) return;
    
    setIsRegenerating(true);
    
    try {
      // Call the regenerate function
      onRegenerate(story.id);
      
      // Show info toast
      toast.info('Regenerating story...');
      
      // Close the modal
      onClose();
    } catch (error) {
      toast.error('Failed to regenerate story');
      console.error('Error regenerating story:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handlePageContentChange = (index: number, content: string) => {
    const newPageContent = [...pageContent];
    newPageContent[index] = content;
    setPageContent(newPageContent);
  };

  if (!story) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Story: {story.Story.Title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Characters Section */}
          <div>
            <Label className="mb-2 block">Characters</Label>
            <div className="flex flex-wrap gap-3">
              {story.characters?.map((character) => (
                <div 
                  key={character.key} 
                  className="flex flex-col items-center"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-orange-500">
                    <Image
                      src={character.image}
                      alt={character.name || 'Character'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="mt-1 text-sm font-medium">{character.name}</span>
                  <span className="text-xs text-gray-500">{character.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Page Content Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Page Content</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1 text-orange-500 border-orange-500 hover:bg-orange-50 hover:text-orange-600"
              >
                <Wand2 className="h-3 w-3" />
                Regenerate Story
              </Button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {pageContent.map((content, index) => (
                <div key={index} className="grid gap-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`page-${index}`} className="text-sm text-gray-500">
                      Page {index + 1}
                    </Label>
                  </div>
                  <Textarea
                    id={`page-${index}`}
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlePageContentChange(index, e.target.value)}
                    className="min-h-[100px] text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 