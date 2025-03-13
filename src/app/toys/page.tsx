'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToyData, UserData } from '@/types/types';
import { useState, useEffect } from 'react';
import { buildToyCards } from '@/components/toys/toy-cards';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { ScrollText } from 'lucide-react';

export default function ToysPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedToys, setSelectedToys] = useState<string[]>([]);

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
    // Save selected toys to localStorage
    localStorage.setItem('selectedToys', JSON.stringify(selectedToys));
    
    // Navigate to the stories/new page
    router.push('/stories/new');
  };

  useEffect(() => {
    // Function to safely get data from localStorage
    // This needs to be inside useEffect because localStorage is only available in the browser
    const getUserDataFromLocalStorage = () => {
      if (typeof window === 'undefined') {
        return null; // Return null during server-side rendering
      }

      try {
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          console.log('No user data found in localStorage');
          return null;
        }

        const parsedData = JSON.parse(userDataString) as UserData;
        console.log('User data from localStorage:', parsedData);

        return parsedData;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    };

    // Get the data from localStorage
    const userDataFromStorage = getUserDataFromLocalStorage();
    setUserData(userDataFromStorage);
    setIsLoading(false);
  }, []);

  // Handle redirect in a separate useEffect to avoid React state update warnings
  /*
  useEffect(() => {
    if (!isLoading && (!userData || userData.toys.length === 0)) {
      router.push('/');
    }
  }, [isLoading, userData, router]); */

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center py-8">
        <div className="text-center">
          <p className="text-xl">Loading your characters...</p>
        </div>
      </div>
    );
  }

  // If there are no toys, show a message (the redirect should happen in useEffect)
  if (!userData || !userData.toys || userData.toys.length === 0) {
    return (
      <div className="container mx-16 flex min-h-screen h-auto items-center justify-center bg-orange-50 py-8">
        <div className="text-center">
          <p className="mb-4 text-xl">No characters found</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen h-full pb-24 bg-orange-50">
      {/* Header Shelf  */}
      <div className="flex flex-row rounded-b-2xl bg-white px-12 py-12 border-b-orange-300 border">
        <div className="flex flex-row gap-2">
          <Image className="fill-orange-300 my-auto" src="/assets/treasurechest.svg" alt="Treasure Chest" width={64} height={64} />
          <div className="flex gap-2 flex-col">
            <h1 className=" font-bricolage text-4xl text-slate-900 not-only:font-[900]">Your Toybox</h1>
            <p className="ml-1 text-base text-gray-600">
            Each toy you add here syncs directly to the soundboard!</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 ml-auto mt-auto">
          <Button 
            disabled={selectedToys.length === 0} 
            onClick={handleCreateStory}
            className={`${selectedToys.length > 0 ? 'grayscale-0 motion-scale-loop-[102%] motion-duration-[1500ms]' : ''}grayscale-100 transition-all duration-[1500ms] my-auto mesh-gradient overflow-clip text-black ml-auto`}
          >
            <ScrollText className="size-4" />Create a Story
          </Button>
        <p className={`${selectedToys.length === 0 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 my-auto text-[13px] ml-4`}>Tap some toys to get started!</p>
        </div>
      </div>
      {/* End Header Shelf  */}

      {/* Start Lower Area */}
      <div className="px-12 pt-12">
        {buildToyCards(userData?.toys || [], selectedToys, handleToySelection)}
      </div>
      {/* End Toy Cards */}

      {/* Language Toggle 
      <div className="fixed bottom-8 right-8">
          <div className="p-4 bg-white rounded-full shadow-md flex gap-2 flex-row">
            <Switch className="my-auto"></Switch>
            <p className="text-sm font-medium">
            Language Learning Mode</p>
          </div>
      </div> */}
      
    </div>
  );
}
