import { Card } from '../ui/card';
import Image from 'next/image';
import { ToyData } from '@/types/types';
import { PlusCircleIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const buildToyCards = (
  toys: ToyData[],
  selectedToys: string[] = [],
  onToySelect?: (toyKey: string) => void
) => {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
      {toys.map((toy, index) => (
        <ToyCard
          key={toy.key}
          toy={toy}
          isSelected={selectedToys.includes(toy.key)}
          onSelect={onToySelect}
        />
      ))}
      <EmptyToyCard variant="plus" />
    </div>
  );
};

export const ToyCard = ({
  toy,
  isSelected = false,
  onSelect,
  className,
}: {
  toy: ToyData;
  isSelected?: boolean;
  onSelect?: (toyKey: string) => void;
  className?: string;
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(toy.key);
    }
  };

  const hoverClasses =
    'hover:rotate-x-4 hover:rotate-z-2 motion-translate-y-loop-10 motion-duration-2000 motion-translate-x-loop-5 motion-ease-in-out rotate-2';
  const selectedClasses =
    'ring-4 ring-orange-500 shadow-lg rotate-x-8 rotate-y-10 rotate-z-3 duration-300';

  return (
    <Card
      className={cn(
        `flex rotate-2 cursor-pointer flex-col items-center gap-3 rounded-xs p-8 transition-all duration-500 ${
          isSelected ? selectedClasses : hoverClasses
        }`,
        className
      )}
      onClick={handleClick}
    >
      {toy.image ? (
        <Image
          src={toy.image}
          alt={`${toy.name} the ${toy.title}`}
          width={160}
          height={160}
          className="size-40 rounded-md object-cover"
        />
      ) : (
        <div className="h-20 w-20 rounded-md border border-gray-300 bg-gray-100"></div>
      )}
      <div className="flex flex-col items-center gap-0">
        <div className="mx-4 h-auto border-none text-center font-lily font-bold text-zinc-900 shadow-none placeholder:text-gray-400 md:text-4xl">
          {toy.name}
        </div>
        <p className="mt-[-2] text-gray-400">{toy.name && 'the'}</p>
        <div className="h-auto border-none text-center font-medium text-zinc-500 shadow-none placeholder:text-gray-400 md:text-xl">
          {toy.title}
        </div>
      </div>
    </Card>
  );
};

export const EmptyToyCard = ({ variant }: { variant?: 'small' | 'large' | 'plus' }) => {
  let imageSize = 80;

  switch (variant) {
    case 'small':
      imageSize = 160;
      break;
    case 'large':
      imageSize = 300;
      break;
    case 'plus':
      imageSize = 160;
      break;
    default:
      imageSize = 160;
      break;
  }

  if (variant === 'plus') {
    return (
      <div className="relative mx-3 h-full rounded-md">
        <div className="absolute top-1/2 left-1/2 z-2 -translate-x-1/2 -translate-y-1/2 transform">
          <Link href="/toys/new">
            <Button className="rotate-2 shadow-md">
              <PlusCircleIcon className="h-10 w-10 text-white" />
              <p className="text-white">Add a New Toy</p>
            </Button>
          </Link>
        </div>
        <Card className="flex rotate-2 flex-col items-center gap-3 rounded-md p-8 blur-[2px]">
          <div className="align-center flex h-40 w-40 items-center justify-center rounded-md border border-gray-300 bg-gray-100">
            <Image
              className="mx-auto my-auto"
              src="/assets/toyPlaceholder.svg"
              alt="Toy Card"
              width={80}
              height={80}
            />
          </div>
          <div className="h-30"></div>
        </Card>
      </div>
    );
  }
  return (
    <Card className="flex rotate-2 flex-col items-center gap-3 rounded-xs p-4">
      <div className="align-center flex h-40 w-40 items-center justify-center rounded-md border border-gray-300 bg-gray-100">
        <Image
          className="mx-auto my-auto"
          src="/assets/toyPlaceholder.svg"
          alt="Toy Card"
          width={imageSize}
          height={imageSize}
        />
      </div>
      <div className="flex flex-col items-center gap-0">
        <div className="h-10"></div>
      </div>
    </Card>
  );
};
