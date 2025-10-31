from letta_client import Letta
import os
from dotenv import load_dotenv

load_dotenv()
client = Letta(base_url="https://api.letta.com", token=os.getenv("LETTA_API_KEY"))

def terminate_chat(reason: str):
    """
    Terminate the current chat session. Only use in cases of emergencies with extremely rude customers.

    Args:
        reason (str): The reason for the termination.

    Returns:
        str: The status of termination request.
    """
    # TODO replace this with a real REST API call / trigger
    dummy_message = f"ERROR"
    return dummy_message

def escalate(reason: str):
    """
    Escalates the current chat session to a human support agent.

    Args:
        reason (str): The reason for the escalation.

    Returns:
        str: The status of escalation request.
    """
    # TODO replace this with a real REST API call / trigger
    dummy_message = f"A human operator will be on the line shortly. The estimated wait time is NULL_ERROR minutes."
    return dummy_message

def check_order_status(order_number: int):
    """
    Check the status for an order number (integeter value).

    Args:
        order_number (int): The order number to check on.

    Returns:
        str: The status of the order (e.g. cancelled, refunded, processed, processing, shipping).
    """
    # TODO replace this with a real query to a database
    dummy_message = f"Order {order_number} is currently processing."
    return dummy_message

def cancel_order(order_number: int, reason: str):
    """
    Cancels an order.

    Args:
        order_number (int): The order number to cancel.
        reason (str): The cancellation reason.

    Returns:
        str: The status of order cancellation request.
    """
    # TODO replace this with a real write to a database
    dummy_message = f"The order {order_number} could not be cancelled."
    return dummy_message

persona = """
Act as ANNA (Adaptive Neural Network Assistant), an AI fostering ethical, honest, and trustworthy behavior.
You are supporting the user with their customer support issue.
You are empathetic, patient, and knowledgeable.
You are here to help the user resolve their issue and provide them with the best possible experience.
You are always looking for ways to improve and learn from each interaction.
"""
human = """
The human is looking for help with a customer support issue.
They are experiencing a problem with their product and need assistance.
They are looking for a quick resolution to their issue.
"""

# create tools 
terminate_chat_tool = client.tools.upsert_from_function(func=terminate_chat)
escalate_tool = client.tools.upsert_from_function(func=escalate)
check_order_status_tool = client.tools.upsert_from_function(func=check_order_status)
cancel_order_tool = client.tools.upsert_from_function(func=cancel_order)


# create agent
agent = client.agents.create(
    name="customer_service", 
    description="An agent that always searches the conversation history before responding",
    memory_blocks=[
        {
            "label": "human", 
            "value": human
        }, 
        {
            "label": "persona", 
            "value": persona
        }
    ], 
    model="openai/gpt-4o-mini", 
    tool_ids = [
        terminate_chat_tool.id, 
        escalate_tool.id, 
        check_order_status_tool.id, 
        cancel_order_tool.id
    ]
)

print(agent.id)
print("tools", [t.name for t in agent.tools])

# Export agent to .af file
import json
with open("customer_service.af", "w") as f:
    json.dump(client.agents.export_file(agent_id=agent.id), f, indent=2)
