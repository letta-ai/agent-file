import { HStack, Typography, VStack } from '@/components';
import React from 'react';
import Image from 'next/image';

interface AgentCardData {
  name: string;
  author: string;
  agentKey: string;
  summary: string;
  imageSrc?: string;
}

interface AgentFileCardProps {
  agent: AgentCardData;
  imageSrc?: string;
}

export function AgentFileCard(props: AgentFileCardProps) {
  const { agent, imageSrc: propImageSrc } = props;
  const { agentKey, author, name, summary } = agent;
  const imageSrc = propImageSrc || agent.imageSrc;

  return (
    <VStack gap={null}>
      <VStack
        color="background-grey3"
        as="a"
        href={`/agents/${author}/${agentKey}`}
        padding="small"
        border
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={name}
            width="300"
            height="300"
            /* eslint-disable-next-line react/forbid-component-props */
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        <HStack>
          <VStack gap={false}>
            <Typography fullWidth overflow="ellipsis" bold>
              {name}
            </Typography>
            <Typography color="lighter" light>
              {author}
            </Typography>
          </VStack>
        </HStack>
        <VStack paddingY="small">
          <div className="h-[32px]">
            <Typography
              /* eslint-disable-next-line react/forbid-component-props */
              className="line-clamp-2"
              color="lighter"
              light
            >
              {summary}
            </Typography>
          </div>
        </VStack>
      </VStack>
    </VStack>
  );
}
