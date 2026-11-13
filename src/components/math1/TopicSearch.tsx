'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import type { Language } from '../../lib/storage';
import { MATH1_LECTURES } from '../../data/math1';
import { searchExcerpt, searchLectures, type StudyTarget } from '../../data/math1/search';
import { fmt } from '../../data/i18n-lab';
import { useT } from './shared';

export function TopicSearch({ lang, onOpen }: {
  lang: Language;
  onOpen: (lectureIndex: number, target: StudyTarget) => void;
}) {
  const t = useT(lang);
  const [query, setQuery] = useState('');
  const [committed, setCommitted] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [limit, setLimit] = useState(8);
  const composing = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchLectures(committed), [committed]);

  function update(value: string) {
    setQuery(value);
    if (!composing.current) setCommitted(value);
    setExpanded(true);
    setLimit(8);
  }

  return (
    <section className="m1-topic-search" aria-label={t('m1_search_label')}>
      <label className="field-label" htmlFor="m1-topic-query">{t('m1_search_label')}</label>
      <div className="catalog-search__box">
        <Search size={18} className="catalog-search__icon" aria-hidden="true" />
        <input ref={input} id="m1-topic-query" className="field-input" type="search"
          value={query} placeholder={t('m1_search_placeholder')} aria-describedby="m1-topic-count"
          onChange={event => update(event.target.value)}
          onCompositionStart={() => { composing.current = true; }}
          onCompositionEnd={event => { composing.current = false; update(event.currentTarget.value); }}
          onKeyDown={event => {
            if (event.key === 'Escape') { update(''); input.current?.focus(); }
            if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
              setCommitted(query);
              setExpanded(true);
            }
          }} />
        {query && (
          <button type="button" className="btn btn--ghost m1-topic-search__clear" aria-label={t('m1_search_clear')}
            onClick={() => { update(''); setCommitted(''); input.current?.focus(); }}>
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      <p id="m1-topic-count" className="field-help" role="status">
        {committed.trim() && fmt(t('m1_search_count'), { n: results.length })}
      </p>
      {committed.trim() && !expanded && (
        <button type="button" className="text-link" onClick={() => setExpanded(true)}>{t('m1_search_show')}</button>
      )}
      {committed.trim() && expanded && (
        <div className="m1-topic-search__results">
          {results.length === 0 && <p className="empty-state">{t('m1_search_empty')}</p>}
          <ul>
            {results.slice(0, limit).map(result => {
              const lecture = MATH1_LECTURES[result.lectureIndex];
              const excerpt = searchExcerpt(result.text, committed, lang);
              return (
                <li key={lecture.id + result.id}>
                  <button type="button" className="m1-search-result" onClick={() => {
                    setExpanded(false);
                    onOpen(result.lectureIndex, result);
                  }}>
                    <span className="m1-search-result__context">
                      {fmt(t('m1_lecture_n'), { n: lecture.number })} · {result.tab === 'video' ? t('m1_tab_video') + ' · ' : ''}{lecture.title[lang]}
                    </span>
                    <span className="m1-search-result__title">{result.title[lang]} <ArrowUpRight size={16} aria-hidden="true" /></span>
                    <span className="m1-search-result__excerpt" lang={excerpt.language === 'kz' ? 'kk' : excerpt.language}>{excerpt.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {limit < results.length && <button type="button" className="btn btn--secondary btn--sm"
            onClick={() => setLimit(limit + 8)}>{t('m1_search_more')}</button>}
        </div>
      )}
    </section>
  );
}
