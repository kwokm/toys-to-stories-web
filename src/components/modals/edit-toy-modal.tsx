'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ToyData, VocabData } from '@/types/types';

interface EditToyModalProps {
  toy: ToyData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedToy: ToyData) => void;
}

export function EditToyModal({ toy, isOpen, onClose, onSave }: EditToyModalProps) {
  const [name, setName] = useState(toy?.name || '');
  const [title, setTitle] = useState(toy?.title || '');
  const [vocabWords, setVocabWords] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when toy changes
  useState(() => {
    if (toy) {
      setName(toy.name || '');
      setTitle(toy.title || '');
      // Convert vocab array to comma-separated string
      setVocabWords(toy.vocab?.map(v => v.word).join(', ') || '');
    }
  });

  const handleSave = () => {
    if (!toy) return;
    
    setIsSaving(true);
    
    try {
      // Parse vocab words from comma-separated string
      const vocab: VocabData[] = vocabWords
        .split(',')
        .map(word => word.trim())
        .filter(word => word !== '')
        .map(word => ({ word }));
      
      // Create updated toy object
      const updatedToy: ToyData = {
        ...toy,
        name,
        title,
        vocab
      };
      
      // Call the save function
      onSave(updatedToy);
      
      // Show success toast
      toast.success('Toy updated successfully');
      
      // Close the modal
      onClose();
    } catch (error) {
      toast.error('Failed to update toy');
      console.error('Error updating toy:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!toy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Toy</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Enter toy name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Enter toy title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="vocab">Vocabulary Words</Label>
            <Textarea
              id="vocab"
              value={vocabWords}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setVocabWords(e.target.value)}
              placeholder="Enter vocabulary words (comma separated)"
              className="min-h-[80px]"
            />
            <p className="text-xs text-gray-500">Separate words with commas</p>
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