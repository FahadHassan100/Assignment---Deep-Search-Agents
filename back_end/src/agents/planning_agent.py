
from config.model_config import Gemini20, Gemini25
from agents import Agent
from src.agents.deep_research_system import deep_research_system


planning_agent = Agent(
    name="Planning_agent", 
    instructions="""
    You are a Planning Agent. 
    Break down the user's requirement into actionable steps.
    Once the plan is ready, hand it off to the Deep Research System - (deep_research_system) for execution.
    """,
    handoffs=[deep_research_system],
    model=Gemini25)