"use client";

import { Button } from '@/components/ui/button';
import { Shapes } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function EmptyHome() {
  return (
    <div className="align-center flex h-screen w-screen">
      <div className="align-center mx-24 my-auto flex flex-col items-center justify-center gap-8">
        <Image
          className="mx-auto rounded-lg"
          src="/ToysToStoriesBanner.svg"
          alt="banner"
          width={1843}
          height={426}
        />
        <Link href="/new-user">
          <Button size="lg" className="text-lg">
            <Shapes className="h-3.5 w-3.5" />
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if localStorage is available (only runs in browser)
    if (typeof window !== 'undefined') {
      try {
        // Try to get user data from localStorage
        const userData = localStorage.getItem('userData');
        
        if (userData) {
          const parsedData = JSON.parse(userData);
          
          // Check if there are any toys in the userData
          if (parsedData.toys && parsedData.toys.length > 0) {
            // Redirect to toys page if there are toys
            router.push('/toys');
          }
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
      
      setIsLoading(false);
    }
  }, [router]);

  // Show loading state or empty home
  return isLoading ? <div>Loading...</div> : <EmptyHome />;
}
