'use client';

import FlagCascade from './atoms/flag-cascade';
import { Card } from './ui/card';
import ReactCountryFlag from 'react-country-flag';
import { cn } from '../lib/utils';
import { Check, ChevronsUpDown, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    value: 'russian',
    label: 'Russian',
  },
  {
    value: 'arabic',
    label: 'Arabic',
  },
  {
    value: 'portuguese',
    label: 'Portuguese',
  },
  {
    value: 'turkish',
    label: 'Turkish',
  },
  {
    value: 'dutch',
    label: 'Dutch',
  },
  {
    value: 'vietnamese',
    label: 'Vietnamese',
  },
  {
    value: 'greek',
    label: 'Greek',
  },
  {
    value: 'polish',
    label: 'Polish',
  },
  {
    value: 'swedish',
    label: 'Swedish',
  },
  {
    value: 'latin',
    label: 'Latin',
  },
  {
    value: 'irish',
    label: 'Irish',
  },
  {
    value: 'norwegian',
    label: 'Norwegian',
  },
];

function OtherLanguageSelector({ onSelect }: { onSelect: (language: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? languages.find(language => language.value === value)?.label
            : 'Select language...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." className="h-9" />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map(language => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={currentValue => {
                    setValue(currentValue === value ? '' : currentValue);
                    const selectedLanguage = languages.find(lang => lang.value === currentValue)?.label;
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
        'flex flex-row gap-4 items-center justify-center p-4 cursor-pointer transition-all duration-200',
        selected ? 'bg-primary/10 border-primary shadow-md' : 'hover:bg-secondary/10'
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
  onSelect,
}: {
  title: string;
  description: string;
  ageRange: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <Card
      className={cn(
        'flex flex-col gap-4 w-full p-4 cursor-pointer transition-all duration-200',
        selected ? 'bg-primary/10 border-primary shadow-md' : 'hover:bg-secondary/10'
      )}
      onClick={onSelect}
    >
      <div className="flex flex-col gap-2">
      <p className="text-left text-2xl font-semibold text-slate-800">{title}</p>
      <div className="flex flex-row gap-1"><Baby className="w-3.5 h-3.5" /><p className="leading-none text-sm text-slate-600">{ageRange}</p></div>
      </div>
      <p className="text-left text-base text-slate-700">{description}</p>
    </Card>
  );
}

export { LanguageCard, OtherLanguageSelector, ReadingLevelCard };
