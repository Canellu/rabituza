'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';

interface ScrollShadowProps {
  children: ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  size?: number;
  hideScrollBar?: boolean;
}

const ScrollShadow = ({
  children,
  className,
  orientation = 'vertical',
  size = 40,
  hideScrollBar = false,
}: ScrollShadowProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  const { events } = useDraggable(contentRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    const content = contentRef.current;
    const wrapper = wrapperRef.current;

    if (!content || !wrapper) return;

    const updateShadows = () => {
      if (orientation === 'vertical') {
        setScrollState({
          top: content.scrollTop > 0,
          bottom:
            content.scrollTop < content.scrollHeight - wrapper.clientHeight,
          left: false,
          right: false,
        });
      } else {
        setScrollState({
          left: content.scrollLeft > 0,
          right: content.scrollLeft < content.scrollWidth - wrapper.clientWidth,
          top: false,
          bottom: false,
        });
      }
    };

    content.addEventListener('scroll', updateShadows);
    updateShadows();

    return () => content.removeEventListener('scroll', updateShadows);
  }, [orientation]);

  const maskStyles = useMemo(() => {
    const verticalMask =
      scrollState.top && scrollState.bottom
        ? `linear-gradient(#000, #000, transparent 0, #000 ${size}px, #000 calc(100% - ${size}px), transparent)`
        : scrollState.top
        ? `linear-gradient(0deg, #000 calc(100% - ${size}px), transparent)`
        : scrollState.bottom
        ? `linear-gradient(180deg, #000 calc(100% - ${size}px), transparent)`
        : '';

    const horizontalMask =
      scrollState.left && scrollState.right
        ? `linear-gradient(to right, #000, #000, transparent 0, #000 ${size}px, #000 calc(100% - ${size}px), transparent)`
        : scrollState.left
        ? `linear-gradient(270deg, #000 calc(100% - ${size}px), transparent)`
        : scrollState.right
        ? `linear-gradient(90deg, #000 calc(100% - ${size}px), transparent)`
        : '';

    return orientation === 'vertical' ? verticalMask : horizontalMask;
  }, [scrollState, size, orientation]);

  return (
    <div
      ref={wrapperRef}
      className={cn('relative w-full h-full overflow-hidden p-px', className)}
    >
      <div
        ref={contentRef}
        {...events}
        className={cn(
          'w-full h-full overflow-auto select-none',
          orientation === 'vertical'
            ? 'overflow-y-auto'
            : 'overflow-x-auto whitespace-nowrap',
          hideScrollBar && 'scrollbar-hide'
        )}
        style={{
          maskImage: maskStyles,
          WebkitMaskImage: maskStyles,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollShadow;
