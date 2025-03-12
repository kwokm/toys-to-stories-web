"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToyData, UserData } from '@/types/types';
import { useState, useEffect } from 'react';

export default function ToysPage() {
  const router = useRouter();
  const [toysData, setToysData] = useState<ToyData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to safely get data from localStorage
    // This needs to be inside useEffect because localStorage is only available in the browser
    const getToyDataFromLocalStorage = () => {
      if (typeof window === 'undefined') {
        return null; // Return null during server-side rendering
      }
      
      try {
        const userData = localStorage.getItem('userData');
        if (!userData) {
          console.log('No user data found in localStorage');
          return null;
        }
        
        const parsedData = JSON.parse(userData) as UserData;
        console.log('User data from localStorage:', parsedData);
        
        if (parsedData.toys && Array.isArray(parsedData.toys)) {
          return parsedData.toys;
        }
        
        return null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    };

    // Get the data from localStorage
    const toys = getToyDataFromLocalStorage();
    setToysData(toys);
    setIsLoading(false);
  }, []);

  // Handle redirect in a separate useEffect to avoid React state update warnings
  useEffect(() => {
    if (!isLoading && (!toysData || toysData.length === 0)) {
      router.push('/');
    }
  }, [isLoading, toysData, router]);

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-xl">Loading your characters...</p>
        </div>
      </div>
    );
  }

  // If there are no toys, show a message (the redirect should happen in useEffect)
  if (!toysData || toysData.length === 0) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-xl mb-4">No characters found</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Characters</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {toysData.map((toy: ToyData, index: number) => (
          <div key={index} className="rounded-lg border p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{toy.name}</h2>
            <p className="text-gray-600">{toy.title}</p>
            {toy.image && (
              <div className="my-3">
                <img 
                  src={toy.image} 
                  alt={toy.name || 'Character image'} 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
            <div className="mt-2">
              <h3 className="font-medium">Character Traits:</h3>
              <ul className="list-inside list-disc">
                {toy.personalityTraits?.map((trait: string, i: number) => (
                  <li key={i}>{trait}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
