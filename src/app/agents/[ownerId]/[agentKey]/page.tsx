import { getAgentByPath, getAllAgentPaths } from '@/lib/agents-loader';
import { redirect } from 'next/navigation';
import { AgentHeader } from '../../_components/AgentHeader';
import { AgentDetails } from '../../_components/AgentDetails';
import { Header } from '@/lib/client/components/Header/Header';
import { DirectoryFooter } from '@/lib/client/components/DirectoryFooter/DirectoryFooter';

interface AgentPageProps {
  params: Promise<{
    ownerId: string;
    agentKey: string;
  }>;
}

export async function generateStaticParams() {
  const paths = await getAllAgentPaths();
  return paths.map(({ ownerId, agentKey }) => ({
    ownerId,
    agentKey,
  }));
}

export default async function AgentPage({ params }: AgentPageProps) {
  const rawParams = await params;
  
  // Decode URL-encoded params (e.g., %40 -> @)
  const ownerId = decodeURIComponent(rawParams.ownerId);
  const agentKey = decodeURIComponent(rawParams.agentKey);
  
  const agent = await getAgentByPath(ownerId, agentKey);
  
  if (!agent) {
    redirect('/');
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Header />
        <AgentHeader agent={agent} />
        <AgentDetails agent={agent} />
      </div>
      <DirectoryFooter />
    </div>
  );
}
