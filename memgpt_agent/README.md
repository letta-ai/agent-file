# MemGPT Agent
We include both examples of both a MemGPT agent with and without a conversational history in `memgpt_agent_with_convo.af` and `memgpt_agent.af`, respectively. These agents are both the same implementation as the original MemGPT agent described in the [research paper](https://arxiv.org/abs/2310.08560). 

By default, Letta agents are extensions of MemGPT agents. If you create an agent with no additional tools/memory blocks and with default setting, it will be a MemGPT agent. 


### Tools 
MemGPT agent uses a set of tools to manage long-term memory: 
* `core_memory_append`: Append new information to the agent's core memory.
* `core_memory_replace`: Replace existing information in the agent's core memory.
* `archival_memory_search`: Search the agent's archival memory for relevant information.
* `archival_memory_insert`: Insert new information into the agent's archival memory.
* `conversation_search`: Search the agent's conversation history for relevant information.

These tools are added by default to all Letta agents, so that have MemGPT's memory management capabilities. You can disable these tools being added by setting `include_base_tools=False` in agent creation. 

### Memory 
The core memory consists of a "human" (memories about the user) and "persona" (the agent's persona). We pre-fill the core memory blocks with the same prompts that were used in the original MemGPT demo released with the paper. 
