'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToyData, UserData } from '@/types/types';
import { useState, useEffect } from 'react';
import { buildToyCards } from '@/components/toys/toy-cards';
import Image from 'next/image';

export default function ToysPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="container mx-16 flex min-h-screen items-center justify-center bg-orange-50 py-8">
        <div className="text-center">
          <p className="mb-4 text-xl">No characters found</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen min-h-screen bg-orange-50">
      {/* Header Shelf  */}
      <div className="rounded-b-2xl bg-white px-12 py-12 border-b-orange-300 border">
        <div className="flex flex-row gap-2">
          <Image className="my-auto" src="/assets/treasurechest.svg" alt="Treasure Chest" width={64} height={64} />
          <div className="flex gap-2 flex-col">
            <h1 className=" font-bricolage text-4xl font-extrabold">Your Toybox</h1>
            <p className="text-base text-gray-600">
            Each toy you add here syncs directly to the soundboard!</p>
          </div>
        </div>

      </div>
      {/* End Header Shelf  */}

      {/* Start Lower Area */}
      <div className="px-12 pt-12">
        {buildToyCards(userData.toys)}
        <div className="mt-8">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
      {/* End Toy Cards */}
    </div>
  );
}
