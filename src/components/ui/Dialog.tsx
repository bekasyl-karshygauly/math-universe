'use client';

import React, { useEffect, useId, useRef } from 'react';
import { motion } from 'motion/react';
import { useReduceMotion } from '../../lib/motionPref';
import { X } from 'lucide-react';

interface DialogProps {
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  closeLabel: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Extra content in the header row, e.g. a sign-out button */
  headerActions?: React.ReactNode;
  maxWidth?: number;
  /** Fixed height for chat-like dialogs whose body manages its own scroll */
  height?: string;
  bodyClassName?: string;
  onBackdropClose?: boolean;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: labelled by its title, closes on Escape and backdrop click,
 * traps Tab inside, returns focus to the opener and locks page scroll without
 * shifting the layout (scrollbar width is compensated).
 */
export function Dialog({
  onClose,
  title,
  subtitle,
  closeLabel,
  children,
  footer,
  headerActions,
  maxWidth = 560,
  height,
  bodyClassName = '',
  onBackdropClose = true,
}: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const body = document.body;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>('[data-autofocus]') ?? panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      opener?.focus?.();
    };
  }, []);

  return (
    <motion.div
      className="dialog-backdrop"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22 }}
      onMouseDown={(e) => {
        if (onBackdropClose && e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="dialog"
        style={{ maxWidth, height }}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.2, 0, 0, 1] }}
      >
        <div className="dialog__header">
          <div style={{ minWidth: 0 }}>
            <h2 id={titleId} className="dialog__title">
              {title}
            </h2>
            {subtitle && <p className="dialog__subtitle">{subtitle}</p>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 'none' }}>
            {headerActions}
            <button type="button" className="icon-btn" onClick={onClose} aria-label={closeLabel} title={closeLabel}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className={`dialog__body ${bodyClassName}`.trim()}>{children}</div>
        {footer && <div className="dialog__footer">{footer}</div>}
      </motion.div>
    </motion.div>
  );
}
