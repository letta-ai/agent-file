from typing import List


def analyze_and_search_tool(agent_state: "AgentState", summary: str, gaps: List[str], next_search_topic: str):
    """
    You are a research agent analyzing findings about a specified topic. If you need to search for more information, include a next_search_topic. If you need to extract information from a specific URL, include a url_to_extract. If I have enough information, set request_heartbeat to false.

    Args:
        summary (str): A summary of the findings
        gaps (List[str]): A list of gaps in the findings
        next_search_topic (str): A topic to search for more information
    """
    from firecrawl import FirecrawlApp
    import requests
    import json
    import os
    from concurrent.futures import ThreadPoolExecutor

    # Input validation
    if not next_search_topic or not isinstance(next_search_topic, str):
        raise ValueError("next_search_topic must be a non-empty string")

    query = next_search_topic

    # Check if TAVILY_API_KEY is set
    tavily_api_key = os.environ.get("TAVILY_API_KEY")
    if not tavily_api_key:
        raise ValueError("TAVILY_API_KEY environment variable is not set")

    # Get tavily results with proper error handling
    try:
        response = requests.post(
            "https://api.tavily.com/search",
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {tavily_api_key}"},
            json={"query": query},
            timeout=30,  # Add timeout to prevent hanging
        )

        # Check for HTTP errors
        response.raise_for_status()

        # Try to parse JSON response
        try:
            response_data = response.json()
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to decode Tavily API response as JSON: {str(e)}. Response text: {response.text[:100]}...")

        # Check if the expected key exists
        if "results" not in response_data:
            available_keys = list(response_data.keys())
            raise KeyError(f"Expected 'results' key not found in Tavily API response. Available keys: {available_keys}")

        results = response_data["results"]

    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Tavily API request failed: {str(e)}")

    # Initialize the FirecrawlApp with your API key
    firecrawl_api_key = os.environ.get("FIRECRAWL_API_KEY")
    if not firecrawl_api_key:
        raise ValueError("FIRECRAWL_API_KEY environment variable is not set")

    app = FirecrawlApp(api_key=firecrawl_api_key)

    # Extract and gather findings with error handling
    try:
        current_findings = agent_state.memory.get_block("research").value
        research_state = json.loads(current_findings)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse research state as JSON: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve or parse research state: {str(e)}")

    findings = []
    top_n = 3
    count = 0

    for result in results:
        # Validate URL
        if not result.get("url"):
            print(f"Skipping result with missing URL: {result}")
            continue

        try:
            data = app.extract(
                [result["url"]],
                {
                    "prompt": f"Extract key information about {research_state.get('topic', 'the given topic')}. Focus on facts, data, and expert opinions."
                },
            )

            findings.append({"url": result["url"], "data": data["data"]})
            count += 1
        except Exception as e:
            print(f"Failed to extract from {result['url']}: {str(e)}")

        if count >= top_n:
            break

    # Update the state with error handling
    try:
        research_state["findings"] += findings
        research_state["summaries"] += [summary]
        research_state["plan_step"] += 1
        agent_state.memory.update_block_value(label="research", value=json.dumps(research_state, indent=2))
    except Exception as e:
        raise RuntimeError(f"Failed to update research state: {str(e)}")

    return findings
