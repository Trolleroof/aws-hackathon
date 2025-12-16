#!/usr/bin/env python3
"""Quick test script for the /api/tool endpoint"""
import requests
import json
import sys

def test_endpoint():
    url = "http://localhost:8000/api/tool"
    payload = {"idea": "Build a simple todo app"}
    
    print("Testing /api/tool endpoint...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    print("\nSending request (this may take a while due to API calls)...")
    
    try:
        # Set a timeout of 120 seconds since API calls can be slow
        response = requests.post(url, json=payload, timeout=120)
        
        print(f"\n✅ Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        try:
            response_json = response.json()
            print(f"\n✅ Response (JSON):")
            print(json.dumps(response_json, indent=2))
        except:
            print(f"\n⚠️  Response (Text):")
            print(response.text[:500])  # First 500 chars
        
        return response.status_code == 200
        
    except requests.exceptions.Timeout:
        print("\n❌ Request timed out after 120 seconds")
        print("This suggests the API calls to Amazon Nova are taking too long")
        return False
    except requests.exceptions.ConnectionError:
        print("\n❌ Connection error - is the server running?")
        print("Start it with: uvicorn main:app --reload --port 8000")
        return False
    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")
        return False

if __name__ == "__main__":
    success = test_endpoint()
    sys.exit(0 if success else 1)

