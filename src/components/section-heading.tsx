import { cn } from '@/lib/utils';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'reveal max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow ? <span className={light ? 'eyebrow-light' : 'eyebrow'}>{eyebrow}</span> : null}
      <h2
        className={cn(
          'mt-5 text-3xl leading-[1.15] sm:text-[40px]',
          light ? 'text-white' : 'text-ink-900',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn('mt-5 text-[17px] leading-relaxed', light ? 'text-brand-100/85' : 'text-ink-600')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
