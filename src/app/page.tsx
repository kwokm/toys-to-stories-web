import { Button } from '@/components/ui/button';
import { Shapes } from 'lucide-react';
import Image from 'next/image';
import fs from 'fs';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Function to safely read the characters.json file
function getCharacters() {
  try {
    const data = fs.readFileSync('public/characters.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return an empty object if the file doesn't exist or can't be parsed
    console.error('Error reading characters.json:', error);
    return { toys: [] };
  }
}

// Read the characters.json file
const characters = getCharacters();

function emptyHome() {
  return (
    <div className="h-screen w-screen flex align-center">
      <div className="mx-24 my-auto gap-8 flex flex-col items-center align-center justify-center">
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
  // Check if characters.json has any toys
  if (characters.toys && characters.toys.length > 0) {
    // Redirect to /characters if there are toys in the characters.json file
    redirect('/characters');
  }

  // Return the empty home page if there are no characters
  return emptyHome();
}
