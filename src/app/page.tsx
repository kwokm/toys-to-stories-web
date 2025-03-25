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
      className="align-center flex min-h-screen w-screen pb-24 bg-orange-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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
            className={`mx-auto rounded-md ${isLoading ? 'opacity-70' : ''} ${clickCount > 0 ? 'cursor-pointer' : ''} transition-all duration-300 hover:shadow-lg`}
            src="/assets/HomeImage.webp"
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
          className="w-64 py-6 text-lg"
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
