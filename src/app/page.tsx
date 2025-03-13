'use client';

import { Button } from '@/components/ui/button';
import { Shapes } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function EmptyHome() {
  return (
    <div className="align-center flex h-screen w-screen bg-orange-50">
      <div className="align-center mx-auto my-auto flex flex-col items-center justify-center gap-26">
        <div className="mx-auto flex flex-col items-center justify-center gap-14">
          <Image
            className="mx-auto rounded-md"
            src="/assets/ToysToStoriesColoredText.svg"
            alt="banner"
            width={554}
            height={128}
          />
          <div className="mb-4 text-center">
            <h2 className="mb-2 text-3xl font-bold" style={{ fontFamily: 'var(--font-bricolage)' }}>
              Turn Toys Into Stories
            </h2>
            <p className="text-lg" style={{ fontFamily: 'var(--font-figtree)' }}>
              Create magical stories with your favorite toys
            </p>
          </div>
          <Image
            className="mx-auto rounded-md"
            src="/assets/HomeImage.webp"
            alt="Welcome to Toys to Stories!"
            width={554}
            height={554}
          />
        </div>
        <Link href="/new-user">
          <Button size="lg" className="w-64 py-6 text-lg">
            <Shapes className="h-3.5 w-3.5" />
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  /*
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
  return isLoading ? <div>Loading...</div> : <EmptyHome />; */
  return <EmptyHome />;
}
