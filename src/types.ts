export type TestPart = 'home' | 'part1' | 'part2_prep' | 'part2_speak' | 'part3' | 'results';

export interface Part1Question {
  id: number;
  topic: string;
  question: string;
}

export interface CueCard {
  id: string;
  title: string;
  topic: string;
  bullets: string[];
  tips: string;
}

export interface Part3Question {
  id: number;
  question: string;
  focusArea: string;
}

export interface AnswerTranscript {
  part: 1 | 2 | 3;
  questionId: number;
  questionText: string;
  userSpeech: string;
  durationSeconds?: number;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
  part: number;
}

export interface VocabSuggestion {
  originalPhrase: string;
  advancedAlternative: string;
  context: string;
  part: number;
}

export interface EvaluationResult {
  overallBand: number;
  fluencyScore: number;
  fluencyFeedback: string;
  lexicalScore: number;
  lexicalFeedback: string;
  grammarScore: number;
  grammarFeedback: string;
  pronunciationScore: number;
  pronunciationFeedback: string;
  listeningScore?: number;
  readingScore?: number;
  writingScore?: number;
  speakingScore?: number;
  strengths: string[];
  improvements: string[];
  grammarCorrections: GrammarCorrection[];
  vocabSuggestions: VocabSuggestion[];
  examinerSummary: string;
  part1Feedback?: string;
  part2Feedback?: string;
  part3Feedback?: string;
  nextBandTargetAdvice?: string;
  descriptorMatches?: {
    fluencyLevel: string;
    lexicalLevel: string;
    grammarLevel: string;
    pronunciationLevel: string;
  };
}

export interface TopicVocabItem {
  word: string;
  phonetic?: string;
  definition: string;
  collocation: string;
  exampleSentence: string;
  bandScore: 'Band 8' | 'Band 8.5' | 'Band 9';
}

export interface SampleQuestionWithAnswer {
  id: number;
  part: 1 | 2 | 3;
  topic: string;
  questionText: string;
  modelAnswer: string;
  keyVocabUsed: string[];
}

export interface IELTSSet {
  id: string;
  title: string;
  part1Questions: Part1Question[];
  part2CueCard: CueCard;
  relevantVocab?: TopicVocabItem[];
  sampleModelAnswers?: SampleQuestionWithAnswer[];
}
