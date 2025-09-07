from agents import function_tool, RunContextWrapper
from typing import Optional
from dataclasses import dataclass
from tavily import TavilyClient
import os


tavily_api_key = os.environ.get("TAVILY_API_KEY")


tavily_client = TavilyClient(api_key=tavily_api_key)

@dataclass
class UserContext:
    email: Optional[str] = None
    username: Optional[str] = None
    user_email: Optional[str] = None
    deep_search: Optional[bool] = False


@function_tool()
async def search_web(local_content: RunContextWrapper[UserContext], query: str) -> dict:
    # print(f"Search query is:{query} and SOME DATA {local_content.context}")
    # return "No Data found"
    print("\n\n THIS IS TAVILY RESPONSE\n")
    response = tavily_client.search(query)
    results = response.get("results", [])
    
    if not results:
        return {"results": [], "message": "No results found."}
        # return "No results found."

    # return all results instead of just top one
    formatted_results = [
        {
            "title": r.get("title", "No title"),
            "url": r.get("url", "No link"),
            "snippet": r.get("content", "No content")
        }
        for r in results
    ]

    print(f"[WEB SEARCH QUERY]: {query}")
    print(f"[WEB SEARCH RESULT]: {formatted_results}")
    return {
        "query": query,
        "results": formatted_results
    }
    # top_result = results[0]
    # title = top_result.get("title", "No title")
    # link = top_result.get("url", "No link")
    # snippet = top_result.get("content", "No content")

    # return f"Top result for '{query}':\n\n {title}\n {snippet}\n {link}"


    # print(response)
    # return response
    
# print(f"\n UserInfo: {local_context.context}, \n Agent: {agent}\n")



#_____________________________________________________________________________________


# @function_tool()
# async def web_search(local_content: RunContextWrapper[UserContext], query: str) -> str:

#     print("\n\n THIS IS TAVILY RESPONSE\n")
#     response = tavily_client.search(query)
#     results = response.get("results", [])
    
#     if not results:
#         return "No results found."

#     top_result = results[0]
#     title = top_result.get("title", "No title")
#     link = top_result.get("url", "No link")
#     snippet = top_result.get("content", "No content")

#     return f"Top result for '{query}':\n\n {title}\n {snippet}\n {link}"