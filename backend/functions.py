from openai import OpenAI
import json

def problem_node(content: str, context_json: list = None) -> str:
    if context_json is None:
        context_json = []
    
    client = OpenAI(
        base_url="https://api.nova.amazon.com/v1",
        api_key="0628a488-9957-4be3-9f18-c67f6a77cc02",
    )
    
    # Build context message from previous nodes
    context_message = ""
    if context_json:
        context_message = f"\n\nPrevious node results:\n{json.dumps(context_json, indent=2)}"
    
    response = client.chat.completions.create(
        model="AGENT-8bd9670942af44b1b12eccdf45264812",
        messages=[
            {"role": "user", "content": f"Here's the user's idea: {content}{context_message}"}
        ],
    )
    return f"Generated problem node based on content: {content}"


def solution_node(content: str, context_json: list = None) -> str:
    if context_json is None:
        context_json = []
    
    client = OpenAI(
        base_url="https://api.nova.amazon.com/v1",
        api_key="0628a488-9957-4be3-9f18-c67f6a77cc02",
    )
    
    # Build context message from previous nodes
    context_message = ""
    if context_json:
        context_message = f"\n\nPrevious node results:\n{json.dumps(context_json, indent=2)}"
    
    response = client.chat.completions.create(
        model="AGENT-b6448036e3b1456786df717292cabb14",
        messages=[
            {"role": "user", "content": f"Here's the user's idea: {content}{context_message}"}
        ],
    )
    return f"Generated problem node based on content: {content}"


def tech_node(content: str, context_json: list = None) -> str:
    if context_json is None:
        context_json = []
    
    client = OpenAI(
        base_url="https://api.nova.amazon.com/v1",
        api_key="4acc1f5c-e79b-4dc2-a8c6-3c0636263b54",
    )
    
    # Build context message from previous nodes
    context_message = ""
    if context_json:
        context_message = f"\n\nPrevious node results:\n{json.dumps(context_json, indent=2)}"
    
    response = client.chat.completions.create(
        model="AGENT-5d8a50798ac64bf9aaad1a8ffbe62a74",
        messages=[
            {"role": "user", "content": f"Here's the user's idea: {content}{context_message}"}
        ],
    )
    return f"Generated tech node based on content: {content}"

def solution_node_2(content: str, context_json: list = None) -> str:
    if context_json is None:
        context_json = []
    
    client = OpenAI(
        base_url="https://api.nova.amazon.com/v1",
        api_key="0628a488-9957-4be3-9f18-c67f6a77cc02",
    )
    
    # Build context message from previous nodes
    context_message = ""
    if context_json:
        context_message = f"\n\nPrevious node results:\n{json.dumps(context_json, indent=2)}"
    
    response = client.chat.completions.create(
        model="AGENT-5069f9d747224e729a1f152035061af6",
        messages=[
            {"role": "user", "content": f"Here's the user's idea: {content}{context_message}"}
        ],
    )
    return f"Generated problem node based on content: {content}"


def framing_node(content: str, context_json: list = None) -> str:
    if context_json is None:
        context_json = []
    
    client = OpenAI(
        base_url="https://api.nova.amazon.com/v1",
        api_key="0628a488-9957-4be3-9f18-c67f6a77cc02",
    )
    
    # Build context message from previous nodes
    context_message = ""
    if context_json:
        context_message = f"\n\nPrevious node results:\n{json.dumps(context_json, indent=2)}"
    
    response = client.chat.completions.create(
        model="AGENT-2930b9e60add41c7a896797f8726edd1",
        messages=[
            {"role": "user", "content": f"Here's the user's idea: {content}{context_message}"}
        ],
    )
    return f"Generated problem node based on content: {content}"




def restructure_json(json_data: list) -> dict:
    client = OpenAI(
        base_url="https://api.nova.amazon.com/v1",
        api_key="4acc1f5c-e79b-4dc2-a8c6-3c0636263b54",
    )
    response = client.chat.completions.create(
        model="AGENT-2bcaeeb8340f44da959daa8aaa6c5bb3",
        messages=[
            {"role": "user", "content": "hello"}
        ],
    )
    return response.choices[0].message.content