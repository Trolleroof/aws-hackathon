from openai import OpenAI
import json
import logging
import time

logger = logging.getLogger(__name__)

def problem_node(content: str, context_json: list = None) -> str:
    if context_json is None:
        context_json = []
    
    try:
        client = OpenAI(
            base_url="https://api.nova.amazon.com/v1",
            api_key="0628a488-9957-4be3-9f18-c67f6a77cc02",
            timeout=120.0  # 2 minute timeout
        )
        
        # Build context message from previous nodes
        context_message = ""
        if context_json:
            context_message = f"\n\nPrevious node results:\n{json.dumps(context_json, indent=2)}"
        
        logger.info(f"Calling problem_node API with content length: {len(content)}")
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="AGENT-8bd9670942af44b1b12eccdf45264812",
            messages=[
                {"role": "user", "content": f"Here's the user's idea: {content}{context_message}"}
            ],
        )
        
        elapsed = time.time() - start_time
        logger.info(f"problem_node API call completed in {elapsed:.2f}s")
        
        # Return actual response content if available, otherwise fallback
        if response.choices and len(response.choices) > 0:
            api_result = response.choices[0].message.content
            return api_result if api_result else f"Generated problem node based on content: {content}"
        return f"Generated problem node based on content: {content}"
    except Exception as e:
        logger.error(f"Error in problem_node: {e}", exc_info=True)
        raise


def target_user(content: str, context_json: list = None) -> str:
    if context_json is None:
        context_json = []
    
    try:
        client = OpenAI(
            base_url="https://api.nova.amazon.com/v1",
            api_key="0628a488-9957-4be3-9f18-c67f6a77cc02",
            timeout=120.0
        )
        
        context_message = ""
        if context_json:
            context_message = f"\n\nPrevious node results:\n{json.dumps(context_json, indent=2)}"
        
        logger.info(f"Calling target_user API with content length: {len(content)}")
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="AGENT-b6448036e3b1456786df717292cabb14",
            messages=[
                {"role": "user", "content": f"Here's the user's idea: {content}{context_message}"}
            ],
        )
        
        elapsed = time.time() - start_time
        logger.info(f"target_user API call completed in {elapsed:.2f}s")
        
        if response.choices and len(response.choices) > 0:
            api_result = response.choices[0].message.content
            return api_result if api_result else f"Generated target user node based on content: {content}"
        return f"Generated target user node based on content: {content}"
    except Exception as e:
        logger.error(f"Error in target_user: {e}", exc_info=True)
        raise


def tech_node(content: str, context_json: list = None) -> str:
    if context_json is None:
        context_json = []
    
    try:
        client = OpenAI(
            base_url="https://api.nova.amazon.com/v1",
            api_key="4acc1f5c-e79b-4dc2-a8c6-3c0636263b54",
            timeout=120.0
        )
        
        context_message = ""
        if context_json:
            context_message = f"\n\nPrevious node results:\n{json.dumps(context_json, indent=2)}"
        
        logger.info(f"Calling tech_node API with content length: {len(content)}")
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="AGENT-5d8a50798ac64bf9aaad1a8ffbe62a74",
            messages=[
                {"role": "user", "content": f"Here's the user's idea: {content}{context_message}"}
            ],
        )
        
        elapsed = time.time() - start_time
        logger.info(f"tech_node API call completed in {elapsed:.2f}s")
        
        if response.choices and len(response.choices) > 0:
            api_result = response.choices[0].message.content
            return api_result if api_result else f"Generated tech node based on content: {content}"
        return f"Generated tech node based on content: {content}"
    except Exception as e:
        logger.error(f"Error in tech_node: {e}", exc_info=True)
        raise

def solution_node_2(content: str, context_json: list = None) -> str:
    if context_json is None:
        context_json = []
    
    try:
        client = OpenAI(
            base_url="https://api.nova.amazon.com/v1",
            api_key="0628a488-9957-4be3-9f18-c67f6a77cc02",
            timeout=120.0
        )
        
        context_message = ""
        if context_json:
            context_message = f"\n\nPrevious node results:\n{json.dumps(context_json, indent=2)}"
        
        logger.info(f"Calling solution_node_2 API with content length: {len(content)}")
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="AGENT-5069f9d747224e729a1f152035061af6",
            messages=[
                {"role": "user", "content": f"Here's the user's idea: {content}{context_message}"}
            ],
        )
        
        elapsed = time.time() - start_time
        logger.info(f"solution_node_2 API call completed in {elapsed:.2f}s")
        
        if response.choices and len(response.choices) > 0:
            api_result = response.choices[0].message.content
            return api_result if api_result else f"Generated solution node based on content: {content}"
        return f"Generated solution node based on content: {content}"
    except Exception as e:
        logger.error(f"Error in solution_node_2: {e}", exc_info=True)
        raise


def framing_node(content: str, context_json: list = None) -> str:
    if context_json is None:
        context_json = []
    
    try:
        client = OpenAI(
            base_url="https://api.nova.amazon.com/v1",
            api_key="0628a488-9957-4be3-9f18-c67f6a77cc02",
            timeout=120.0
        )
        
        context_message = ""
        if context_json:
            context_message = f"\n\nPrevious node results:\n{json.dumps(context_json, indent=2)}"
        
        logger.info(f"Calling framing_node API with content length: {len(content)}")
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="AGENT-2930b9e60add41c7a896797f8726edd1",
            messages=[
                {"role": "user", "content": f"Here's the user's idea: {content}{context_message}"}
            ],
        )
        
        elapsed = time.time() - start_time
        logger.info(f"framing_node API call completed in {elapsed:.2f}s")
        
        if response.choices and len(response.choices) > 0:
            api_result = response.choices[0].message.content
            return api_result if api_result else f"Generated framing node based on content: {content}"
        return f"Generated framing node based on content: {content}"
    except Exception as e:
        logger.error(f"Error in framing_node: {e}", exc_info=True)
        raise




def restructure_json(json_data: list) -> str:
    try:
        client = OpenAI(
            base_url="https://api.nova.amazon.com/v1",
            api_key="4acc1f5c-e79b-4dc2-a8c6-3c0636263b54",
            timeout=120.0
        )
        
        logger.info(f"Calling restructure_json API with {len(json_data)} items")
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="AGENT-2bcaeeb8340f44da959daa8aaa6c5bb3",
            messages=[
                {"role": "user", "content": f"Restructure this JSON data: {json.dumps(json_data, indent=2)}"}
            ],
        )
        
        elapsed = time.time() - start_time
        logger.info(f"restructure_json API call completed in {elapsed:.2f}s")
        
        if response.choices and len(response.choices) > 0:
            return response.choices[0].message.content
        return json.dumps(json_data, indent=2)
    except Exception as e:
        logger.error(f"Error in restructure_json: {e}", exc_info=True)
        # Return the original JSON if restructuring fails
        return json.dumps(json_data, indent=2)