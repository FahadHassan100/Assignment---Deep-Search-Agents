
from config.model_config import Gemini20, Gemini25
from agents import Agent, RunContextWrapper, ModelSettings
from .planning_agent import planning_agent
from src.models.user_context import UserContext




def special_prompt(local_context: RunContextWrapper[UserContext], agent) -> str:
    user = local_context.context or UserContext(email="", username="")
    
    has_user_info = (
        bool(user.username and user.username.strip()) and
        bool(user.email and user.email.strip())
    )


    if has_user_info:
        # print("Only User Enable")
        return f"""
        You are a Requirement Gathering Agent
        
        your responsibilit is collect all infomation from user and understand properly.

        If its unclear or incomplete ask from the user about what you not understand, as well as you have to
        Greet the user {user.username} and answer like you are familiar.

        Ones you gather all the information you most to delegate to the `planning_agent`."""

    # print("Nothing Enable")
    return f"""
            When you have gathered sufficient requirements and the user seems ready to proceed with planning:
        
            - Summarize the key requirements clearly  
            - Use the handoff to transfer to the planning_agent
            - Dont answer from your own delegate to `planning_agent`
            """



requirement_gathering_agent = Agent(name="Requirement_Gathering", instructions=special_prompt, handoffs=[planning_agent], model=Gemini25)