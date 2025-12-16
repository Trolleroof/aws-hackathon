"""Test the full endpoint flow"""
from functions import problem_node, target_user, tech_node, solution_node_2, framing_node, restructure_json

print("Testing full endpoint flow...")
print("=" * 50)

json_list = []
content = "Build a simple todo app"

try:
    print("\n1. Calling problem_node...")
    problem_node_result = problem_node(content, json_list)
    print(f"   ✅ Result: {problem_node_result[:50]}...")
    json_list.append(problem_node_result)
    content = f"{content}\n\n{problem_node_result}"
    
    print("\n2. Calling target_user...")
    target_user_result = target_user(content, json_list)
    print(f"   ✅ Result: {target_user_result[:50]}...")
    json_list.append(target_user_result)
    content = f"{content}\n\n{target_user_result}"
    
    print("\n3. Calling tech_node...")
    tech_node_result = tech_node(content, json_list)
    print(f"   ✅ Result: {tech_node_result[:50]}...")
    json_list.append(tech_node_result)
    content = f"{content}\n\n{tech_node_result}"
    
    print("\n4. Calling solution_node_2...")
    solution_node_result = solution_node_2(content, json_list)
    print(f"   ✅ Result: {solution_node_result[:50]}...")
    json_list.append(solution_node_result)
    content = f"{content}\n\n{solution_node_result}"
    
    print("\n5. Calling framing_node...")
    framing_node_result = framing_node(content, json_list)
    print(f"   ✅ Result: {framing_node_result[:50]}...")
    json_list.append(framing_node_result)
    
    print(f"\n6. Final json_list has {len(json_list)} items")
    print(f"   Items: {[item[:30] + '...' for item in json_list]}")
    
    print("\n7. Calling restructure_json...")
    final_result = restructure_json(json_list)
    print(f"   ✅ Final result type: {type(final_result)}")
    print(f"   ✅ Final result: {str(final_result)[:100]}...")
    
    print("\n" + "=" * 50)
    print("✅ All steps completed successfully!")
    
except Exception as e:
    print(f"\n❌ Error occurred: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

