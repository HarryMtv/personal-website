import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { m } from 'motion/react';
import { Button } from './button';

interface ScreenshotLightboxProps {
  src: string;
  /** Intrinsic size, so the image is never upscaled beyond its natural width. */
  width: number;
  height: number;
  caption?: string;
  /** Shared with the thumbnail, so the image zooms between the two slots. */
  layoutId: string;
  onClose: () => void;
}

/** The windows' entry easing (see the `window-in` keyframes in index.css). */
const LAYOUT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * The fullscreen view behind `Screenshot`: the image sits on the same paper
 * mat over a dimmed backdrop, and the close button, a click anywhere or
 * Escape zooms it back into its thumbnail.
 */
export function ScreenshotLightbox({
  src,
  width,
  height,
  caption,
  layoutId,
  onClose,
}: ScreenshotLightboxProps) {
  const captionId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Freeze the page behind the backdrop. Hiding the scrollbar would shift
    // the layout, so the body gets it back as padding; the cleanup scrolls
    // to the saved offset — iOS can still creep while locked — without
    // animating, and puts the inline styles back as they were.
    const root = document.documentElement;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const previousOverflow = root.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      root.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
    };
  }, []);

  useEffect(() => {
    // The close button is the only control; focus starts there so the
    // visitor can dismiss immediately, and `preventScroll` keeps the open
    // from shifting the page behind the backdrop.
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    // Escape dismisses the lightbox wherever focus sits. The capture-phase
    // window listener runs before the window's useEscapeToClose (a document
    // listener) and stops it, so the surrounding window stays open. Tab
    // cycles nowhere — the close button is the only focusable element.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        return;
      }
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  return createPortal(
    <m.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={caption ? captionId : undefined}
      aria-label={caption ? undefined : 'Screenshot'}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut', exit: { duration: 0.16 } }}
      className="bg-ink/70 fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 overflow-hidden p-6 backdrop-blur-sm"
    >
      <Button
        ref={closeRef}
        type="button"
        variant="window"
        aria-label="Close screenshot"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="text-paper/80 hover:bg-paper/15 hover:text-paper absolute top-4 right-4 z-10"
      >
        <X size={16} strokeWidth={2} aria-hidden="true" />
      </Button>
      <m.figure
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut', exit: { duration: 0.16 } }}
        className="bg-paper-2 rounded-card shadow-window p-2"
      >
        <m.img
          layoutId={layoutId}
          layoutCrossfade={false}
          src={src}
          alt=""
          width={width}
          height={height}
          style={{ maxWidth: `min(${width}px, 100%)`, maxHeight: 'calc(100dvh - 120px)' }}
          transition={{ layout: { duration: 0.3, ease: LAYOUT_EASE } }}
          className="block h-auto w-auto rounded-[8px] object-contain"
        />
      </m.figure>
      {caption ? (
        <p id={captionId} className="text-paper/80 m-0 px-2 font-mono text-xs">
          {caption}
        </p>
      ) : null}
    </m.div>,
    document.body,
  );
}
