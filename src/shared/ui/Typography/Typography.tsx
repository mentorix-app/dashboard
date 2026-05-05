import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/src/shared/lib/styles';

export const typographyVariants = cva('text-foreground font-sans', {
  variants: {
    variant: {
      h1: 'text-[length:var(--fs-h1)] leading-[1.2413793] font-bold tracking-tight',
      h2: 'text-[length:var(--fs-h2)] leading-[1.3333333] font-bold tracking-tight',
      h3: 'text-[length:var(--fs-h3)] leading-[1.4] font-bold',
      h4: 'text-[length:var(--fs-h4)] leading-[1.3333333] font-bold',
      h5: 'text-[length:var(--fs-h5)] leading-[1.5] font-bold',
      'p-lg': 'text-[length:var(--fs-p-lg)] leading-[1.5555556] font-normal',
      p: 'text-[length:var(--fs-p)] leading-[1.5] font-normal',
      'p-sm': 'text-[length:var(--fs-p-sm)] leading-[1.4285714] font-normal',
      'p-xs': 'text-[length:var(--fs-p-xs)] leading-[1.3333333] font-normal',
      label: 'text-[length:var(--fs-p)] leading-[1.5] font-bold',
      'label-sm': 'text-[length:var(--fs-p-sm)] leading-[1.4285714] font-bold',
      link: 'text-[length:var(--fs-p)] leading-[1.5] font-semibold underline underline-offset-4',
      'link-sm': 'text-[length:var(--fs-p-sm)] leading-[1.4285714] font-semibold underline underline-offset-4',
      caption: 'text-[length:var(--fs-p-sm)] leading-[1.4285714] font-semibold uppercase tracking-wide',
      tag: 'text-[length:var(--fs-p-xs)] leading-[1.4285714] font-semibold',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

export type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>['variant']>;

const defaultElementByVariant: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  'p-lg': 'p',
  p: 'p',
  'p-sm': 'p',
  'p-xs': 'p',
  label: 'label',
  'label-sm': 'label',
  link: 'a',
  'link-sm': 'a',
  caption: 'span',
  tag: 'span',
};

export type TypographyProps<TTag extends ElementType = ElementType> = {
  variant?: TypographyVariant;
  as?: TTag;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<TTag>, 'as' | 'children' | 'className'>;

export const Typography = <TTag extends ElementType = 'p'>({
  variant = 'p',
  as,
  className,
  children,
  ...rest
}: TypographyProps<TTag>) => {
  const Component = (as ?? defaultElementByVariant[variant]) as ElementType;
  return (
    <Component
      data-slot="typography"
      data-variant={variant}
      className={cn(typographyVariants({ variant }), className)}
      {...rest}
    >
      {children}
    </Component>
  );
};
