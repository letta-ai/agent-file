import {
  HStack,
  NiceGridDisplay,
  Typography,
  VStack,
} from '@/components';
import { Section } from '@/lib/client/components/Section/Section';
import { AgentFileCard } from '@/lib/client/components/AgentFileCard/AgentFileCard';
import { getAllAgents } from '@/lib/agents-loader';
import { redirect } from 'next/navigation';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  
  // Load all agents
  const allAgents = await getAllAgents();
  
  // Filter agents based on search query
  const filteredAgents = query
    ? allAgents.filter((agent) => {
        const searchText = query.toLowerCase();
        return (
          agent.name.toLowerCase().includes(searchText) ||
          agent.description.toLowerCase().includes(searchText) ||
          agent.summary.toLowerCase().includes(searchText) ||
          agent.author.toLowerCase().includes(searchText)
        );
      })
    : allAgents;

  return (
    <div className="max-w-[1296px] z-[1] w-full mt-[48px] mx-auto relative bg-background">
      <VStack paddingBottom>
        <Section title="Search Agents">
          <form action="/search" method="get">
            <input
              type="search"
              name="q"
              placeholder="Search for agents..."
              defaultValue={query}
              className="w-full px-4 py-2 border rounded-md"
            />
          </form>
          
          <div className="mt-6">
            {query && (
              <Typography variant="body" color="lighter">
                {filteredAgents.length} results for &quot;{query}&quot;
              </Typography>
            )}
          </div>

          <NiceGridDisplay itemWidth="292px" itemHeight="155px">
            {filteredAgents.map((agent) => (
              <AgentFileCard
                agent={{
                  ...agent,
                  imageSrc: agent.imagePath,
                }}
                key={`${agent.ownerId}/${agent.agentKey}`}
              />
            ))}
          </NiceGridDisplay>

          {filteredAgents.length === 0 && query && (
            <div className="text-center py-12">
              <Typography variant="large" color="lighter">
                No agents found matching &quot;{query}&quot;
              </Typography>
            </div>
          )}
        </Section>
      </VStack>
    </div>
  );
}
