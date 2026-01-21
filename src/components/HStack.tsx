import * as React from 'react';
import { cn } from './utils';
import type { StackPrimitiveProps } from './StackPrimitive';
import { StackPrimitive } from './StackPrimitive';
import { type ElementRef, forwardRef } from 'react';

export type HStackProps = StackPrimitiveProps & {
  reverse?: boolean;
};

export const HStack = forwardRef<
  ElementRef<typeof StackPrimitive>,
  HStackProps
>(function HStack({ className, children, reverse, ...props }, ref) {
  return (
    <StackPrimitive
      ref={ref}
      className={cn(reverse ? 'flex-row-reverse' : 'flex-row', className)}
      {...props}
    >
      {children}
    </StackPrimitive>
  );
});
