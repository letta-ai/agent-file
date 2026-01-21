'use client';
import { VStack, HStack, Typography } from '@/components';
import { CenterContent } from '@/lib/client/components/CenterContent/CenterContent';
import { useState } from 'react';
import type { AgentFull } from '@/lib/agents-loader';

interface AgentDetailsProps {
  agent: AgentFull;
}

type Tabs = 'overview' | 'memoryBlocks' | 'tools' | 'system';

interface TabberProps {
  value: Tabs;
  onChange: (value: Tabs) => void;
}

function Tabber(props: TabberProps) {
  const { value, onChange } = props;

  const tabs: { label: string; value: Tabs }[] = [
    { label: 'Overview', value: 'overview' },
    { label: 'Memory Blocks', value: 'memoryBlocks' },
    { label: 'Tools', value: 'tools' },
    { label: 'System', value: 'system' },
  ];

  return (
    <HStack gap="large">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 border-b-2 transition-colors ${
            value === tab.value
              ? 'border-text-default'
              : 'border-transparent hover:border-border'
          }`}
        >
          <Typography
            variant="body"
            color={value === tab.value ? 'default' : 'lighter'}
          >
            {tab.label}
          </Typography>
        </button>
      ))}
    </HStack>
  );
}

interface BlockViewerProps {
  title?: string;
  elements: Array<{ label?: string; value: string }>;
  limit?: number;
}

function BlockViewer(props: BlockViewerProps) {
  const { title, elements, limit } = props;
  const displayElements = limit ? elements.slice(0, limit) : elements;
  const hasMore = limit && elements.length > limit;

  return (
    <VStack gap="medium" fullWidth>
      {title && (
        <HStack align="center" gap="medium">
          <Typography variant="heading5">{title}</Typography>
          <div className="border flex items-center justify-center w-[22px] h-[22px] rounded">
            <Typography variant="body2" bold>
              {elements.length}
            </Typography>
          </div>
        </HStack>
      )}
      <VStack gap="medium">
        {displayElements.map((element, index) => (
          <div key={index} className="border rounded p-4">
            {element.label && (
              <Typography variant="body2" bold>
                {element.label}
              </Typography>
            )}
            <Typography variant="body2" color="lighter" className="whitespace-pre-wrap break-words">
              {element.value.length > 200
                ? `${element.value.substring(0, 200)}...`
                : element.value}
            </Typography>
          </div>
        ))}
      </VStack>
      {hasMore && (
        <Typography variant="body2" color="lighter" italic>
          + {elements.length - displayElements.length} more
        </Typography>
      )}
    </VStack>
  );
}

interface AgentOverviewProps {
  agent: AgentFull;
}

function AgentOverview(props: AgentOverviewProps) {
  const { agent } = props;

  return (
    <VStack gap="xlarge">
      {agent.description && (
        <div className="max-w-[560px] w-full">
          <Typography variant="body">{agent.description}</Typography>
        </div>
      )}

      {agent.blocks && agent.blocks.length > 0 && (
        <div className="max-w-[560px] w-full">
          <BlockViewer
            title="Memory Blocks"
            limit={2}
            elements={agent.blocks.map((block: any) => ({
              label: block.label || 'Unnamed Block',
              value: block.value || '',
            }))}
          />
        </div>
      )}

      {agent.tools && agent.tools.length > 0 && (
        <div className="max-w-[560px] w-full">
          <BlockViewer
            title="Tools"
            limit={3}
            elements={agent.tools.map((tool: any) => ({
              label: tool.name || tool,
              value: tool.description || tool.tags?.join(', ') || '',
            }))}
          />
        </div>
      )}

      {agent.system && (
        <div className="max-w-[560px] w-full">
          <BlockViewer
            title="System Prompt"
            elements={[{ value: agent.system }]}
          />
        </div>
      )}
    </VStack>
  );
}

interface SwitcherProps {
  selectedTab: Tabs;
  agent: AgentFull;
}

function Switcher(props: SwitcherProps) {
  const { selectedTab, agent } = props;

  switch (selectedTab) {
    case 'overview':
      return <AgentOverview agent={agent} />;
    case 'memoryBlocks':
      return (
        <div className="max-w-[560px] w-full">
          <BlockViewer
            title="Memory Blocks"
            elements={
              agent.blocks?.map((block: any) => ({
                label: block.label || 'Unnamed Block',
                value: block.value || '',
              })) || []
            }
          />
        </div>
      );
    case 'tools':
      return (
        <div className="max-w-[560px] w-full">
          <BlockViewer
            title="Tools"
            elements={
              agent.tools?.map((tool: any) => ({
                label: tool.name || tool,
                value: tool.description || tool.tags?.join(', ') || '',
              })) || []
            }
          />
        </div>
      );
    case 'system':
      return (
        <div className="max-w-[560px] w-full">
          <BlockViewer
            title="System Prompt"
            elements={[{ value: agent.system || 'No system prompt' }]}
          />
        </div>
      );
    default:
      return null;
  }
}

interface DetailProps {
  label: string;
  value: React.ReactNode;
}

function Detail(props: DetailProps) {
  const { label, value } = props;
  return (
    <VStack gap="small" fullWidth>
      <Typography variant="body3" color="lighter">
        {label}
      </Typography>
      <Typography variant="body3">{value}</Typography>
    </VStack>
  );
}

interface DetailsOverlayProps {
  agent: AgentFull;
}

function DetailsOverlay(props: DetailsOverlayProps) {
  const { agent } = props;

  return (
    <VStack gap="xlarge" padding border className="rounded">
      <HStack>
        <Detail label="Distributor" value={agent.author} />
        <Detail label="Agent Key" value={agent.agentKey} />
      </HStack>
      {agent.blocks && agent.blocks.length > 0 && (
        <HStack>
          <Detail label="Memory Blocks" value={agent.blocks.length} />
          <Detail label="Tools" value={agent.tools?.length || 0} />
        </HStack>
      )}
    </VStack>
  );
}

export function AgentDetails(props: AgentDetailsProps) {
  const { agent } = props;
  const [selectedTab, setSelectedTab] = useState<Tabs>('overview');

  return (
    <CenterContent>
      <div className="relative w-full">
        <div className="pt-[24px]">
          <Tabber value={selectedTab} onChange={setSelectedTab} />
        </div>
        <div className="gap-[32px] py-[32px] flex flex-col">
          <Switcher selectedTab={selectedTab} agent={agent} />
        </div>
        <div className="pb-6 sticky top-[80px]" style={{ float: 'right', width: '280px', marginTop: '-600px' }}>
          <DetailsOverlay agent={agent} />
        </div>
      </div>
    </CenterContent>
  );
}
