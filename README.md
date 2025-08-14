[![MSeeP.ai Security Assessment Badge](https://mseep.net/pr/letta-ai-agent-file-badge.png)](https://mseep.ai/app/letta-ai-agent-file)

<a href="https://docs.letta.com/">
  <img alt="Agent File (.af): An open standard file format for stateful agents." src="/assets/agentfile.png">
</a>

<p align="center">
    <br /><b>Agent File (.af): An open file format for stateful agents</b>.
</p>

<div align="center">
  
[![Discord](https://img.shields.io/discord/1161736243340640419?label=Discord&logo=discord&logoColor=5865F2&style=flat-square&color=5865F2)](https://discord.gg/letta)
[![License](https://img.shields.io/badge/License-Apache%202.0-silver?style=flat-square)](LICENSE)

</div>

<div align="center">
  
[ [View .af Schema](#what-state-does-af-include) ] [ [Download .af Examples](#-download-example-agents) ] [ [Contributing](#-contributing) ]

</div>

---

**Agent File (`.af`)** is an open standard file format for serializing [stateful AI agents](https://www.letta.com/blog/stateful-agents). Originally designed for the [Letta](https://letta.com) framework, Agent File provides a portable way to share agents with persistent memory and behavior.

Agent Files package all components of a stateful agent: system prompts, editable memory (personality and user information), tool configurations (code and schemas), and LLM settings. By standardizing these elements in a single format, Agent File enables seamless transfer between compatible frameworks, while allowing for easy checkpointing and version control of agent state.

## 👾 Download Example Agents

Browse our collection of ready-to-use agents below. Each agent has a direct download link (to download the `.af` file) and a separate instructions README with a guide on how to use the agent. To contribute your own Agent File to the repo, simply [open a pull request](https://github.com/letta-ai/agent-file/compare)!

To use one of the agents, download the agent file (`.af`) by clicking the link below, then upload it to [Letta](https://docs.letta.com) or any other framework that supports Agent File.

|        Agent Type            | Description | Download | Instructions |
|------------------------------|------------|----------|-------------|
| 🧠 **MemGPT**          | An agent with memory management tools for infinite context, as described in the [MemGPT paper](https://research.memgpt.ai/). Two example files: a fresh agent and one with an existing conversation history (pre-fill). | [Download (empty)](https://letta-agent-files.s3.us-east-1.amazonaws.com/memgpt_agent.af) [Download (pre-fill)](https://letta-agent-files.s3.us-east-1.amazonaws.com/memgpt_agent_with_convo.af) | [README](./memgpt_agent) |
| 📚 **Deep Research** | A research agent with planning, search, and memory tools to enable writing deep research reports from iterative research <br />⚠️ *NOTE: requires [Tavily](https://tavily.com/) and [Firecrawl](https://www.firecrawl.dev/) keys* | [Download](https://letta-agent-files.s3.us-east-1.amazonaws.com/deep_research_agent.af) | [README](./deep_research_agent) |
| 🧑‍💼 **Customer Support** | A customer support agent that has dummy tools for handling order cancellations, looking up order status, and also memory | [Download](https://letta-agent-files.s3.us-east-1.amazonaws.com/customer_service.af) | [README](./customer_service_agent) |
| 🕸️ **Stateless Workflow** | A stateless graph workflow agent (no memory and deterministic tool calling) that evaluates recruiting candidates and drafts emails | [Download](https://letta-agent-files.s3.us-east-1.amazonaws.com/outreach_workflow_agent.af) | [README](./workflow_agent) | 
| 🐙 **Composio Tools** | An example of an agent that uses a Composio tool to star a GitHub repository <br />⚠️ *Note: requires enabling [Composio](https://docs.letta.com/guides/agents/composio)* | [Download](https://letta-agent-files.s3.us-east-1.amazonaws.com/composio_github_star_agent.af) | [README](./composio_github_star_agent) |

## Using `.af` with Letta

You can import and export `.af` files to and from any Letta Server (self-deployed with [Docker](https://docs.letta.com/quickstart/docker) or [Letta Desktop](https://docs.letta.com/quickstart/desktop), or via [Letta Cloud](https://docs.letta.com/quickstart/cloud)). To run the import and export commands, you can use the visual Agent Development Environment ([ADE](https://docs.letta.com/agent-development-environment)), or the [REST APIs](https://docs.letta.com/api-reference/overview) or [developer SDKs](https://docs.letta.com/api-reference/overview) (Python and TypeScript).

### Importing Agents

Load downloaded `.af` files into your ADE to easily re-create your agent: 

![Importing Demo](./assets/import_demo.gif)

#### cURL

```sh
# Assuming a Letta Server is running at http://localhost:8283
curl -X POST "http://localhost:8283/v1/agents/import" -F "file=/path/to/agent/file.af"
```

#### Node.js (TypeScript)

```ts
// Install SDK with `npm install @letta-ai/letta-client`
import { LettaClient } from '@letta-ai/letta-client'
import { readFileSync } from 'fs';
import { Blob } from 'buffer';

// Assuming a Letta Server is running at http://localhost:8283
const client = new LettaClient({ baseUrl: "http://localhost:8283" });

// Import your .af file from any location
const file = new Blob([readFileSync('/path/to/agent/file.af')])
const agentState = await client.agents.importAgentSerialized(file, {})

console.log(`Imported agent: ${agentState.id}`);
```

#### Python

```python
# Install SDK with `pip install letta-client`
from letta_client import Letta

# Assuming a Letta Server is running at http://localhost:8283
client = Letta(base_url="http://localhost:8283")

# Import your .af file from any location
agent_state = client.agents.import_agent_serialized(file=open("/path/to/agent/file.af", "rb"))

print(f"Imported agent: {agent.id}")
```

### Exporting Agents 

You can export your own `.af` files to share (or contribute!) by selecting "Export Agent" in the ADE: 

![Exporting Demo](./assets/export_demo.gif)


#### cURL

```sh
# Assuming a Letta Server is running at http://localhost:8283
curl -X GET http://localhost:8283/v1/agents/{AGENT_ID}/export
```

#### Node.js (TypeScript)

```ts
// Install SDK with `npm install @letta-ai/letta-client`
import { LettaClient } from '@letta-ai/letta-client'

// Assuming a Letta Server is running at http://localhost:8283
const client = new LettaClient({ baseUrl: "http://localhost:8283" });

// Export your agent into a serialized schema object (which you can write to a file)
const schema = await client.agents.exportAgentSerialized("<AGENT_ID>");
```

#### Python

```python
# Install SDK with `pip install letta-client`
from letta_client import Letta

# Assuming a Letta Server is running at http://localhost:8283
client = Letta(base_url="http://localhost:8283")

# Export your agent into a serialized schema object (which you can write to a file)
schema = client.agents.export_agent_serialized(agent_id="<AGENT_ID>")
```

## FAQ

### Why Agent File?

The AI ecosystem is witnessing rapid growth in agent development, with each framework implementing its own storage mechanisms. Agent File addresses the need for a standard that enables:

- 🔄 **Portability**: Move agents between systems or deploy them to new environments
- 🤝 **Collaboration**: Share your agents with other developers and the community
- 💾 **Preservation**: Archive agent configurations to preserve your work
- 📝 **Versioning**: Track changes to agents over time through a standardized format

### What state does `.af` include?

A `.af` file contains all the state required to re-create the exact same agent:

| Component | Description |
|-----------|-------------|
| Model configuration | Context window limit, model name, embedding model name |
| Message history | Complete chat history with `in_context` field indicating if a message is in the current context window |
| System prompt | Initial instructions that define the agent's behavior |
| Memory blocks | In-context memory segments for personality, user info, etc. |
| Tool rules | Definitions of how tools should be sequenced or constrained |
| Environment variables | Configuration values for tool execution |
| Tools | Complete tool definitions including source code and JSON schema |

We currently do not support Passages (the units of Archival Memory in Letta/MemGPT), which have support for them on the roadmap.

You can view the entire schema of .af in the Letta repository [here](https://github.com/letta-ai/letta/blob/main/letta/serialize_schemas/pydantic_agent_schema.py).

### Does `.af` work with frameworks other than Letta?

Theoretically, other frameworks could also load in `.af` files if they convert the state into their own representations. Some concepts, such as context window "blocks" which can be edited or shared between agents, are not implemented in other frameworks, so may need to be adapted per-framework.

### How can I add Agent File support to my framework?

Adding `.af` support requires mapping Agent File components (agent state) to your framework's equivalent featureset. The main steps include parsing the schema, translating prompts/tools/memory, and implementing import/export functionality.

For implementation details or to contribute to Agent File, join our [Discord community](https://discord.gg/letta) or check the [Letta GitHub repository](https://github.com/letta-ai/letta).

### How does `.af` handle secrets?

Agents have associated secrets for tool execution in Letta (see [docs](https://docs.letta.com/guides/agents/tool-variables)). When you export agents with secrets, the secrets are set to `null`.

## 🤝 Contributing

We're just launching Agent File and would love your help in shaping its future:

- **Share Example Agents**: Contribute your own `.af` files by [opening a pull request](https://github.com/letta-ai/agent-file/compare) with your agent and usage instructions
- **Join the Discussion**: Connect with other agent developers in our [Discord server](https://discord.gg/letta) to share ideas and agent files
- **Provide Feedback**: Open [GitHub issues](https://github.com/letta-ai/agent-file/issues) with suggestions, feature requests, or to report compatibility challenges
- **Help Refine the Format**: As an emerging format, Agent File will evolve based on community input and real-world usage

## Roadmap 
- [ ] Support MCP servers/configs
- [ ] Support archival memory passages
- [ ] Support data sources (i.e. files)
- [ ] Migration support between schema changes
- [ ] Multi-agent `.af` files
- [ ] Converters between frameworks

---

<div align="center">
  
Made with ❤️ by the Letta team and OSS contributors

**[Documentation](https://docs.letta.com)** • **[Community](https://discord.gg/letta)** • **[GitHub](https://github.com/letta-ai)**

</div>
