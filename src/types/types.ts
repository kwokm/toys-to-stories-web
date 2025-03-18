// src/types/toy.ts
export interface ToyData {
  name?: string;
  title?: string;
  vocab?: VocabData[];
  key: string;
  image: string;
  personalityTraits?: string[];
}

export interface UserData {
  language: string | null;
  readingLevel: number | null;
  toys: ToyData[];
}

export interface VocabData {
  word: string;
  translation?: string;
  audioFile?: string;
}

export interface VocabWord {
  Word: string;
  Definition: string;
  'Translated Word': string;
}

export interface Story {
  id: string;
  createdAt: string;
  characters: {
    key: string;
    name?: string;
    title?: string;
    image: string;
  }[];
  Story: {
    Title: string;
    'Two Sentence Summary': string;
    'Life Lesson': string;
    'Page Contents': string[];
    'Page Contents Translated'?: string[];
    'Recommended Vocabulary Words': {
      'Vocabulary Word': VocabWord[];
    };
  };
}

export const languageCodes = {
  "en": "English",
  "es": "Spanish",
  "fr": "French",
  "de": "German",
  "it": "Italian",
  "ja": "Japanese",
  "zh": "Chinese (Mandarin)",
  "ru": "Russian",
  "ko": "Korean",
  "ar": "Arabic",
  "pt": "Portuguese",
  "tr": "Turkish",
  "nl": "Dutch",
  "vi": "Vietnamese",
  "el": "Greek",
  "pl": "Polish",
  "sv": "Swedish",
  "ga": "Irish",
  "no": "Norwegian",
  "hi": "Hindi",
};