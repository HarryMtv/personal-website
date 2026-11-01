import { useCallback, useId, useRef, useState } from 'react';
import { ScreenshotLightbox } from './screenshot-lightbox';

interface ScreenshotProps {
  src: string;
  /** Intrinsic size, so the browser reserves the box before the image loads. */
  width: number;
  height: number;
  /** Visible caption. Also the figure's accessible name, so the image itself is not repeated. */
  caption?: string;
}

/**
 * A mounted screenshot: the image sits on a paper mat with a soft shadow,
 * captioned underneath in the same mono style as the old placeholder. The
 * mat is a button — clicking it opens the image fullscreen in a lightbox
 * that zooms out of the thumbnail and back into it.
 */
export function Screenshot({ src, width, height, caption }: ScreenshotProps) {
  const captionId = useId();
  const [shot, setShot] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // The zoom reads the thumbnail's rect when it opens and again when it
  // closes — the window may have been dragged in between. A stable callback
  // keeps the lightbox's listeners from re-subscribing.
  const getOriginRect = useCallback(() => triggerRef.current?.getBoundingClientRect() ?? null, []);
  const handleExited = useCallback(() => {
    setShot(false);
    // `preventScroll` so landing back on the thumbnail cannot shift the page
    // the scroll lock just restored.
    triggerRef.current?.focus({ preventScroll: true });
  }, []);
  return (
    <figure
      className="mx-auto flex w-full max-w-[960px] flex-col gap-3"
      aria-labelledby={caption ? captionId : undefined}
      aria-label={caption ? undefined : 'Screenshot'}
    >
      <div className="rounded-card border-ink/12 bg-paper-2 overflow-hidden border p-2 shadow-[0_16px_44px_rgb(30_27_24/0.14)] sm:p-3">
        <button
          ref={triggerRef}
          type="button"
          aria-label="Open full-size screenshot"
          aria-haspopup="dialog"
          onClick={() => setShot(true)}
          className="focus-visible:outline-accent block w-full cursor-zoom-in rounded-[8px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {/* Hidden while the lightbox owns the view, but never unmounted:
              the reserved box keeps the mat, window and page from reflowing. */}
          <img
            src={src}
            alt=""
            width={width}
            height={height}
            style={{ visibility: shot ? 'hidden' : 'visible' }}
            className="block h-auto w-full rounded-[8px]"
          />
        </button>
      </div>
      {caption ? (
        <figcaption id={captionId} className="text-muted m-0 font-mono text-xs">
          {caption}
        </figcaption>
      ) : null}
      {shot ? (
        <ScreenshotLightbox
          src={src}
          width={width}
          height={height}
          caption={caption}
          getOriginRect={getOriginRect}
          onExited={handleExited}
        />
      ) : null}
    </figure>
  );
}
