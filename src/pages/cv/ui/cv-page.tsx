import { Button } from '@/shared/ui/button';
import { Window } from '@/shared/ui/window';
import { CV_FILE } from '@/entities/profile';
import { useZoom, ZoomControls } from '@/features/document-zoom';
import { CvDocument } from '@/widgets/cv-document';

/** The CV.pdf window: an HTML rendition of the CV plus the PDF download. */
export function CvPage() {
  const { zoom, zoomIn, zoomOut, canZoomIn, canZoomOut } = useZoom();

  return (
    <Window
      path={[{ label: 'CV.pdf' }]}
      meta={`${CV_FILE.pages} pages`}
      closeTo="/desktop"
      variant="document"
      toolbar={
        <>
          <ZoomControls
            zoom={zoom}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
          />
          <Button asChild size="sm">
            <a href={CV_FILE.href} download={CV_FILE.downloadName}>
              Download PDF
            </a>
          </Button>
        </>
      }
    >
      <CvDocument zoom={zoom} />
    </Window>
  );
}
