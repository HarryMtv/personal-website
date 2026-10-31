import { AnimatePresence } from 'motion/react';
import { useId, useRef, useState } from 'react';
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
 * mat is a button — clicking it opens the image fullscreen in a lightbox.
 */
export function Screenshot({ src, width, height, caption }: ScreenshotProps) {
  const captionId = useId();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
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
          onClick={() => setOpen(true)}
          className="block w-full cursor-zoom-in rounded-[8px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <img
            src={src}
            alt=""
            width={width}
            height={height}
            className="block h-auto w-full rounded-[8px]"
          />
        </button>
      </div>
      {caption ? (
        <figcaption id={captionId} className="text-muted m-0 font-mono text-xs">
          {caption}
        </figcaption>
      ) : null}
      <AnimatePresence>
        {open ? (
          <ScreenshotLightbox
            src={src}
            width={width}
            height={height}
            caption={caption}
            onClose={() => {
              setOpen(false);
              // `preventScroll` so landing back on the thumbnail cannot shift
              // the page the scroll lock just restored.
              triggerRef.current?.focus({ preventScroll: true });
            }}
          />
        ) : null}
      </AnimatePresence>
    </figure>
  );
}
