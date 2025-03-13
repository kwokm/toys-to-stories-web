'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Icon } from 'lucide-react';
import { chest } from '@lucide/lab';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BlobItem {
  url: string;
  pathname: string;
  downloadUrl: string;
  uploadedAt: string;
}

interface DemoDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: () => void;
}

export function DemoDataModal({ isOpen, onClose, onDataLoaded }: DemoDataModalProps) {
  const router = useRouter();
  const [userDataBlobs, setUserDataBlobs] = useState<BlobItem[]>([]);
  const [storiesBlobs, setStoriesBlobs] = useState<BlobItem[]>([]);
  const [selectedUserData, setSelectedUserData] = useState<string>('');
  const [selectedStories, setSelectedStories] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // Fetch available blobs when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableBlobs();
    }
  }, [isOpen]);

  // Simulate loading progress
  useEffect(() => {
    if (isLoadingData) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(0);
    }
  }, [isLoadingData]);

  // Function to fetch available blobs from the API
  const fetchAvailableBlobs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/demo-data/list');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch demo data list');
      }

      const data = await response.json();

      // Sort blobs by uploadedAt (newest first)
      const sortedUserDataBlobs = data.userDataBlobs.sort(
        (a: BlobItem, b: BlobItem) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

      const sortedStoriesBlobs = data.storiesBlobs.sort(
        (a: BlobItem, b: BlobItem) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

      setUserDataBlobs(sortedUserDataBlobs);
      setStoriesBlobs(sortedStoriesBlobs);

      // Auto-select the most recent blobs
      if (sortedUserDataBlobs.length > 0) {
        setSelectedUserData(sortedUserDataBlobs[0].url);
      }

      if (sortedStoriesBlobs.length > 0) {
        setSelectedStories(sortedStoriesBlobs[0].url);
      }
    } catch (error) {
      console.error('Error fetching demo data list:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch demo data list');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load selected demo data
  const loadSelectedDemoData = async () => {
    if (!selectedUserData || !selectedStories) {
      toast.error('Please select both user data and stories');
      return;
    }

    try {
      setIsLoadingData(true);
      setLoadingProgress(10);

      // Fetch the selected user data and stories
      const [userDataResponse, storiesResponse] = await Promise.all([
        fetch(selectedUserData),
        fetch(selectedStories),
      ]);

      setLoadingProgress(60);

      if (!userDataResponse.ok || !storiesResponse.ok) {
        throw new Error('Failed to fetch selected demo data');
      }

      const userData = await userDataResponse.json();
      const stories = await storiesResponse.json();

      setLoadingProgress(80);

      // Save the demo data to localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('stories', JSON.stringify(stories));

      setLoadingProgress(100);

      toast.success('Demo data loaded successfully!');

      // Close the modal and notify parent
      onClose();
      onDataLoaded();
    } catch (error) {
      console.error('Error loading selected demo data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load selected demo data');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Find the selected blob object
  const getSelectedUserDataBlob = () => {
    return userDataBlobs.find(blob => blob.url === selectedUserData);
  };

  const getSelectedStoriesBlob = () => {
    return storiesBlobs.find(blob => blob.url === selectedStories);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-bricolage text-xl">Select Demo Data</DialogTitle>
          <DialogDescription>
            Choose which user data and stories you want to load.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <div className="py-4 text-center">
            <p className="mb-4 text-red-500">{error}</p>
            <Button onClick={fetchAvailableBlobs}>Try Again</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="userData" className="text-sm font-medium">
                  User Data
                </label>
                {getSelectedUserDataBlob() && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex cursor-help items-center gap-1 text-xs text-zinc-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(getSelectedUserDataBlob()!.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Uploaded:{' '}
                          {new Date(getSelectedUserDataBlob()!.uploadedAt).toLocaleString()}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Select
                value={selectedUserData}
                onValueChange={setSelectedUserData}
                disabled={userDataBlobs.length === 0}
              >
                <SelectTrigger id="userData" className="h-auto w-full py-2">
                  <SelectValue placeholder="Select user data">
                    {selectedUserData && getSelectedUserDataBlob() && (
                      <div className="flex w-full flex-col items-start">
                        <span className="text-left font-medium">
                          {getSelectedUserDataBlob()!.pathname.split('/').pop()}
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {userDataBlobs.map(blob => (
                    <SelectItem key={blob.url} value={blob.url} className="py-2">
                      <div className="flex w-full flex-col items-start">
                        <span className="text-left font-medium">
                          {blob.pathname.split('/').pop()}
                        </span>
                        <span className="mt-1 text-xs text-zinc-500">
                          {new Date(blob.uploadedAt).toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="stories" className="text-sm font-medium">
                  Stories
                </label>
                {getSelectedStoriesBlob() && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex cursor-help items-center gap-1 text-xs text-zinc-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(getSelectedStoriesBlob()!.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Uploaded:{' '}
                          {new Date(getSelectedStoriesBlob()!.uploadedAt).toLocaleString()}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Select
                value={selectedStories}
                onValueChange={setSelectedStories}
                disabled={storiesBlobs.length === 0}
              >
                <SelectTrigger id="stories" className="h-auto w-full py-2">
                  <SelectValue placeholder="Select stories">
                    {selectedStories && getSelectedStoriesBlob() && (
                      <div className="flex w-full flex-col items-start">
                        <span className="text-left font-medium">
                          {getSelectedStoriesBlob()!.pathname.split('/').pop()}
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {storiesBlobs.map(blob => (
                    <SelectItem key={blob.url} value={blob.url} className="py-2">
                      <div className="flex w-full flex-col items-start">
                        <span className="text-left font-medium">
                          {blob.pathname.split('/').pop()}
                        </span>
                        <span className="mt-1 text-xs text-zinc-500">
                          {new Date(blob.uploadedAt).toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoadingData && (
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-center text-xs text-zinc-500">Loading demo data...</p>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  router.push('/toys');
                }}
                disabled={isLoadingData}
              >
                <Icon iconNode={chest} />
                Skip to Toybox
              </Button>
              <Button
                onClick={loadSelectedDemoData}
                disabled={!selectedUserData || !selectedStories || isLoadingData}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                {isLoadingData ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load Selected Data'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
