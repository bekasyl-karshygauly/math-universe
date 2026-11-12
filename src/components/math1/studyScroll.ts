import { scrollToElement } from '../LenisProvider';

export function scrollToStudyTarget(target: HTMLElement, smooth: boolean) {
  const clearance = (document.querySelector<HTMLElement>('.app-nav')?.offsetHeight ?? 0) + 12;
  const reader = target.closest<HTMLElement>('.m1-reader');
  if (!reader || getComputedStyle(reader).overflowY !== 'auto') {
    scrollToElement(target, smooth, -clearance);
    return;
  }

  const bounds = reader.getBoundingClientRect();
  const top = target.getBoundingClientRect().top - bounds.top + reader.scrollTop - 12;
  reader.scrollTo({ top, behavior: smooth ? 'smooth' : 'instant' });
  if (Math.abs(bounds.top - clearance) > 2) {
    scrollToElement(reader, smooth, -clearance);
  }
}
