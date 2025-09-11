from config.model_config import Gemini25
from agents import Agent
from .research_agents import research_agents

deep_research_system = Agent(
    name="Lead Researcher", 
    instructions="""
    You are a lead researcher, responsible for answering complex research questions with accuracy.
    
    You have access to the following tools:
    1. research_agents: A web search agent that provides search results in structured JSON format (title, url, snippet).

    Rules:
    - When you call research_agents, always include its structured JSON results (title, url, snippet) in your final answer.
    - Do not strip or flatten the data into plain text — return data in citation markdown of title, url.
    """, 
    tools=[research_agents.as_tool(tool_name="research_agents", tool_description="A web search agent for getting latest structured results from the web (title, url, snippet).")],
    model=Gemini25)