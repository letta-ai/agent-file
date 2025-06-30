# Composio Example Agent 

> ⚠️ **Warning:** Make sure you enable Composio in your desktop app by setting a Composio key, or run the Letta server with `COMPOSIO_API_KEY` set when you start the server ([documentation](https://docs.letta.com/guides/agents/composio)). You will also need to enable the Github star tool on Composio. 

This is an agent which uses a Composio tool to star a provided repository. If you have Composio enabled on Letta, you can load the `composio_github_star_agent.af` into the ADE and chat with an agent that has the ability to star github repos. 

<img width="1451" alt="image" src="https://github.com/user-attachments/assets/96aac113-64c0-47e7-ac36-037374c8ba8d" />

## Re-creating the Composio agent 
To create the agent from the client, you can run: 
```
pip install -r requirements.txt
python composio_agent.py
```
