from letta_client import Letta 
import os
from dotenv import load_dotenv

def retrieve_candidate(candidate_name: str): 
    """ 
    Retrieve a candidate to evaluate.

    Args: 
        candidate_name (str): The name of the candidate to retrieve. 
    """
    import random
    return f"The candidate {candidate_name} is a software engineer working at Letta and based in SF"

def evaluate_candidate(): 
    """ Evaluate the candidate. Return True to move forward, False to reject them."""
    import random
    return random.random() > 0.5

def send_email(candidate_name: str, email_subject: str, email_content: str): 
    """ 
    Send an email to the candidate. 

    Args: 
        candidate_name (str): The name of the candidate to send the email to. 
        email_subject (str): The subject of the email. 
        email_content (str): The content of the email. 
    """
    print(f"Sending email to {candidate_name}")
    return f"""
    Subject: {email_subject}

    {email_content}
    
    """

def reject(candidate_name: str): 
    """
    Reject the candidate. 

    Args: 
        candidate_name (str): The name of the candidate to reject. 
    """
    print(f"Rejecting {candidate_name}")


load_dotenv()
client = Letta(api_key=os.getenv("LETTA_API_KEY"))
retrieve_candidate_tool = client.tools.upsert_from_function(func=retrieve_candidate)
evaluate_candidate_tool = client.tools.upsert_from_function(func=evaluate_candidate)
send_email_tool = client.tools.upsert_from_function(func=send_email)
reject_tool = client.tools.upsert_from_function(func=reject)

# create agent
agent = client.agents.create(
    system="", 
    name="outreach_workflow_agent", 
    description="An simple workflow agent that has memory disabled, so that each request is independent.",
    memory_blocks=[], 
    model="openai/gpt-4o-mini", 
    include_base_tools=False, 
    message_buffer_autoclear=True,
    initial_message_sequence=[],
    tool_ids=[retrieve_candidate_tool.id, evaluate_candidate_tool.id, send_email_tool.id, reject_tool.id], 
    tool_rules= [
        {
            "type": "run_first" , 
            "tool_name": "retrieve_candidate"
        }, 
        {
            "type": "constrain_child_tools", 
            "tool_name": "retrieve_candidate", 
            "children": ["evaluate_candidate"]
        },
        {
            "type": "conditional", 
            "tool_name": "evaluate_candidate", 
            "child_output_mapping": {
                "True": "send_email",
                "False": "reject"
            }, 
            "default_child": "reject"
        }, 
        {
            "type": "exit_loop", 
            "tool_name": "reject"
        }, 
        {
            "type": "exit_loop", 
            "tool_name": "send_email"
        }
    ]
)

print(agent.id)
print("tools", [t.name for t in agent.tools])

# Export agent to .af file
import json
with open("outreach_workflow_agent.af", "w") as f:
    json.dump(client.agents.export_file(agent_id=agent.id), f, indent=2)
