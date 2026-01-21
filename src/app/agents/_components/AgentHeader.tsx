import { VStack, HStack, Typography } from '@/components';
import { CenterContent } from '@/lib/client/components/CenterContent/CenterContent';
import Image from 'next/image';
import type { AgentFull } from '@/lib/agents-loader';

interface AgentHeaderProps {
  agent: AgentFull;
}

export function AgentHeader({ agent }: AgentHeaderProps) {
  const { name, author, imagePath, ownerId, agentKey } = agent;
  
  // GitHub URLs
  const downloadUrl = `https://raw.githubusercontent.com/letta-ai/agentfile.directory/main/src/agents/${ownerId}/${agentKey}/${agentKey}.af`;
  const githubUrl = `https://github.com/letta-ai/agentfile.directory/tree/main/src/agents/${ownerId}/${agentKey}`;

  return (
    <div className="pt-[40px]">
      <CenterContent>
        <div className="z-[1] relative">
          <HStack justify="spaceBetween" align="center">
            <HStack gap="large" align="center">
              {imagePath && (
                <div className="relative w-[80px] h-[80px] rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={imagePath}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <VStack>
                <Typography variant="heading3">{name}</Typography>
                <HStack gap="large" align="center">
                  <Typography color="lighter">{author}</Typography>
                </HStack>
              </VStack>
            </HStack>
            
           <HStack gap="medium">
             <a
               href={githubUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="px-4 py-2 bg-transparent border text-brand-content rounded-sm hover:bg-brand-hover transition-colors font-semibold flex items-center gap-2"
             >
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
               </svg>
               View on GitHub
             </a>
             <a
               href={downloadUrl}
               download={`${agentKey}.af`}
               className="px-4 py-2 bg-transparent border text-brand-content rounded-sm hover:bg-brand-hover transition-colors font-semibold flex items-center gap-2"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
               </svg>
               Download .af
             </a>
           </HStack>
          </HStack>
        </div>
      </CenterContent>
      <div className="absolute pointer-events-none bg-background-grey h-[254px] w-[100dvw] border-b border-border z-[0] top-0 left-0" />
    </div>
  );
}
