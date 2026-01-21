import {
  HStack,
  Typography,
  VStack,
} from '@/components';

export interface SectionProps {
  title: string;
  children: React.ReactNode;
  seeMoreLink?: string;
  count?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export function Section(props: SectionProps) {
  const { title, children, seeMoreLink, count, cta } = props;

  return (
    <VStack gap="large">
      <HStack justify="spaceBetween" align="center">
        <HStack align="center" gap="large">
          <Typography variant="heading5">{title}</Typography>
          {count && (
            <div className="border rounded-sm px-2 py-1 text-sm">
              {count}
            </div>
          )}
        </HStack>
        {(seeMoreLink || cta) && (
          <a href={seeMoreLink || cta?.href} className="text-sm hover:underline">
            {cta?.label || 'See all'} →
          </a>
        )}
      </HStack>
      {children}
    </VStack>
  );
}
