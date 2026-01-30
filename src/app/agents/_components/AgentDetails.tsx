'use client';
import { VStack, HStack, Typography } from '@/components';
import { CenterContent } from '@/lib/client/components/CenterContent/CenterContent';
import { useState } from 'react';
import type { AgentFull } from '@/lib/agents-loader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  const tabs: { id: Tabs; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'memoryBlocks', label: 'Memory Blocks' },
    { id: 'tools', label: 'Tools' },
    { id: 'system', label: 'System' },
  ];

  return (
    <HStack gap="medium" className="border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
            value === tab.id
              ? 'border-brand text-brand'
              : 'border-transparent text-text-lighter hover:text-text-default'
          }`}
        >
          <Typography variant="body" bold={value === tab.id}>
            {tab.label}
          </Typography>
        </button>
      ))}
    </HStack>
  );
}

interface BlockViewerProps {
  title: string;
  elements: { label?: string; value: string }[];
  limit?: number;
}

function BlockViewer(props: BlockViewerProps) {
  const { title, elements, limit } = props;

  const displayElements = limit ? elements.slice(0, limit) : elements;
  const hasMore = limit && elements.length > limit;

  return (
    <VStack gap="medium">
      <Typography variant="heading5">{title}</Typography>
      <VStack gap="medium">
        {displayElements.map((element, index) => (
          <div
            key={index}
            className="p-4 bg-background-grey2 rounded border border-border"
          >
            {element.label && (
              <VStack gap="small" paddingBottom="small">
                  <Typography variant="body2" bold>
                      {element.label}
                  </Typography>
              </VStack>
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

  // If README exists, render it
  if (agent.readmeContent) {
    return (
      <div className="max-w-[680px] text-base w-full">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <Typography variant="heading3" className="mt-8 mb-4 first:mt-0 pb-2 border-b border-border">
                {children}
              </Typography>
            ),
            h2: ({ children }) => (
              <Typography variant="heading4" className="mt-8 mb-4 first:mt-0">
                {children}
              </Typography>
            ),
            h3: ({ children }) => (
              <Typography variant="heading5" className="mt-6 mb-3 first:mt-0">
                {children}
              </Typography>
            ),
            h4: ({ children }) => (
              <Typography variant="body" bold className="mt-5 mb-2">
                {children}
              </Typography>
            ),
            p: ({ children }) => (
              <Typography variant="body" color="lighter" className="mb-4 block leading-relaxed">
                {children}
              </Typography>
            ),
            ul: ({ children }) => (
              <ul className="my-6 space-y-2 list-disc list-outside ml-6">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-6 space-y-2 list-decimal list-outside ml-6">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed pl-2 text-base text-text-lighter">
                {children}
              </li>
            ),
            code: ({ children }) =>
                <code className="inline-block bg-background-grey2 px-1.5 py-0.5 mx-0.5 rounded text-sm font-mono text-brand-light-content border border-border align-middle">
                    {children}
                </code>,
            pre: ({ children }) => (
              <pre className="bg-background-grey2 p-4 rounded border border-border overflow-x-auto mb-6 my-4 text-sm font-mono text-text-lighter leading-relaxed">
                {children}
              </pre>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-brand hover:text-brand-hover underline underline-offset-2 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-brand pl-4 py-2 my-4 bg-background-grey2/50 italic">
                {children}
              </blockquote>
            ),
            hr: () => (
              <hr className="my-8 border-t border-border" />
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-text-default">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-text-lighter">{children}</em>
            ),
          }}
        >
          {agent.readmeContent}
        </ReactMarkdown>
      </div>
    );
  }

  // Fallback to original overview
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
      </div>
    </CenterContent>
  );
}
