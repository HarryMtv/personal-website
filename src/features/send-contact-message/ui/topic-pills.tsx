import { cn } from '@/shared/lib/cn';
import { CONTACT_TOPICS, type ContactTopic } from '../model/contact-schema';

interface TopicPillsProps {
  value: ContactTopic;
  onChange: (topic: ContactTopic) => void;
  /** Invalid state when the whole radio group should flag an error. */
  invalid?: boolean;
}

/** The topic radio group styled as pills from the compose mock. */
export function TopicPills({ value, onChange, invalid }: TopicPillsProps) {
  return (
    <fieldset
      aria-invalid={invalid ? true : undefined}
      className="flex flex-wrap gap-2 border-0 p-0"
      data-testid="topic-fieldset"
    >
      <legend className="sr-only">Topic</legend>
      {CONTACT_TOPICS.map((topic) => (
        <label
          key={topic}
          className={cn(
            'border-ink/30 bg-card text-ink flex min-h-9 cursor-pointer items-center rounded-full border-[1.5px] px-3.5 text-sm font-medium',
            'has-checked:border-ink has-checked:bg-ink has-checked:text-paper',
          )}
        >
          <input
            type="radio"
            name="topic"
            value={topic}
            checked={value === topic}
            onChange={() => onChange(topic)}
            className="sr-only"
          />
          {topic}
        </label>
      ))}
    </fieldset>
  );
}
