import { m, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/shared/lib/cn';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

/** Fade-up stagger container; children must be StaggerItems. */
export function StaggerList({ className, ...props }: HTMLMotionProps<'div'>) {
  return (
    <m.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(className)}
      {...props}
    />
  );
}

/** One staggered entry. */
export function StaggerItem({ className, ...props }: HTMLMotionProps<'div'>) {
  return <m.div variants={item} className={cn(className)} {...props} />;
}
