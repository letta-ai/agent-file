import {
  HStack,
  Typography,
  VStack,
} from '@/components';

interface SectionProps {
  title: string;
  seeMoreLink?: string;
  count?: string;
  children: React.ReactNode;
}

export function Section(props: SectionProps) {
  const { title, seeMoreLink, count, children } = props;

  return (
    <VStack>
      <HStack align="center">
        <HStack align="center" gap="large">
          <Typography variant="large" bold>
            {title}
          </Typography>
          {count && (
            <div className="border rounded-sm px-1 h-[22px] flex items-center justify-center">
              <Typography variant="body3" bold>
                {count}
              </Typography>
            </div>
          )}
        </HStack>
        {seeMoreLink && (
          <a 
            href={seeMoreLink}
            className="flex items-center gap-1 hover:underline"
          >
            <Typography variant="body" bold>
              See all
            </Typography>
            <span>→</span>
          </a>
        )}
      </HStack>
      {children}
    </VStack>
  );
}
