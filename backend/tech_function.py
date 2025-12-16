from openai import OpenAI

def tech_node(content: str) -> str:
    client = OpenAI(
        base_url="https://api.nova.amazon.com/v1",
        api_key="4acc1f5c-e79b-4dc2-a8c6-3c0636263b54",
    )
    response = client.chat.completions.create(
        model="AGENT-5d8a50798ac64bf9aaad1a8ffbe62a74",
        messages=[
            {"role": "user", "content": f"Here's the user's idea: {content}"}
        ],
    )
    return f"Generated tech node based on content: {content}"