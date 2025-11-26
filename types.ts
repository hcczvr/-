export enum DifficultyLevel {
  PRIMARY = 'Primary School (Elementary)',
  MIDDLE = 'Middle School (Junior High)',
  HIGH = 'High School (Senior High)'
}

export interface WordItem {
  word: string;
  ipa: string;
}

export interface CategorizedResults {
  start: WordItem[];
  middle: WordItem[];
  end: WordItem[];
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';