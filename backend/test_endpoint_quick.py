#!/usr/bin/env python3
"""Quick test with timeout and progress"""
import requests
import json
import sys
import signal

def timeout_handler(signum, frame):
    raise TimeoutError("Request timed out")

def test_endpoint():
    url = "http://localhost:8000/api/tool"
    payload = {"idea": "Build a simple todo app"}
    
    print("=" * 60)
    print("Testing /api/tool endpoint with error handling")
    print("=" * 60)
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    print("\n⏳ Sending request (API calls may take 1-2 minutes)...")
    print("   (Each node makes an API call to Amazon Nova)\n")
    
    try:
        # Set a longer timeout since we have 5 API calls
        response = requests.post(url, json=payload, timeout=600)  # 10 minutes
        
        print(f"\n✅ Status Code: {response.status_code}")
        
        if response.status_code == 200:
            try:
                response_json = response.json()
                print(f"✅ Response received successfully!")
                print(f"\nResponse structure:")
                print(f"  - Status: {response_json.get('status', 'N/A')}")
                print(f"  - Nodes completed: {response_json.get('nodes_completed', 'N/A')}")
                print(f"  - Result type: {type(response_json.get('result', 'N/A'))}")
                print(f"\nResult preview (first 200 chars):")
                result = response_json.get('result', '')
                print(f"  {str(result)[:200]}...")
                return True
            except Exception as e:
                print(f"⚠️  Response is not JSON: {e}")
                print(f"Response text (first 500 chars):")
                print(response.text[:500])
                return False
        else:
            print(f"❌ Error Status Code: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except requests.exceptions.Timeout:
        print("\n❌ Request timed out after 10 minutes")
        print("This suggests the API calls to Amazon Nova are taking too long")
        return False
    except requests.exceptions.ConnectionError:
        print("\n❌ Connection error - is the server running?")
        print("Start it with: cd backend && uvicorn main:app --reload --port 8000")
        return False
    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_endpoint()
    print("\n" + "=" * 60)
    if success:
        print("✅ Test completed successfully!")
    else:
        print("❌ Test failed - check logs above")
    print("=" * 60)
    sys.exit(0 if success else 1)

