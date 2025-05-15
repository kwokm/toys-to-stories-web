'use client';

import { Button } from '@/components/ui/button';
import { Shapes } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DemoDataModal } from '@/components/DemoDataModal';
import { motion } from 'framer-motion';
import { getUserData, hasStories } from '@/lib/dataService';

function EmptyHome() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Function to handle triple click on the home image
  const handleImageClick = async () => {
    // Increment click count
    setClickCount(prevCount => {
      const newCount = prevCount + 1;

      // If triple click detected
      if (newCount === 3) {
        // Open the demo data modal instead of loading data directly
        setIsDemoModalOpen(true);
        return 0; // Reset click count
      }

      // Reset click count after a delay if not a triple click
      setTimeout(() => {
        setClickCount(0);
      }, 500);

      return newCount;
    });
  };

  // Function to handle when demo data is loaded
  const handleDemoDataLoaded = () => {
    // Navigate to the toys page
    router.push('/toys');
  };

  // Function to handle Get Started button click
  const handleGetStarted = () => {
    // Check if user data exists in localStorage
    const userData = getUserData();
    
    if (userData) {
      // If user data exists, redirect to toys page
      router.push('/toys');
    } else {
      // If no user data, go to new user flow
      router.push('/new-user');
    }
  };

  return (
    <motion.div 
      className="align-center flex min-h-screen w-screen bg-orange-50 bg-[url('/assets/HomeBG.svg')] bg-no-repeat bg-cover bg-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="align-center mx-auto my-auto flex flex-col items-center justify-center gap-26 px-4">
        <div className="mx-auto flex flex-col items-center justify-center gap-10 md:gap-14">
          <div>
          <Image
            className="mx-auto rounded-md"
            src="/assets/ToysToStoriesColoredText.svg"
            alt="banner"
            width={554}
            height={128}
          />
          <div className="text-center">
            <h2 className="mb-2 text-xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-bricolage)' }}>
            Create Magical Stories with your Favourite Toys
            </h2>
          </div>
          </div>
          <Image
            className={`mx-auto rounded-md ${isLoading ? 'opacity-70' : ''} ${clickCount > 0 ? 'cursor-pointer' : ''}`}
            src="/assets/HomeImageUpdated.png"
            alt="Welcome to Toys to Stories!"
            width={554}
            height={554}
            onClick={handleImageClick}
            title="Triple-click to load demo data"
          />
          {/*
          <p className="mt-2 text-xs text-gray-500 italic">
            Triple-click the image to load demo data
          </p>
          */}
        </div>
        <Button 
          size="lg" 
          className="w-64 py-6 text-lg bg-orange-400 border-4 border-black shadow-sm hover:shadow-xl hover:bg-orange-500 transition-all duration-300"
          onClick={handleGetStarted}
        >
          <Shapes className="h-3.5 w-3.5" />
          Get Started
        </Button>
      </div>

      {/* Demo Data Modal */}
      <DemoDataModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onDataLoaded={handleDemoDataLoaded}
      />
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  /*
  useEffect(() => {
    // Check if user has existing data
    const checkExistingData = () => {
      const userData = getUserData();
      
      if (userData && userData.toys && userData.toys.length > 0) {
        // Redirect to toys page if there are toys
        router.push('/toys');
      } else {
        setIsLoading(false);
      }
    };
    
    checkExistingData();
  }, [router]);
  */
 
  // Show loading state or empty home
  return isLoading ? <div className="flex min-h-screen items-center justify-center">Loading...</div> : <EmptyHome />;
}
