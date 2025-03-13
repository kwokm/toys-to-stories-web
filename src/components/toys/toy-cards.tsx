import { Card } from '../ui/card';
import Image from 'next/image';
import { ToyData } from '@/types/types';
import { PlusCircleIcon, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const buildToyCards = (
  toys: ToyData[],
  selectedToys: string[] = [],
  onToySelect?: (toyKey: string) => void,
  onToyEdit?: (toyKey: string) => void,
  onToyDelete?: (toyKey: string) => void
) => {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
      {toys.map((toy, index) => (
        <ToyCard
          key={toy.key}
          toy={toy}
          isSelected={selectedToys.includes(toy.key)}
          onSelect={onToySelect}
          onEdit={onToyEdit}
          onDelete={onToyDelete}
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
  onEdit,
  onDelete,
  className,
}: {
  toy: ToyData;
  isSelected?: boolean;
  onSelect?: (toyKey: string) => void;
  onEdit?: (toyKey: string) => void;
  onDelete?: (toyKey: string) => void;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect(toy.key);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when clicking edit
    if (onEdit) {
      onEdit(toy.key);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when clicking delete
    if (onDelete) {
      onDelete(toy.key);
    }
  };

  const hoverClasses =
    'hover:rotate-x-4 hover:rotate-z-2';
  /* motion-translate-y-loop-10 motion-duration-2000 motion-translate-x-loop-5 motion-ease-in-out rotate-2 */

  const selectedClasses =
    'ring-4 ring-orange-500 shadow-lg rotate-x-8 rotate-y-10 rotate-z-3 duration-300';

  // Show action buttons when hovered or selected
  const showActions = isHovered || isSelected;

  return (
    <Card
      className={cn(
        `flex rotate-2 cursor-pointer flex-col items-center gap-3 rounded-xs p-8 transition-all duration-500 ${
          isSelected ? selectedClasses : hoverClasses
        } relative group`,
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {toy.image ? (
        <Image
          src={toy.image}
          alt={`${toy.name} the ${toy.title}`}
          width={160}
          height={160}
          className="size-40 rounded-md object-cover transition-all duration-300 group-hover:shadow-md"
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

      {/* Action buttons - visible on hover or when selected */}
      <AnimatePresence>
        {showActions && (
          <motion.div 
            className="absolute bottom-3 right-3 flex gap-2"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {onEdit && (
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full bg-white hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                  onClick={handleEdit}
                  title="Edit toy"
                >
                  <Pencil className="h-4 w-4 text-orange-600" />
                </Button>
              </motion.div>
            )}
            {onDelete && (
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full bg-white hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                  onClick={handleDelete}
                  title="Delete toy"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
