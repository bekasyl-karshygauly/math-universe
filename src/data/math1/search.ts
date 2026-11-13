import type { Language } from '../../lib/storage';
import type { Block, L, Lecture } from './types';
import { MATH1_LECTURES } from './index';
import { MATH1_VIDEOS } from './videos';

export interface StudyTarget {
  id: string;
  tab: 'theory' | 'practice' | 'video';
}

export function lectureSections(lecture: Lecture) {
  const sections: { id: string; title: L; blocks: Block[] }[] = [];
  for (const block of lecture.blocks) {
    if (block.kind === 'h' || sections.length === 0) {
      sections.push({
        id: `section-${sections.length}`,
        title: block.kind === 'h' ? block.text : lecture.title,
        blocks: [],
      });
    }
    sections[sections.length - 1].blocks.push(block);
  }
  return sections;
}

function contentText(value: unknown, lang: Language): string {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  if (lang in value) return (value as L)[lang];
  return Object.entries(value)
    .filter(([key]) => !['kind', 'id', 'tone', 'tag', 'tex', 'given'].includes(key))
    .map(([, child]) => contentText(child, lang)).join(' ');
}

const localizedText = (value: unknown): L => ({
  ru: contentText(value, 'ru'), kz: contentText(value, 'kz'), en: contentText(value, 'en'),
});

export function normalizeSearch(value: string) {
  return value.normalize('NFKC').toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

interface SearchEntry extends StudyTarget {
  lectureIndex: number;
  title: L;
  text: L;
}

const entries: SearchEntry[] = MATH1_LECTURES.flatMap((lecture, lectureIndex) => [
  ...lectureSections(lecture).map(section => ({
    lectureIndex, id: section.id, tab: 'theory' as const, title: section.title,
    text: localizedText(section.blocks.filter(block => block.kind !== 'h')),
  })),
  ...(lecture.deepDive ?? []).map(section => ({
    lectureIndex, id: section.id, tab: 'theory' as const, title: section.title,
    text: localizedText([section.summary, section.blocks]),
  })),
  ...lecture.practice.examples.map((example, i) => ({
    lectureIndex, id: `example-${i}`, tab: 'practice' as const,
    title: example.title, text: localizedText([example.task, example.steps]),
  })),
  ...(MATH1_VIDEOS[lecture.number] ?? []).map(video => ({
    lectureIndex, id: video.id, tab: 'video' as const, title: video.title,
    text: video.summary,
  })),
]);

const index = entries.map(entry => ({
  entry,
  title: normalizeSearch(Object.values(entry.title).join(' ')),
  body: normalizeSearch(Object.values(entry.text).join(' ')),
  context: normalizeSearch(Object.values(MATH1_LECTURES[entry.lectureIndex].title).join(' ')),
}));

export function searchLectures(query: string) {
  const tokens = normalizeSearch(query).split(' ').filter(Boolean);
  if (!tokens.length) return [];
  return index.map(({ entry, title, body, context }) => {
    const text = `${title} ${body} ${context}`;
    const matches = tokens.every(token => text.includes(token));
    const score = tokens.reduce((sum, token) => sum + (title.includes(token) ? 5 : body.includes(token) ? 2 : 0), 0);
    return { ...entry, score, matches };
  }).filter(entry => entry.matches).sort((a, b) => b.score - a.score || a.lectureIndex - b.lectureIndex);
}

export function searchExcerpt(text: L, query: string, lang: Language) {
  const tokens = normalizeSearch(query).split(' ').filter(Boolean);
  const hasMatch = (language: Language) => tokens.some(token => normalizeSearch(text[language]).includes(token));
  const language = hasMatch(lang) ? lang : (['ru', 'kz', 'en'] as const).find(hasMatch) ?? lang;
  const plain = text[language].replace(/\$[^$]*\$/g, '').replace(/\\[a-zA-Z]+/g, '').replace(/\s+/g, ' ').trim();
  const lower = plain.toLowerCase().replace(/ё/g, 'е');
  const position = tokens.map(token => lower.indexOf(token)).find(value => value >= 0) ?? 0;
  const start = Math.max(0, position - 50);
  return { language, text: (start ? '…' : '') + plain.slice(start, start + 190) + (plain.length > start + 190 ? '…' : '') };
}
