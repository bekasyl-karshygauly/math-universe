import { Language } from '../../lib/storage';

/** Text in all three site languages. May contain inline LaTeX: $…$ or \(…\). */
export type L = Record<Language, string>;

/** Builds a trilingual string: kz (original of the course materials), ru, en. */
export const T = (kz: string, ru: string, en: string): L => ({ kz, ru, en });
/** Same text in every language (pure formulas, numbers). */
export const X = (s: string): L => ({ kz: s, ru: s, en: s });

export interface ExampleStep {
  text?: L;
  tex?: string;
}

export interface Example {
  title: L;
  task: L;
  /** Display formula with the given data */
  given?: string;
  steps: ExampleStep[];
  answer?: L;
  /** Example added on the platform (not in the original course pack) */
  added?: boolean;
}

export type GeometryVisualId = 'vector-coordinates' | 'vector-angle' | 'line-distance' | 'plane-line' | 'conics';
export type VisualId = 'matrix-product' | 'sarrus' | 'gauss' | GeometryVisualId;

export type Block =
  | { kind: 'h'; text: L }
  | { kind: 'p'; text: L }
  | { kind: 'def'; term: L; text: L; tex?: string }
  | { kind: 'thm'; title: L; text: L; tex?: string }
  | { kind: 'formula'; tex: string; tag?: string; note?: L }
  | { kind: 'list'; items: L[]; ordered?: boolean }
  | { kind: 'example'; example: Example }
  | { kind: 'note'; tone: 'tip' | 'warn'; text: L }
  | { kind: 'visual'; id: VisualId };

export interface TestQuestion {
  q: L;
  options: L[];
  correct: number;
  explain: L;
}

export type GeometryTrainerKind = 'vector-components' | 'vector-products' | 'line-distance' | 'plane-intersection' | 'conic-parameters';

export type TrainerKind =
  | 'mat-add'
  | 'mat-scalar'
  | 'mat-mul'
  | 'transpose'
  | 'det2'
  | 'det3'
  | 'cofactor'
  | 'inverse2'
  | 'rank'
  | 'cramer2'
  | 'system3'
  | GeometryTrainerKind;

export interface Lecture {
  id: string;
  number: number;
  title: L;
  summary: L;
  /** Key ideas shown as chips at the top */
  topics: L[];
  blocks: Block[];
  deepDive?: DeepDive[];
  practice: {
    /** Original practical session numbers, e.g. "1–4" */
    sessions: string;
    goal: L;
    questions: L[];
    examples: Example[];
  };
  selfCheck: { q: L; a: L }[];
  test: TestQuestion[];
  trainers: TrainerKind[];
  /** Related lessons of the general courses (course id, lesson id) */
  related: { courseId: string; lessonId: string }[];
  /** Points where the platform corrected or completed the original text */
  editorNotes?: string[];
}

export interface DeepDive {
  id: string;
  title: L;
  summary: L;
  blocks: Block[];
}

export interface LectureStub {
  number: number;
  title: L;
}
