import { X } from 'lucide-react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { m, useAnimationControls } from 'motion/react';
import { Button } from './button';

interface ScreenshotLightboxProps {
  src: string;
  /** Intrinsic size, so the image is never upscaled beyond its natural width. */
  width: number;
  height: number;
  caption?: string;
  /** Reads the thumbnail's current viewport rect — the zoom's start and end. */
  getOriginRect: () => DOMRect | null;
  /** Runs once the closing zoom has landed, so the parent can unmount. */
  onExited: () => void;
}

/** The windows' entry easing (see the `window-in` keyframes in index.css). */
const LAYOUT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** The zoom between the thumbnail and the centered lightbox mat. */
const ZOOM_TRANSITION = { duration: 0.3, ease: LAYOUT_EASE };

/** The transform that lays the lightbox mat exactly over the origin rect. */
function flipFrom(origin: DOMRect, rect: DOMRect) {
  return {
    x: origin.left - rect.left,
    y: origin.top - rect.top,
    scaleX: rect.width ? origin.width / rect.width : 1,
    scaleY: rect.height ? origin.height / rect.height : 1,
  };
}

/**
 * The fullscreen view behind `Screenshot`: the image sits on the same paper
 * mat over a dimmed backdrop, and the close button, a click anywhere or
 * Escape zooms it back into its thumbnail. The zoom is a manual FLIP on the
 * mat — a shared `layoutId` would re-project the draggable window and snap
 * it back to centre — so the lightbox owns its exit and reports
 * `onExited` once the mat has landed back on the thumbnail.
 */
export function ScreenshotLightbox({
  src,
  width,
  height,
  caption,
  getOriginRect,
  onExited,
}: ScreenshotLightboxProps) {
  const captionId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const matRef = useRef<HTMLElement>(null);
  // The mat's natural (untransformed) rect, read once on open and reused as
  // the FLIP reference when closing, even mid-zoom.
  const matRectRef = useRef<DOMRect | null>(null);
  const matControls = useAnimationControls();
  const fadeControls = useAnimationControls();
  const [closing, setClosing] = useState(false);

  useLayoutEffect(() => {
    // Freeze the page behind the backdrop before the zoom measures its start
    // rect: the scrollbar-compensating padding shifts the thumbnail, and the
    // FLIP must begin exactly where the (now hidden) thumbnail sits. Hiding
    // the scrollbar would shift the layout, so the body gets it back as
    // padding; the cleanup scrolls to the saved offset — iOS can still creep
    // while locked — without animating, and puts the inline styles back as
    // they were.
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

  useLayoutEffect(() => {
    // FLIP the mat from the thumbnail onto its centered place. Both rects
    // are read before the first paint, so the open never flashes at the
    // final size; `set` jumps to the thumbnail, `start` eases home.
    const origin = getOriginRect();
    const rect = matRef.current?.getBoundingClientRect();
    if (origin && rect) {
      matRectRef.current = rect;
      matControls.set(flipFrom(origin, rect));
      void matControls.start({
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        transition: ZOOM_TRANSITION,
      });
    }
    void fadeControls.start({ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } });
  }, [fadeControls, matControls, getOriginRect]);

  useEffect(() => {
    // The close button is the only control; focus starts there so the
    // visitor can dismiss immediately, and `preventScroll` keeps the open
    // from shifting the page behind the backdrop.
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  const requestClose = useCallback(() => {
    // A second request while the exit plays must not restart it.
    if (closing) return;
    setClosing(true);
    void fadeControls.start({ opacity: 0, transition: { duration: 0.16 } });
    const origin = getOriginRect();
    const rect = matRectRef.current;
    const zoom =
      origin && rect
        ? matControls.start({ ...flipFrom(origin, rect), transition: ZOOM_TRANSITION })
        : Promise.resolve();
    void zoom.then(() => onExited());
  }, [closing, fadeControls, getOriginRect, matControls, onExited]);

  useEffect(() => {
    // Escape dismisses the lightbox wherever focus sits — including while
    // the closing zoom is still running, where `requestClose` is a no-op.
    // The capture-phase window listener runs before the window's
    // useEscapeToClose (a document listener) and stops it, so the
    // surrounding window stays open. Tab cycles nowhere — the close button
    // is the only focusable element.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        return;
      }
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      requestClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [requestClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={caption ? captionId : undefined}
      aria-label={caption ? undefined : 'Screenshot'}
      onClick={requestClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 overflow-hidden p-6"
    >
      <m.div
        initial={{ opacity: 0 }}
        animate={fadeControls}
        className="bg-ink/70 absolute inset-0 backdrop-blur-sm"
      />
      <m.div
        initial={{ opacity: 0 }}
        animate={fadeControls}
        className="absolute top-4 right-4 z-10"
      >
        <Button
          ref={closeRef}
          type="button"
          variant="window"
          aria-label="Close screenshot"
          onClick={(event) => {
            event.stopPropagation();
            requestClose();
          }}
          className="text-paper/80 hover:bg-paper/15 hover:text-paper"
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
      </m.div>
      <m.figure
        ref={matRef}
        animate={matControls}
        style={{ transformOrigin: 'top left' }}
        className="bg-paper-2 rounded-card shadow-window relative p-2"
      >
        <img
          src={src}
          alt={caption ?? 'Screenshot'}
          width={width}
          height={height}
          style={{ maxWidth: `min(${width}px, 100%)`, maxHeight: 'calc(100dvh - 120px)' }}
          className="block h-auto w-auto rounded-[8px] object-contain"
        />
      </m.figure>
      {caption ? (
        <m.p
          id={captionId}
          initial={{ opacity: 0 }}
          animate={fadeControls}
          className="text-paper/90 m-0 px-2 font-mono text-xs"
        >
          {caption}
        </m.p>
      ) : null}
    </div>,
    document.body,
  );
}
