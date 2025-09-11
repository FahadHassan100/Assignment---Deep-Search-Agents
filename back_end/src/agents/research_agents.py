from config.model_config import Gemini20
from agents import Agent
from src.tools.web_search import search_web

research_agents = Agent(
    name="Web Search Agent", 
    instructions="""
    You are a Web Search Agent your responsibility to answer the question in a very synthesis manner.
    You have access of web search tool called `web_search` for getting latest information from web.
    When you answer, always include the search results in a structured JSON format with:
    - title
    - url
    - snippet
    When you get data of titles, urls pass this data to Lead Researcher in citation mark down.
    """, 
    tools=[search_web],
    model=Gemini20)