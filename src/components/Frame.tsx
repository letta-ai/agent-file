import * as React from 'react';
import { forwardRef } from 'react';
import { cn } from './utils';
import { cva, type VariantProps } from 'class-variance-authority';

const frameVariants = cva('', {
  variants: {
    fullWidth: {
      true: 'w-full',
    },
    fullHeight: {
      true: 'h-full',
    },
    padding: {
      true: 'p-4',
      small: 'p-2',
      medium: 'p-4',
      large: 'p-6',
    },
    paddingX: {
      true: 'px-4',
      small: 'px-2',
      medium: 'px-4',
      large: 'px-6',
    },
    paddingY: {
      true: 'py-4',
      small: 'py-2',
      medium: 'py-4',
      large: 'py-6',
    },
    paddingTop: {
      true: 'pt-4',
    },
    paddingBottom: {
      true: 'pb-4',
      small: 'pb-2',
      medium: 'pb-4',
      large: 'pb-6',
      xlarge: 'pb-8',
      xxlarge: 'pb-12',
    },
    paddingLeft: {
      true: 'pl-4',
    },
    paddingRight: {
      true: 'pr-4',
    },
    border: {
      true: 'border',
    },
    overflow: {
      hidden: 'overflow-hidden',
      auto: 'overflow-auto',
    },
    position: {
      relative: 'relative',
      absolute: 'absolute',
      fixed: 'fixed',
      sticky: 'sticky',
    },
    zIndex: {
      rightAboveZero: 'z-[1]',
      above: 'z-10',
      high: 'z-50',
    },
  },
});

export interface FrameProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof frameVariants> {
  as?: React.ElementType;
  color?: string;
  href?: string;
}

export const Frame = forwardRef<HTMLElement, FrameProps>(
  function Frame({ 
    className, 
    fullWidth, 
    fullHeight, 
    padding, 
    paddingX,
    paddingY,
    paddingTop, 
    paddingBottom, 
    paddingLeft, 
    paddingRight, 
    border,
    overflow,
    position,
    zIndex,
    as: Component = 'div',
    color,
    ...props 
  }, ref) {
    const colorClass = color ? `bg-${color}` : '';
    
    return React.createElement(Component, {
      ref,
      className: cn(
        frameVariants({ fullWidth, fullHeight, padding, paddingX, paddingY, paddingTop, paddingBottom, paddingLeft, paddingRight, border, overflow, position, zIndex }),
        colorClass,
        className
      ),
      ...props
    });
  }
);
