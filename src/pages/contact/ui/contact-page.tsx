import { profile, SocialLinks, socials } from '@/entities/profile';
import { ContactForm } from '@/features/send-contact-message';
import { StickyNote } from '@/shared/ui/sticky-note';
import { Window } from '@/shared/ui/window';

/** The New message window: compose form plus the elsewhere.txt aside. */
export function ContactPage() {
  return (
    <div className="mx-auto flex max-w-[1100px] flex-wrap items-start justify-center gap-7">
      <Window path={[{ label: 'New message' }]} hidePrefix closeTo="/desktop" maxWidth="lg">
        <ContactForm />
      </Window>

      <aside
        aria-label="Elsewhere"
        className="flex flex-1 basis-[260px] flex-col gap-2.5 max-[899px]:w-full max-[899px]:max-w-[560px] min-[900px]:w-[300px]"
      >
        <div className="mb-2.5">
          <StickyNote label="elsewhere.txt" rotate={1.2}>
            <p className="m-0">
              Prefer plain email?{' '}
              <a
                href={`mailto:${profile.email}`}
                className="text-accent underline underline-offset-2"
              >
                {profile.email}
              </a>
            </p>
          </StickyNote>
        </div>
        <SocialLinks socials={socials} />
      </aside>
    </div>
  );
}
