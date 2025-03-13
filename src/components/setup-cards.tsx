'use client';

import FlagCascade from './atoms/flag-cascade';
import { Card } from './ui/card';
import ReactCountryFlag from 'react-country-flag';
import { cn } from '../lib/utils';
import { Check, ChevronsUpDown, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React from 'react';

const languages = [
  {
    value: 'RU',
    label: 'Russian',
  },
  {
    value: 'AR',
    label: 'Arabic',
  },
  {
    value: 'PT',
    label: 'Portuguese',
  },
  {
    value: 'TR',
    label: 'Turkish',
  },
  {
    value: 'NL',
    label: 'Dutch',
  },
  {
    value: 'VN',
    label: 'Vietnamese',
  },
  {
    value: 'GR',
    label: 'Greek',
  },
  {
    value: 'PL',
    label: 'Polish',
  },
  {
    value: 'SE',
    label: 'Swedish',
  },
  {
    value: 'IR',
    label: 'Irish',
  },
  {
    value: 'NO',
    label: 'Norwegian',
  },
];

function OtherLanguageSelector({
  onSelect,
  className,
}: {
  onSelect: (language: string) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn('w-[200px] justify-between', className)}
          variant="outline"
          role="combobox"
          aria-expanded={open}
        >
          {value
            ? languages.find(language => language.value === value)?.label
            : 'Other Language...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." className={cn('h-9')} />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map(language => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={currentValue => {
                    setValue(currentValue === value ? '' : currentValue);
                    const selectedLanguage = languages.find(
                      lang => lang.value === currentValue
                    )?.label;
                    if (selectedLanguage && currentValue !== value) {
                      onSelect(selectedLanguage);
                    }
                    setOpen(false);
                  }}
                >
                  {language.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === language.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function LanguageCard({
  language,
  countryCodes,
  selected = false,
  onSelect,
}: {
  language: string;
  countryCodes: string[];
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <Card
      className={cn(
        'flex cursor-pointer flex-row items-center justify-center gap-4 p-4 transition-all duration-200',
        selected ? 'border-orange-500 bg-orange-100 shadow-md' : 'hover:bg-orange-50'
      )}
      onClick={onSelect}
    >
      {countryCodes.length === 1 ? (
        <ReactCountryFlag
          className="emojiFlag"
          style={{
            fontSize: '4em',
            lineHeight: '1em',
          }}
          countryCode={countryCodes[0]}
        />
      ) : (
        <FlagCascade>
          {countryCodes.map(countryCode => (
            <ReactCountryFlag
              className="emojiFlag"
              countryCode={countryCode}
              style={{
                fontSize: `${countryCodes.length === 2 ? '3.5em' : '3em'}`,
                lineHeight: '1em',
              }}
            />
          ))}
        </FlagCascade>
      )}
      <p className="text-xl font-bold">{language}</p>
    </Card>
  );
}

function ReadingLevelCard({
  title,
  description,
  ageRange,
  selected = false,
  stepImage,
  onSelect,
}: {
  title: string;
  stepImage: string;
  description: string;
  ageRange: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <Card
      className={cn(
        'flex w-full cursor-pointer flex-col gap-4 p-4 transition-all duration-200',
        selected ? 'border-orange-500 bg-orange-100 shadow-md' : 'hover:bg-orange-50'
      )}
      onClick={onSelect}
    >
      <div className="flex flex-row gap-6">
        <div className="flex w-[92px] flex-col gap-2">
          <Image src={stepImage} className="mx-auto h-16 w-16" alt={title} width={64} height={64} />
          <p className="text-sm leading-none text-slate-600">{ageRange}</p>
        </div>
        <div className="my-auto flex flex-col gap-2">
          <p className="text-left text-2xl font-semibold text-slate-800">{title}</p>
          <p className="text-left text-base text-slate-700">{description}</p>
        </div>
        <div className="flex flex-row gap-1"></div>
      </div>
    </Card>
  );
}

export { LanguageCard, OtherLanguageSelector, ReadingLevelCard };
