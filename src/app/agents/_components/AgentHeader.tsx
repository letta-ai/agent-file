import { VStack, HStack, Typography } from '@/components';
import { CenterContent } from '@/lib/client/components/CenterContent/CenterContent';

interface AgentHeaderProps {
  name: string;
  author: string;
  agentId: string;
  downloadCount?: number;
}

export function AgentHeader({ name, author, agentId, downloadCount }: AgentHeaderProps) {
  return (
    <div className="pt-[40px]">
      <CenterContent>
        <div className="z-[1] relative">
          <HStack justify="spaceBetween">
            <VStack>
              <Typography variant="heading3">{name}</Typography>
              <HStack gap="large" align="center">
                <Typography color="lighter">{author}</Typography>
                {downloadCount !== undefined && (
                  <Typography variant="body2" color="lighter">
                    {downloadCount.toLocaleString()} downloads
                  </Typography>
                )}
              </HStack>
            </VStack>
          </HStack>
        </div>
      </CenterContent>
      <div className="absolute pointer-events-none bg-background-grey h-[238px] w-[100dvw] border-b border-border z-[0] top-0 left-0" />
    </div>
  );
}
