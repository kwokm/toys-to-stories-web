import Image from 'next/image';
import { cn } from '@/lib/utils';

// Book color utilities
export const getRandomBookColor = () => {
  const colors = [
    'bg-orange-600',
    'bg-amber-700',
    'bg-yellow-700',
    'bg-red-800',
    'bg-rose-700',
    'bg-pink-800',
    'bg-emerald-700',
    'bg-teal-700',
    'bg-cyan-800',
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

export const getRandomSpineColor = () => {
  const colors = [
    'bg-orange-900',
    'bg-amber-900',
    'bg-yellow-900',
    'bg-red-900',
    'bg-rose-900',
    'bg-pink-900',
    'bg-emerald-900',
    'bg-teal-900',
    'bg-cyan-950',
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

type BookVisualizationProps = {
  title?: string;
  summary?: string;
  date?: string;
  coverColor?: string;
  spineColor?: string;
  className?: string;
  children?: React.ReactNode;
  isEmpty?: boolean;
};

export const BookVisualization = ({
  title,
  summary,
  date,
  coverColor = getRandomBookColor(),
  spineColor = getRandomSpineColor(),
  className,
  children,
  isEmpty = false,
}: BookVisualizationProps) => {
  if (isEmpty) {
    return (
      <div className={cn("relative h-[350px] w-[250px] opacity-70 blur-[10px]", className)}>
        {/* Book spine */}
        <div className="absolute top-0 left-0 h-full w-[35px] rounded-l-md bg-gray-400 shadow-inner"></div>

        {/* Book cover */}
        <div className="absolute top-0 right-0 flex h-full w-[225px] flex-col rounded-r-md bg-gray-300 p-6">
          {/* Placeholder for title */}
          <div className="mx-auto mt-2 mb-6 h-8 w-3/4 rounded bg-gray-400/50"></div>

          {/* Placeholder for image */}
          <div className="mx-auto">
            <div className="h-[100px] w-[100px] rounded-full bg-gray-400/50 shadow-inner"></div>
          </div>

          {/* Placeholder for text */}
          <div className="mt-6 h-4 w-full rounded bg-gray-400/50"></div>
          <div className="mx-auto mt-2 h-4 w-5/6 rounded bg-gray-400/50"></div>
          <div className="mx-auto mt-2 h-4 w-4/6 rounded bg-gray-400/50"></div>
          <div className="mx-auto mt-2 h-4 w-3/4 rounded bg-gray-400/50"></div>
        </div>

        {/* Book pages - right edge */}
        <div className="absolute top-[5px] right-0 bottom-[5px] w-[5px] rounded-r-sm bg-white/90"></div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-[350px] w-[250px] shadow-xl", className)}>
      {/* Book spine */}
      <div
        className={`absolute top-0 left-0 h-full w-[35px] rounded-l-md ${spineColor} shadow-inner`}
      >
        {/* No spine title */}
      </div>

      {/* Book cover */}
      <div
        className={`absolute top-0 right-0 h-full w-[225px] rounded-r-md ${coverColor} flex flex-col p-6`}
      >
        {/* Book title */}
        {title && (
          <h3 className="mt-2 mb-6 line-clamp-2 text-center font-bricolage text-2xl font-bold text-white">
            {title}
          </h3>
        )}

        {/* Character images or custom content */}
        <div className="relative mx-auto">
          {children}
        </div>

        {/* Story summary */}
        {summary && (
          <p className="mt-6 line-clamp-4 text-center text-sm font-medium text-white">
            {summary}
          </p>
        )}

        {/* Date at the bottom */}
        {date && (
          <p className="mt-auto text-center text-xs text-white/60">
            {date}
          </p>
        )}
      </div>

      {/* Book pages - right edge */}
      <div className="absolute top-[5px] right-0 bottom-[5px] w-[5px] rounded-r-sm bg-white/90"></div>
    </div>
  );
};

export const CharacterPortraits = ({ 
  characters 
}: { 
  characters: Array<{ key: string; image: string; name?: string; title?: string }> 
}) => {
  if (!characters || characters.length === 0) {
    return (
      <div className="h-[100px] w-[100px] overflow-hidden rounded-full bg-white p-1 shadow-inner">
        <Image
          src="/assets/storyPlaceholder.svg"
          alt="Story placeholder"
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
      </div>
    );
  }

  // If 3 or fewer characters, show all of them
  if (characters.length <= 3) {
    return (
      <div className="flex items-center justify-center">
        {characters.map((character, index) => (
          <div
            key={character.key}
            className={`h-[70px] w-[70px] overflow-hidden rounded-full bg-white p-1 shadow-inner ${
              index > 0 ? '-ml-4' : ''
            } border-2 border-white`}
            style={{ zIndex: characters.length - index }}
          >
            <Image
              src={character.image}
              alt={character.name || character.title || 'Character'}
              width={70}
              height={70}
              className="rounded-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  // If more than 3 characters, show the first one with a +X badge
  return (
    <>
      <div className="h-[100px] w-[100px] overflow-hidden rounded-full bg-white p-1 shadow-inner">
        <Image
          src={characters[0].image}
          alt={characters[0].name || characters[0].title || 'Character'}
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
      </div>

      {/* Character count badge for more than 3 characters */}
      <div className="absolute -right-2 -bottom-2 rounded-full border border-orange-300 bg-white p-1 shadow-md">
        <p className="text-xs font-medium text-orange-800">
          +{characters.length - 1}
        </p>
      </div>
    </>
  );
}; 