'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Stepper, { StepContent } from '@/components/setup/stepper';
import { UserData } from '@/types/types';
import { useRouter } from 'next/navigation';
import { getExistingUserData } from '@/lib/cleanup';
import { saveUserDataToLocalStorage } from '@/lib/saveData';
import { Button } from '@/components/ui/button';
import { Settings, Trash2, Icon } from 'lucide-react';
import { chest } from '@lucide/lab';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from 'sonner';

// Import the step components
import LanguageSelection from '@/components/setup/LanguageSelection';
import ReadingLevelSelection from '@/components/setup/ReadingLevelSelection';

// Define the steps for the stepper
const steps = [{ label: 'Choose Language' }, { label: 'Reading Level' }];

export default function SettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    language: null,
    readingLevel: null,
    toys: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Load existing user data on component mount
  useEffect(() => {
    const loadExistingUserData = () => {
      const existingData = getExistingUserData();
      if (existingData) {
        setUserData(existingData);
      }
      setIsLoading(false);
    };

    loadExistingUserData();
  }, []);

  // Function to handle saving settings
  const handleSaveSettings = async () => {
    try {
      // Get the current user data from localStorage to ensure we have the latest toys
      const currentUserData = getExistingUserData();

      // Create the updated user data, preserving the existing toys
      const updatedUserData: UserData = {
        ...userData,
        toys: currentUserData?.toys || userData.toys,
      };

      // Save the updated user data to localStorage
      await saveUserDataToLocalStorage(updatedUserData);
      toast.success('Settings saved successfully');

      // Prepare the soundboard with the updated user data
      fetch('/api/soundboard-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: updatedUserData,
        }),
      });

      // Navigate to the toys page
      router.push('/toys');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  // Function to handle resetting user data
  const handleResetData = () => {
    if (isResetting) {
      // User confirmed reset, clear localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('stories');
      localStorage.removeItem('selectedToys');
      localStorage.removeItem('currentStoryId');

      toast.success('All data has been reset');

      // Navigate to the home page
      router.push('/');
    } else {
      // First click, ask for confirmation
      setIsResetting(true);
      toast.warning('Click "Reset Data" again to confirm', {
        duration: 5000,
      });

      // Reset the confirmation state after 5 seconds
      setTimeout(() => {
        setIsResetting(false);
      }, 5000);
    }
  };

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] motion-opacity-out-0 items-center justify-center py-8 motion-ease-out motion-duration-1000">
        <div className="text-center">
          <p className="text-xl">Loading your settings...</p>
        </div>
      </div>
    );
  }

  // Prepare the header actions
  const headerActions = (
    <div className="flex flex-row gap-2">
      <Button
        onClick={handleResetData}
        variant="outline"
        className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 className="mr-1 size-4" />
        {isResetting ? 'Confirm Reset' : 'Reset Data'}
      </Button>
      <Button
        onClick={() => router.push('/toys')}
        variant="default"
        className="ml-2 flex items-center gap-1 bg-orange-500 hover:bg-orange-600"
      >
        <Icon iconNode={chest} className="mr-1 size-5" />
        Back to Toybox
      </Button>
    </div>
  );

  return (
    <div className="h-full min-h-screen bg-orange-50 pb-24">
      {/* Header using PageHeader component */}
      <PageHeader
        icon={<Settings className="h-16 w-16" />}
        title="Settings"
        description="Configure your language and reading level preferences"
        actions={headerActions}
      />

      {/* Content area with margin */}
      <div className="px-12 pt-6">
        <Stepper
          steps={steps}
          handleComplete={handleSaveSettings}
          isStepValid={[
            userData.language !== null, // Step 1: Language selected
            userData.readingLevel !== null, // Step 2: Reading level selected
          ]}
          isLoading={[
            false, // Step 1: No loading state
            false, // Step 2: No loading state
          ]}
        >
          <StepContent>
            <LanguageSelection userData={userData} setUserData={setUserData} />
          </StepContent>
          <StepContent>
            <ReadingLevelSelection userData={userData} setUserData={setUserData} />
          </StepContent>
        </Stepper>
      </div>
    </div>
  );
}
