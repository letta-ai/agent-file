# Workflow (or Graph) Agent
Letta agents are by default designed to be stateful and have advanced memory capabilities. However, you can still use Letta to design agentic workflows that combined LLMs and tool execution in deterministic ways. To do this, we can configure the agent to disable the memory functionality to essentially create a *stateless* workflow agent. 

This example agent uses mock tools to retrieve a candidate, evaluate them for a role, and either draft an email to them or reject them. Each time you invoke the agent is independent: there is no memory across invocations, making it a "workflow". 

<img width="1351" alt="image" src="https://github.com/user-attachments/assets/ce2c91e6-8b51-471a-8861-15b2111049fd" />


## Configuration
The workflow agent is configured to have:
* No memory blocks
* No message persistence between agent invocations (by setting `message_buffer_autoclear=True`)
* No default Letta tools (tools for memory management or multi-agent communication)
* Empty `system` prompt for the agent (avoid unnecessary tokens) 

Note that you can still re-enable some of these features: for example, you can re-enable memory blocks and memory editing tools to still allow the agent to learn over time, even if it doesn't persist messages across invocations. 

## Workflow Graph 
We define a set of tools and tool rules to create the following stateless workflow agent for evaluating recruiting candidate targets, and emailing candidates that pass the evaluation criteria: 

<img width="628" alt="image" src="https://github.com/user-attachments/assets/45f91654-b7e0-40b7-91b6-3b2fbf4dd81e" />

We define the following set of custom tools for the agent: 
- `retrieve_candidate`: Retrieve a candidate based on their name
- `evaluate_candidate`: Evaluate a candidate based on their name, and return `True` if we want to contact the candidate, `False` otherwise
- `send_email`: Send an email to a candidate by specifying their name and the email content to send 
- `reject`: Reject a candidate
  
We can define the rules for the workflow graph by specifying [tool rules](https://docs.letta.com/guides/agents/tool-rules), which define the order in which tools are executed and the conditions under which a tool is called. For this agent, we define the following tool rules:
- `retrieve_candidate` is run first
- `evaluate_candidate` is run after `retrieve_candidate`
- if `evaluate_candidate` returns `True`, `send_email` is called, otherwise `reject` is called
- The agent terminates after calling `reject` or `send_email`



