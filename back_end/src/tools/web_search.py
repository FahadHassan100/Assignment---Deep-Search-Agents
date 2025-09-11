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

    # print(f"[WEB SEARCH QUERY]: {query}")
    # print(f"[WEB SEARCH RESULT]: {formatted_results}")
    return {
        "query": query,
        "results": formatted_results
    }



#____________________________________Testing________________________________________________




    # return {
    #         "query": query,
    #         "results": [
    #             {
    #                 "title": "14 Best AI Business and Startup Ideas to Start in 2024",
    #                 "url": "https://online.mason.wm.edu/blog/14-best-ai-business-and-startup-ideas-to-start",
    #                 "snippet": "HomeOnline Business Blog14 Best AI Business and Startup Ideas to Start in 2024 # 14 Best AI Business and Startup Ideas to Start in 2024 The following AI-based business ideas can use technology to automate, improve or perform business tasks: AI tools like surveys, focus groups and data analytics can clarify customers’ needs, customer behavior and market trends."
    #             },
    #             {
    #                 "title": "List of AI Business Ideas for Entrepreneurs - Appinventiv",
    #                 "url": "https://appinventiv.com/blog/artificial-intelligence-business-ideas-for-startup/",
    #                 "snippet": "Being one of the superior Generative AI business ideas, content creation tools like ChatGPT, Jasper, Writesonic, etc., empower users to produce diverse content forms, from articles and graphics to personalized videos, significantly streamlining the content creation process. Furthermore, by developing a generative AI-powered content creation tool businesses can tap into a lucrative market opportunity, catering to a wide range of industries that demand rapid, high-quality content production."
    #             },
    #             {
    #                 "title": "The Best AI Business Idea in 2024 - Yahoo Finance",
    #                 "url": "https://finance.yahoo.com/news/best-ai-business-idea-2024-200438351.html",
    #                 "snippet": "News • 2 days ago The Nvidia CEO told Yahoo Finance that US tech can't be left out of China — and should be the world's standard News • 2 days ago Nvidia CEO Jensen Huang joins Yahoo Finance to break down the company's earnings report. News • 2 days ago The company's stock surged after it reversed course on a logo change."
    #             }
    #         ]
    #     }



    


#__________________________________OLD CODE___________________________________________________




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