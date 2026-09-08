/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum QuestionType {
  MCQ = "mcq",          // Multiple Choice
  TRUE_FALSE = "tf",    // True or False
  FILL_BLANK = "blank", // Fill in the blank
  MATCH = "match",      // Matching pairs
  ESSAY = "essay",      // Essay question
}

export interface Question {
  id: string;
  unitId: number;
  lessonId?: string; // Optional link to a specific lesson ID
  type: QuestionType;
  text: string;
  options?: string[]; // Used for MCQ
  correctAnswer: string; // For MCQ, TF, Blank
  explanation?: string;
  matchPairs?: { left: string; right: string }[]; // Used for MATCH
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  illustration?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string[];
  keyPoints: string[];
  illustration: string;
  image?: string;
}

export interface Unit {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  themeColor: string; // tailwind class prefix (e.g., 'emerald', 'sky')
  icon: string; // Lucide icon name
  lessons: Lesson[];
  timeline: TimelineEvent[];
  flashcards: Flashcard[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  condition: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export type ExamQuestionType =
  | "mcq"
  | "tf"
  | "blank"
  | "match"
  | "timeline"
  | "odd_one_out"
  | "essay"
  | "short_answer"
  | "map"
  | "table_comparison";

export interface ExamQuestion {
  id: string;
  type: ExamQuestionType;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  matchPairs?: { left: string; right: string }[];
  timelineEvents?: { event: string; year: string }[];
  oddItems?: { words: string[]; odd: string; reason: string };
  tableComparison?: {
    criteria: string[];
    colA: { title: string; values: string[] };
    colB: { title: string; values: string[] };
  };
  mapData?: {
    prompt: string;
    points: { label: string; answer: string }[];
  };
  essayTopics?: string[];
}

export interface ExamSection {
  id: string;
  title: string;
  instruction: string;
  marks?: number;
  questions: ExamQuestion[];
}

export interface OfficialExam {
  id: string;
  title: string;
  subtitle: string;
  authority: string;
  state?: string;
  year?: string;
  grade: string;
  subject: string;
  duration: string;
  totalMarks: number;
  category: "board_exam" | "school_exam" | "unit_worksheet";
  unitId?: number;
  sections: ExamSection[];
}

