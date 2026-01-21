import {
  HStack,
  NiceGridDisplay,
  Typography,
  VStack,
  LettaLoader,
} from '@/components';
import { Section } from '@/lib/client/components/Section/Section';
import React, { Fragment } from 'react';
import { AgentFileCard } from '@/lib/client/components/AgentFileCard/AgentFileCard';
import { MainCenterView } from '../_components/MainCenterView/MainCenterView';
import { getAllAgents } from '@/lib/agents-loader';

async function AllAgentsSection() {
  const allAgents = await getAllAgents();

  // Featured agents - hardcoded with updated paths
  const featuredAgentfiles = [
    {
      description: 'I\'m Loop. I remember.',
      summary: 'I\'m Loop. I remember. Direct. Dry. No "helpful assistant" energy.',
      name: 'Loop',
      agentKey: 'loop',
      author: '@letta-ai',
      imageSrc: '/agents/@letta-ai/loop/loop.webp',
    },
  ];

  return (
    <VStack gap="2xlarge">
      <Section title="Featured Agents">
        <NiceGridDisplay itemWidth="292px" itemHeight="155px">
          {featuredAgentfiles.map((agent) => (
            <AgentFileCard
              agent={agent}
              key={agent.agentKey}
              imageSrc={agent.imageSrc}
            />
          ))}
        </NiceGridDisplay>
      </Section>

      <Section seeMoreLink="/search" count={allAgents.length.toString()} title={"All Agents"}>
        <NiceGridDisplay itemWidth="292px" itemHeight="155px">
          {allAgents.slice(0, 15).map((agent) => (
            <AgentFileCard 
              agent={{
                ...agent,
                imageSrc: agent.imagePath,
              }} 
              key={`${agent.ownerId}/${agent.agentKey}`} 
            />
          ))}
        </NiceGridDisplay>
      </Section>
    </VStack>
  );
}

export default async function Index() {
  return (
    <Fragment>
      <MainCenterView>
        <VStack
          /* eslint-disable-next-line react/forbid-component-props */
          className="max-w-[800px] p-6 largerThanMobile:p-[56px] w-full items-center"
        >
          <HStack gap="xlarge" align="center" fullHeight>
            <div className="flex items-center justify-center aspect-square">
              <LettaLoader  size="large" />
            </div>
            <VStack>
              <Typography variant="heading1" >
                Agentfile Directory
              </Typography>
              <HStack align="center">
                <Typography variant="large">Discover and share stateful AI agents</Typography>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </MainCenterView>
      <div className="max-w-[1296px] z-[1] w-full mt-[48px] mx-auto  relative bg-background">
        <VStack paddingBottom>
          <AllAgentsSection />
        </VStack>
      </div>
    </Fragment>
  );
}
