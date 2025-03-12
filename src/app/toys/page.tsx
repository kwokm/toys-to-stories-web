import fs from 'fs';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ToyData } from '@/types/types';

// Function to safely read the characters.json file
function getToyData() {
  try {
    const data = fs.readFileSync('tmp/userData.json', 'utf8');
    console.log(JSON.parse(data).toys as ToyData[]);
    console.log(JSON.parse(data).toys[0] as ToyData);
    return JSON.parse(data).toys;
  } catch (error) {
    // Return an empty object if the file doesn't exist or can't be parsed
    console.error('Error reading toysData.json:', error);
    return { toyData: [] };
  }
}

export default function ToysPage() {
  // Read the toysData.json file
  const toysData = getToyData();

  // If there are no toys, redirect back to home
  if (!toysData) {
    redirect('/');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Characters</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {toysData.map((toy: any, index: number) => (
          <div key={index} className="rounded-lg border p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{toy.name}</h2>
            <p className="text-gray-600">{toy.title}</p>
            <div className="mt-2">
              <h3 className="font-medium">Character Traits:</h3>
              <ul className="list-inside list-disc">
                {toy.personalityTraits.map((trait: string, i: number) => (
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
