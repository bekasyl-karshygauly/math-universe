'use client';

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { ArrowRight, CirclePlay } from 'lucide-react';
import type { Language } from '../../lib/storage';
import type { LectureVideo } from '../../data/math1/videos';
import { useReduceMotion } from '../../lib/motionPref';
import { MathText, useT } from './shared';
import { scrollToStudyTarget } from './studyScroll';
import { StudyQuiz } from './StudyQuiz';

function duration(seconds: number) {
  return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}

interface VideoLessonProps {
  videos: LectureVideo[];
  lang: Language;
  active: boolean;
  startHeading?: RefObject<HTMLHeadingElement | null>;
  jump?: { id: string };
  onPractice: () => void;
  onFinalTest: () => void;
}

export function VideoLesson({ videos, lang, active, startHeading, jump, onPractice, onFinalTest }: VideoLessonProps) {
  const t = useT(lang);
  const reduce = useReduceMotion();
  const [index, setIndex] = useState(() => Math.max(0, videos.findIndex(item => item.id === jump?.id)));
  const [quiz, setQuiz] = useState(false);
  const [failed, setFailed] = useState(false);
  const player = useRef<HTMLVideoElement>(null);
  const localHeading = useRef<HTMLHeadingElement>(null);
  const videoHeading = startHeading ?? localHeading;
  const quizHeading = useRef<HTMLHeadingElement>(null);
  const focus = useRef<'video' | 'quiz' | null>(null);
  const appliedJump = useRef<typeof jump>(undefined);
  const video = videos[index];
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? '') + '/videos/math1/' + video.id;
  const hasNext = index + 1 < videos.length;

  useEffect(() => {
    if (!active) player.current?.pause();
  }, [active]);

  useLayoutEffect(() => {
    if (!active || !jump || appliedJump.current === jump) return;
    appliedJump.current = jump;
    const next = videos.findIndex(item => item.id === jump.id);
    if (next < 0) return;
    if (next === index) {
      videoHeading.current?.focus({ preventScroll: true });
      if (videoHeading.current) scrollToStudyTarget(videoHeading.current, !reduce);
      return;
    }
    player.current?.pause();
    focus.current = 'video';
    setQuiz(false);
    setFailed(false);
    setIndex(next);
  }, [jump, active, videos, index, reduce, videoHeading]);

  useLayoutEffect(() => {
    const target = focus.current === 'video' ? videoHeading.current : focus.current === 'quiz' ? quizHeading.current : null;
    if (!target) return;
    focus.current = null;
    target.focus({ preventScroll: true });
    scrollToStudyTarget(target, !reduce);
  }, [index, quiz, reduce, videoHeading]);

  function selectVideo(next: number) {
    if (next === index) {
      videoHeading.current?.focus({ preventScroll: true });
      if (videoHeading.current) scrollToStudyTarget(videoHeading.current, !reduce);
      return;
    }
    player.current?.pause();
    focus.current = 'video';
    setQuiz(false);
    setFailed(false);
    setIndex(next);
  }

  function openQuiz() {
    player.current?.pause();
    if (quizHeading.current) {
      quizHeading.current.focus({ preventScroll: true });
      scrollToStudyTarget(quizHeading.current, !reduce);
      return;
    }
    focus.current = 'quiz';
    setQuiz(true);
  }

  return (
    <div className="m1-videos" hidden={!active}>
      <div className="m1-video-layout">
        <div className="m1-video-main">
          <h3 ref={videoHeading} tabIndex={-1} className="m1-h">{video.title[lang]}</h3>
          <p className="m1-video-meta">{t('m1_video_language')} <span aria-hidden="true">·</span> <span className="mono">{duration(video.seconds)}</span></p>
          <video key={video.id} ref={player} className="m1-video-player" src={base + '.mp4'} poster={base + '.jpg'}
            controls playsInline preload="none" aria-label={video.title[lang]} onError={() => setFailed(true)} />
          {failed && (
            <div className="m1-video-error">
              <p role="status">{t('m1_video_error')}</p>
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => {
                setFailed(false);
                player.current?.load();
                void player.current?.play().catch(() => {});
              }}>{t('m1_video_retry')}</button>
            </div>
          )}
          <MathText as="p" className="m1-p m1-video-summary" text={video.summary[lang]} />
          <div className="m1-study-actions">
            <button type="button" className="btn btn--primary" onClick={openQuiz}>
              {t('m1_video_start_quiz')} <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button type="button" className="btn btn--ghost" onClick={onPractice}>{t('m1_go_practice')}</button>
          </div>
        </div>
        <nav className="m1-video-list" aria-label={t('m1_videos')}>
          <p className="eyebrow eyebrow--muted">{t('m1_videos')}</p>
          <ol>
            {videos.map((item, position) => (
              <li key={item.id}>
                <button type="button" className="m1-video-list__item" aria-current={position === index ? 'true' : undefined}
                  onClick={() => selectVideo(position)}>
                  <CirclePlay size={17} aria-hidden="true" />
                  <span>{item.title[lang]}</span>
                  <span className="mono">{duration(item.seconds)}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      {quiz && (
        <section className="m1-video-quiz" aria-labelledby={video.id + '-quiz-title'}>
          <h3 id={video.id + '-quiz-title'} className="m1-h" ref={quizHeading} tabIndex={-1}>{t('m1_video_quiz')}</h3>
          <StudyQuiz id={video.id} questions={video.test} label={t('m1_video_quiz')} lang={lang}
            resultActions={(
              <button type="button" className="btn btn--primary" onClick={hasNext ? () => selectVideo(index + 1) : onFinalTest}>
                {t(hasNext ? 'm1_video_next' : 'm1_start_test')} <ArrowRight size={16} aria-hidden="true" />
              </button>
            )} />
        </section>
      )}
    </div>
  );
}
