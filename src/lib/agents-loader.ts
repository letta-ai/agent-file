import fs from 'fs';
import path from 'path';

export interface AgentMetadata {
  ownerId: string;
  agentKey: string;
  name: string;
  description: string;
  summary: string;
  author: string;
  system: string;
  imagePath?: string;
  blocks?: any[];
  tools?: any[];
}

export interface AgentFull extends AgentMetadata {
  agents: any[];
  blocks: any[];
  tools: any[];
  groups: any[];
  files: any[];
  sources: any[];
}

const AGENTS_DIR = path.join(process.cwd(), 'src/agents');

/**
 * Get all owner directories in src/agents/
 */
function getOwnerIds(): string[] {
  if (!fs.existsSync(AGENTS_DIR)) {
    return [];
  }
  
  return fs.readdirSync(AGENTS_DIR).filter((name) => {
    const fullPath = path.join(AGENTS_DIR, name);
    return fs.statSync(fullPath).isDirectory();
  });
}

/**
 * Get all agent keys for a specific owner
 */
function getAgentKeysForOwner(ownerId: string): string[] {
  const ownerPath = path.join(AGENTS_DIR, ownerId);
  
  if (!fs.existsSync(ownerPath)) {
    return [];
  }
  
  return fs.readdirSync(ownerPath).filter((name) => {
    const fullPath = path.join(ownerPath, name);
    return fs.statSync(fullPath).isDirectory();
  });
}

/**
 * Parse agent metadata from .af file
 */
function parseAgentMetadata(
  ownerId: string,
  agentKey: string,
  agentData: any
): AgentMetadata {
  const agent = agentData.agents?.[0] || {};
  
  // Extract summary from system prompt or description
  const system = agent.system || '';
  const description = agent.description || '';
  const summary = description || system.substring(0, 200) + (system.length > 200 ? '...' : '');
  
  // Check for image file
  const agentDir = path.join(AGENTS_DIR, ownerId, agentKey);
  const possibleImages = [
    `${agentKey}.webp`,
    `${agentKey}.png`,
    `${agentKey}.jpg`,
    `${agentKey}.jpeg`,
  ];
  
  let imagePath: string | undefined;
  for (const img of possibleImages) {
    const imgPath = path.join(agentDir, img);
    if (fs.existsSync(imgPath)) {
      imagePath = `/agents/${ownerId}/${agentKey}/${img}`;
      break;
    }
  }
  
  return {
    ownerId,
    agentKey,
    name: agent.name || agentKey,
    description: description,
    summary,
    author: ownerId,
    system,
    imagePath,
    blocks: agentData.blocks || [],
    tools: agentData.tools || [],
  };
}

/**
 * Get all agents across all owners
 */
export async function getAllAgents(): Promise<AgentMetadata[]> {
  const agents: AgentMetadata[] = [];
  const ownerIds = getOwnerIds();
  
  for (const ownerId of ownerIds) {
    const agentKeys = getAgentKeysForOwner(ownerId);
    
    for (const agentKey of agentKeys) {
      try {
        const agentData = await getAgentByPath(ownerId, agentKey);
        if (agentData) {
          agents.push(parseAgentMetadata(ownerId, agentKey, agentData));
        }
      } catch (error) {
        console.error(`Error loading agent ${ownerId}/${agentKey}:`, error);
      }
    }
  }
  
  return agents;
}

/**
 * Get a specific agent by owner and key
 */
export async function getAgentByPath(
  ownerId: string,
  agentKey: string
): Promise<AgentFull | null> {
  const agentDir = path.join(AGENTS_DIR, ownerId, agentKey);
  const agentFilePath = path.join(agentDir, `${agentKey}.af`);
  
  if (!fs.existsSync(agentFilePath)) {
    return null;
  }
  
  try {
    const fileContent = fs.readFileSync(agentFilePath, 'utf-8');
    const agentData = JSON.parse(fileContent);
    
    return {
      ...parseAgentMetadata(ownerId, agentKey, agentData),
      agents: agentData.agents || [],
      blocks: agentData.blocks || [],
      tools: agentData.tools || [],
      groups: agentData.groups || [],
      files: agentData.files || [],
      sources: agentData.sources || [],
    };
  } catch (error) {
    console.error(`Error parsing agent file ${agentFilePath}:`, error);
    return null;
  }
}

/**
 * Get all owner/agent key pairs for static generation
 */
export async function getAllAgentPaths(): Promise<
  Array<{ ownerId: string; agentKey: string }>
> {
  const paths: Array<{ ownerId: string; agentKey: string }> = [];
  const ownerIds = getOwnerIds();
  
  for (const ownerId of ownerIds) {
    const agentKeys = getAgentKeysForOwner(ownerId);
    for (const agentKey of agentKeys) {
      paths.push({ ownerId, agentKey });
    }
  }
  
  return paths;
}
