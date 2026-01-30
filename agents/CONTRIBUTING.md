# Contributing Agents

Thank you for sharing your Letta agent with the community!

This guide covers everything you need to know.

## What Makes a Good Contribution

The best agents in this directory share a few qualities:

- **Purpose-built** — They're designed for something specific, not generic chatbots
- **Thoughtfully trained** — They've been refined over time, with corrections and learned context
- **Well-documented** — Their personality and capabilities are clear from the system prompt
- **Clean and portable** — No sensitive data, no hardcoded references to specific users

## Directory Structure

Your agent should follow this structure:

```
agents/
└── @{owner}/              # Your GitHub handle with @ prefix
    └── {agent-key}/       # URL-safe name (lowercase, hyphens OK)
        ├── {agent-key}.af       # Required: The agent file
        ├── {agent-key}.webp     # Required: Avatar image (square)
        └── README.md            # Optional: Detailed documentation
```

### Naming Conventions

- **Owner ID**: Use your GitHub handle with `@` prefix (e.g., `@letta-ai`, `@yourname`)
- **Agent key**: Lowercase, URL-safe identifier (e.g., `loop`, `research-assistant`, `code-reviewer`)
- **Files**: Must match the agent key exactly (`loop.af`, `loop.webp`)

## Preparing Your Agent

### 1. Export from Letta

**Using the ADE:**
1. Open your agent in the [Agent Development Environment](https://app.letta.com)
2. Click the menu → "Export Agent"
3. Save the `.af` file

**Using the Python SDK:**
```python
from letta_client import Letta

client = Letta(api_key="your-api-key")

agent_file = client.agents.export_file(agent_id="your-agent-id")

with open("your-agent.af", "w") as f:
    f.write(agent_file)
```

**Using the TypeScript SDK:**
```typescript
import { Letta } from "@letta-ai/letta-client";
import fs from "fs";

const client = new Letta({ apiKey: "your-api-key" });

const agentFile = await client.agents.exportFile("your-agent-id");
fs.writeFileSync("your-agent.af", agentFile);
```

### 2. Clean Your Agent File

Make sure that you are not submitting personal information in your agent file. This is called __sanitization__. There are a few ways to do this.

### Agentic sanitization

The quickest way to sanitize an agent is to ask the agent to do so itself.

Steps:


1. **Clone the agent**. In the ADE, this can be done by clicking the "clone agent" button in the three dots next to the agent's name in the top bar.
2. **Ask the agent to delete all personal information.** Make sure your agent has access to memory tools. Double check your agent's work.
3. **Clone the agent again.** This will remove all message history.
4. **Export the agent.**

### Manual sanitization

- **Personal information** — Names, emails, addresses in memory blocks
- **API keys or secrets** — Check `tool_exec_environment_variables` and tool configs
- **Conversation history** — Messages in `in_context_message_ids` may contain private data
- **User-specific context** — Memory blocks like `about_user` should be reset to templates

**Example: Cleaning a memory block**

Before:
```json
{
  "label": "about_user",
  "value": "Name: John Smith\nEmail: john@example.com\nProject: Secret internal tool"
}
```

After:
```json
{
  "label": "about_user",
  "value": "Name: [unknown]\nRole/Work: [unknown]\nCurrent projects: [unknown]"
}
```

### 3. Add an Avatar

Create a square image for your agent:

- **Format**: WebP preferred (PNG, JPG also accepted)
- **Size**: At least 256x256 pixels recommended
- **Aspect ratio**: Must be square (1:1) — will be cropped if not
- **Style**: Should represent your agent's personality/purpose

Save it as `{agent-key}.webp` in your agent directory.

### 4. Write a README (Optional but Recommended)

Add a `README.md` to your agent directory explaining:

- What the agent does
- What makes it special or different
- How it was trained (what scenarios, what corrections)
- Example interactions
- Any tools or integrations it uses

It's good practice to ask the agent to write its own README, but you may do so yourself.

## Submitting Your Contribution

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR-USERNAME/agentfile.directory.git
cd agentfile.directory
```

### 2. Create Your Agent Directory

```bash
mkdir -p agents/@your-handle/your-agent
```

### 3. Add Your Files

```bash
cp /path/to/your-agent.af agents/@your-handle/your-agent/your-agent.af
cp /path/to/avatar.webp agents/@your-handle/your-agent/your-agent.webp
```

### 4. Test Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and verify your agent appears correctly.

### 5. Commit and Push

```bash
git add agents/@your-handle/
git commit -m "feat: add @your-handle/your-agent"
git push origin main
```

### 6. Open a Pull Request

Include in your PR description:
- What the agent does
- Why you think it would be valuable in this directory
- Any special setup or considerations

## Review Process

We review contributions for:

1. **Privacy** — No sensitive data in memory blocks or messages
2. **Quality** — Agent has a clear purpose and well-written system prompt
3. **Portability** — Works when imported to a fresh Letta server
4. **Completeness** — All required files present with correct naming

A Letta agent specialized for this repository will also be asked to review your pull request.

## Best Practices

### Memory Block Design

Good agents have thoughtful memory structures. Consider blocks for:

- **Persona** — Who the agent is, how it behaves
- **User context** — Template for learning about new users
- **Preferences** — How to adapt responses
- **Learned corrections** — Mistakes to avoid
- **Domain knowledge** — Relevant facts for the agent's purpose

### System Prompt Tips

- Be specific about personality and tone
- Include examples of good vs bad responses
- Define boundaries (what the agent should/shouldn't do)
- Explain how memory should be used

### Tool Selection

Only include tools the agent actually needs. Common useful tools:
- `archival_memory_insert/search` — For long-term knowledge
- `conversation_search` — For recalling past interactions
- `memory_replace/insert/rethink` — For updating memory blocks
- `web_search/fetch_webpage` — For agents that need internet access

## Questions?

Open an issue or reach out on [Discord](https://discord.gg/letta).
