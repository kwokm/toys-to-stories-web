'use client';

import { useState, useEffect } from 'react';
import Stepper, { StepContent } from '@/components/setup/stepper';
import { UserData } from '@/types/types';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Settings, Trash2, Icon } from 'lucide-react';
import { chest } from '@lucide/lab';
import { toast } from 'sonner';
import { PageLayout } from '@/components/layout/PageLayout';
import { HeaderActions, ActionButton } from '@/components/layout/HeaderActions';
import { Loading } from '@/components/ui/loading';
import { getUserData, saveUserData, resetAllData } from '@/lib/dataService';

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
      const existingData = getUserData();
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
      // Get the current user data to ensure we have the latest toys
      const currentUserData = getUserData();

      // Create the updated user data, preserving the existing toys
      const updatedUserData: UserData = {
        ...userData,
        toys: currentUserData?.toys || userData.toys,
      };

      // Save the updated user data
      saveUserData(updatedUserData);
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
      // User confirmed reset, clear all data
      resetAllData();
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

  // If still loading, show the Loading component
  if (isLoading) {
    return <Loading message="Loading your settings..." />;
  }

  // Prepare custom actions for the header
  const customActions = (
    <div className="flex flex-row gap-2">
      <Button
        onClick={handleResetData}
        variant="outline"
        className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 className="mr-1 size-4" />
        {isResetting ? 'Confirm Reset' : 'Reset Data'}
      </Button>
    </div>
  );

  return (
    <PageLayout
      icon={<Settings className="h-16 w-16" />}
      title="Settings"
      description="Configure your language and reading level preferences"
      actions={
        <HeaderActions 
          showSettings={false}
          showToybox={true}
          customActions={customActions}
        />
      }
      contentClassName="px-12 pt-6"
    >
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
    </PageLayout>
  );
}
