import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-sans font-semibold text-ink outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /** Amber desktop CTA with the hard bottom shadow. */
        primary:
          'rounded-cta bg-amber px-[18px] py-[10px] text-[15px] shadow-cta hover:bg-amber-hover',
        /** White with the 1.5px ink border and cream bottom shadow. */
        secondary:
          'rounded-cta border-[1.5px] border-ink bg-white px-[18px] py-[10px] text-[15px] shadow-[0_3px_0_#C9BFAE] hover:bg-paper-3',
        /** Transparent menu-bar item. */
        menu: 'rounded-md px-2.5 py-2 text-sm font-medium hover:bg-ink/8',
        /** 30×30 window title-bar icon button. */
        window: 'size-[30px] rounded-md text-muted-2 hover:bg-ink/8 hover:text-ink',
      },
      size: {
        default: 'min-h-11',
        sm: 'min-h-9 px-3.5 py-1.5 text-sm',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
