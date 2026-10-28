import { useId } from 'react';

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
 * captioned underneath in the same mono style as the old placeholder.
 */
export function Screenshot({ src, width, height, caption }: ScreenshotProps) {
  const captionId = useId();
  return (
    <figure
      className="mx-auto flex w-full max-w-[960px] flex-col gap-3"
      aria-labelledby={caption ? captionId : undefined}
      aria-label={caption ? undefined : 'Screenshot'}
    >
      <div className="rounded-card border-ink/12 bg-paper-2 overflow-hidden border p-2 shadow-[0_16px_44px_rgb(30_27_24/0.14)] sm:p-3">
        <img
          src={src}
          alt=""
          width={width}
          height={height}
          className="block h-auto w-full rounded-[8px]"
        />
      </div>
      {caption ? (
        <figcaption id={captionId} className="text-muted m-0 font-mono text-xs">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
