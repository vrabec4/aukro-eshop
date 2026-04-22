export type Language = 'cs' | 'sk' | 'en';

export const LANGUAGES: readonly Language[] = ['cs', 'sk', 'en'] as const;

export const DEFAULT_LANGUAGE: Language = 'cs';
