// src/types/toy.ts
export interface ToyData {
    name?: string;
    title?: string;
    vocab?: VocabData[];
    key: string;
    image: string;
    bmpUrl?: string;
    personalityTraits?: string[];
  }

  export interface UserData {
    language: string | null;
    readingLevel: number | null;
    toys: ToyData[];
    userDataBlobUrl?: string;
  }

  export interface VocabData {
    word: string;
    translation?: string;
    pronounceUrl?: string;
    translatePronounceUrl?: string;
    audioFile?: string;
  }