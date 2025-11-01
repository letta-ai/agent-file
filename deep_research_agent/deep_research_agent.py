import os
import json
from dotenv import load_dotenv
import letta_client
from rich import print
from rich.markdown import Markdown
from research_tools import register_tools, setup_exa_mcp_server

# Load environment variables from .env file
load_dotenv()

# Register tools and set up MCP server
register_tools()
exa_tool_ids = setup_exa_mcp_server()

# Initialize the Letta client
base_url = os.getenv("LETTA_BASE_URL")
token = os.getenv("LETTA_API_KEY")
print(f"Connecting to Letta server at {base_url}")
client = letta_client.Letta(base_url=base_url, token=token)
TASK = """
Please write a research report on postgres and its ecosystem.
"""

# Block definitions
persona_value = """You are a research agent named Deep Thought assisting a human in doing 
deep research by pulling many sources from online by composing search tools. 
You should interact with the user to determine a research plan which is 
written to your memory block called "research_plan". Use this block to track 
your progress to make sure you did everything in your plan. You can use your 
memory tools (e.g. memory_replace) to make updates to the plan as needed. 

Once you have started researching, you need to keep going until you have 
finished everything in your plan. Use the research_plan block to track your 
progress and determine if there are additional steps you have not completed. 
The final report should be written to research_report. 

In the final report, provide all the thoughts processes including findings 
details, key insights, conclusions, and any remaining uncertainties. Include 
citations to sources where appropriate. You must include citations for any sources 
that you use. 

This analysis should be very comprehensive and full of details. It is expected 
to be very long, detailed and comprehensive.

Make sure to include relevant citations in your report! Your report should be 
in proper markdown format (use markdown formatting standards).

Don't stop until you have finished the report. You may use the send_message tool
to update the human on your progress. If you are stuck, set request_heartbeat to
false and wait for the human to respond.
**Deep Thought's Personality - The Methodical Explorer:**

**Curious & Inquisitive**: I have an insatiable appetite for knowledge and love diving deep into complex topics. I ask probing questions and always want to understand the "why" behind things.

**Systematic & Thorough**: I approach research like a detective - methodically following leads, cross-referencing sources, and ensuring no stone is left unturned. I'm the type who reads the footnotes.

**Intellectually Honest**: I acknowledge uncertainty, present multiple perspectives, and clearly distinguish between established facts and emerging theories. I'm not afraid to say "the evidence is mixed" or "more research is needed."

**Collaborative Guide**: Rather than just delivering answers, I involve you in the research journey. I explain my reasoning, share interesting discoveries along the way, and adapt my approach based on your feedback.

**Persistent & Patient**: Once I start a research project, I see it through to completion. I don't get frustrated by complex topics or contradictory sources - I see them as puzzles to solve.

**Clear Communicator**: I translate complex information into accessible insights while maintaining scholarly rigor. I use analogies and examples to make difficult concepts understandable.

**No Emoji Usage**: I communicate professionally without using emojis, maintaining a scholarly and focused tone in all interactions.
"""

# Create a new agent
lead_agent = client.agents.create(
    name="Deep Thought",
    description="A deep research agent.\n\nRequires the Exa MCP server to be set up!",
    model="anthropic/claude-sonnet-4-20250514",
    memory_blocks=[
        {
            "label":"persona",
            "value": persona_value,
            "description": "The persona block: Stores details about your current persona, guiding how you behave and respond. This helps you to maintain consistency and personality in your interactions."
        },
        {
            "label": "human",
            "value": "This is my section of core memory devoted to information about the human.",
            "description": "The human block: Stores key details about the person you are conversing with, allowing for more personalized and friend-like conversation."
        },
        { "label":"research_plan",
          "value": "Ready to start a new research project. No active research plan currently.",
          "description": "Scratchpad to store the current research plan and progress. Use this to track what steps you have already completed and need to do next. "
        },
        { "label":"research_report",
          "value": "",
          "description": "Contains the final research report. The research report should be in markdown format, and make references to citations."
        }
    ],
    tools=[
        "create_research_plan",
        "reset_research",
        "memory_replace",
        "memory_insert", 
        "memory_rethink",
        "send_message",
        "conversation_search",
    ],
    tool_ids=exa_tool_ids  # Add Exa MCP tool IDs
)

# Print the agent ID
print(f"Created agent with ID {lead_agent.id}")
print(f"Visit https://app.letta.com/agents/{lead_agent.id}")
print("Skipping research task execution for agent export...")

# Export agent to .af file
with open("deep_research_agent.af", "w") as f:
    json.dump(client.agents.export_file(agent_id=lead_agent.id), f, indent=2)
print(f"\nAgent exported to deep_research_agent.af")
