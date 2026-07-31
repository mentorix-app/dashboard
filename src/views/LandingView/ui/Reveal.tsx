'use client';

import { type ElementType, type ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/src/shared/lib/styles';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay before the reveal transition starts, in milliseconds. */
  delay?: number;
  /** Element to render as the reveal container. Defaults to a `div`. */
  as?: ElementType;
};

/**
 * Reveals its children with a subtle fade + rise the first time it scrolls into
 * view. Falls back to visible immediately when IntersectionObserver is missing
 * and disables motion for users who prefer reduced motion.
 */
export const Reveal = ({ children, className, delay = 0, as }: RevealProps) => {
  const Component = as ?? 'div';
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        visible ? 'blur-0 translate-y-0 opacity-100' : 'translate-y-6 opacity-0 blur-[2px]',
        className
      )}
    >
      {children}
    </Component>
  );
};
