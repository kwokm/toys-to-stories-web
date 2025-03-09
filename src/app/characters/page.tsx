import fs from 'fs';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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

export default function CharactersPage() {
  // Read the characters.json file
  const characters = getCharacters();

  // If there are no characters, redirect back to home
  if (!characters.toys || characters.toys.length === 0) {
    redirect('/');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Characters</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.toys.map((toy: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{toy.name}</h2>
            <p className="text-gray-600">{toy.title}</p>
            <div className="mt-2">
              <h3 className="font-medium">Character Traits:</h3>
              <ul className="list-disc list-inside">
                {toy['character traits'].map((trait: string, i: number) => (
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
