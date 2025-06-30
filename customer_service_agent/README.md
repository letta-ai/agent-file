# Customer Service Agent
This is an example of a customer service agent which has long-term memory and can autonomously call tools to resolve customer service issues. The customer service agent is a MemGPT agent (with all the MemGPT base tools) with additional tools for customer service. 

The agent has the following dummy tools attached: 

- `terminate_chat`: Terminate the current chat session. Only use in cases of emergencies with extremely rude customers.
- `escalate`: Escalates the current chat session to a human support agent.
- `check_order_status`: Check the status for an order number (integer value).
- `cancel_order`: Cancel an order.

The agent has the following core memory blocks (which can be expanded on over time): 

- `human`: The name of the human (in this case, Sarah)
- `persona`: The persona of the agent 
