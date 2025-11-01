from typing import List, Optional
from letta_client import Letta
from pydantic import BaseModel, Field
import os

class ResearchPlanData(BaseModel):
    research_plan: List[str] = Field(
        ...,
        description="The sequential research plan to help guide the search process"
    )
    topic: str = Field(
        ...,
        description="The research topic to investigate"
    )

def create_research_plan(agent_state: "AgentState", research_plan: List[str], topic: str):
    """Initiate a research process by coming up with an initial plan for your research process. For your research, you will be able to query the web repeatedly. You should come up with a list of 3-4 topics you should try to search and explore.

    Args:
        research_plan (List[str]): The sequential research plan to help guide the search process
        topic (str): The research topic
    """
    import json

    research_plan_str = f"""The plan of action is to research `{topic}` with the following steps: \n"""
    for i, step in enumerate(research_plan):
        research_plan_str += f"- [ ] Step {i+1} - {step}\n"

    agent_state.memory.update_block_value(label="research_plan", value=research_plan_str)
    
    return "Research plan successfully created, time to execute the plan!" 

def reset_research(agent_state: "AgentState"):
    """ Reset your state, when you terminate a research process. Use this tool to clean up your memory when you no longer need to persist your existing research state, such as if the conversation topic has changed or you need to research a new topic. 
    """
    import json
    agent_state.memory.update_block_value(label="research_plan", value="")
    agent_state.memory.update_block_value(label="research_report", value="")
    
    return "Research state successfully reset"

def register_tools(base_url: str = "http://localhost:8283"):
    """
    Register the research tools with Letta by upserting them.
    
    Args:
        base_url (str): The base URL of your Letta server. Defaults to localhost:8283.
    
    Returns:
        dict: A dictionary containing the registered tools and their status.
    """
    # Create Letta client
    client = Letta(base_url=base_url)
    
    # Register create_research_plan with explicit args schema
    try:
        tool1 = client.tools.upsert_from_function(
            func=create_research_plan,
            args_schema=ResearchPlanData
        )
        print(f"Successfully registered tool: create_research_plan")
    except Exception as e:
        # Silently skip registration errors
        pass
    
    # Register reset_research (no args schema needed since it has no parameters)
    try:
        tool2 = client.tools.upsert_from_function(func=reset_research)
        print(f"Successfully registered tool: reset_research")
    except Exception as e:
        # Silently skip registration errors
        pass
    
    return {
        "create_research_plan": {"status": "success" if 'tool1' in locals() else "error"},
        "reset_research": {"status": "success" if 'tool2' in locals() else "error"}
    }

def setup_exa_mcp_server(api_key: Optional[str] = None, base_url: str = "http://localhost:8283"):
    """
    Set up and connect to the Exa MCP server for web search capabilities.
    
    Args:
        api_key (str, optional): Exa API key. If not provided, will try to get from environment.
        base_url (str): The base URL of your Letta server. Defaults to localhost:8283.
    
    Returns:
        list: List of tool IDs if successful, empty list otherwise
    """
    # Get API key from parameter or environment
    exa_api_key = api_key or os.getenv("EXA_API_KEY")
    
    if not exa_api_key:
        print("Warning: No Exa API key provided. Set EXA_API_KEY environment variable or pass api_key parameter.")
        print("   Get your API key from: https://dashboard.exa.ai/api-keys")
        return []
    
    # Create Letta client
    client = Letta(base_url=base_url)
    
    try:
        # Configure the Exa MCP server using StdioServerConfig
        mcp_server_url = f"https://mcp.exa.ai/mcp?exaApiKey={exa_api_key}"
        
        # Use StdioServerConfig as recommended by Letta docs
        from letta_client.types import StdioServerConfig
        server_config = StdioServerConfig(
            server_name="exa",
            command="npx",
            args=["-y", "mcp-remote", mcp_server_url]
        )
        
        # Add the MCP server first (or skip if it already exists)
        try:
            client.tools.add_mcp_server(request=server_config)
            print("Successfully added Exa MCP server!")
        except Exception as e:
            if "already exists" in str(e):
                # Silently proceed with existing server
                pass
            else:
                raise e
        
        # List available MCP tools from the server
        mcp_tools = client.tools.list_mcp_tools_by_server(mcp_server_name="exa")
        
        # Add only specific tools we want to use
        desired_tools = ['web_search_exa', 'crawling_exa']
        tool_ids = []
        
        for tool in mcp_tools:
            if tool.name in desired_tools:
                try:
                    added_tool = client.tools.add_mcp_tool(
                        mcp_server_name="exa",
                        mcp_tool_name=tool.name
                    )
                    tool_ids.append(added_tool.id)
                except Exception as e:
                    # Silently skip tools that fail to add
                    pass
            else:
                # Skip tools we don't need
                pass
        
        if tool_ids:
            print(f"Successfully added {len(tool_ids)} Exa MCP tools")
        return tool_ids
        
    except Exception as e:
        print(f"Error setting up Exa MCP server: {str(e)}")
        return []

# Example usage
if __name__ == "__main__":
    # Register tools with default localhost URL
    result = register_tools()
    print("\nRegistration Summary:")
    for tool_name, status in result.items():
        print(f"  {tool_name}: {status['status']}")
    
    # Test Exa MCP setup
    exa_tools = setup_exa_mcp_server()
    print(f"\nExa MCP Tools: {exa_tools}")