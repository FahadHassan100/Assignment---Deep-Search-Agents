from agents import Agent, Runner, RunContextWrapper, RunItemStreamEvent, ToolCallOutputItem
from openai.types.responses import ResponseTextDeltaEvent
import json
from config.model_config import Gemini20, Gemini25
from typing import Optional
from dataclasses import dataclass
from src.agents.planning_agent import planning_agent
from config.model_config import *

@dataclass
class UserContext:
    email: Optional[str] = None
    username: Optional[str] = None
    user_email: Optional[str] = None
    deep_search: Optional[bool] = False

def special_prompt(local_context: RunContextWrapper[UserContext], agent) -> str:
    user = local_context.context or UserContext(email="", username="")
    
    has_user_info = (
        bool(user.username and user.username.strip()) and
        bool(user.email and user.email.strip())
    )


    if has_user_info:
        # print("Only User Enable")
        return f"""You are a Requirement Gathering Agent and your responsibilit is collect all infomation from user if its unclear or incomplete as well as you have to
          Greet the user {user.username} and answer like you are familiar.
          Ones you gather all the information delegate to `planning_agent`."""

    # print("Nothing Enable")
    return "You are a helpful assistant."



requirement_gathering_agent = Agent(name="Requirement_Gathering", instructions=special_prompt, handoffs=[planning_agent], model=Gemini25)

async def call_agent(requestData):
    # Extract fields safely with dot notation
    deep_search = getattr(requestData, "deep_search", False) or False
    email = getattr(requestData, "user_email", None)
    username = getattr(requestData, "username", None)


    user_context = UserContext(
        email=email,
        username=username,
        deep_search=deep_search
    )

#_____________________WORKING CURRENT CODE____________________________

    

    # Pass query to agent
    userQuery = getattr(requestData, "content", "")
    if deep_search:
        manageUserQuery = userQuery + " Do deep search"
    else:
        manageUserQuery = userQuery
    # result = Runner.run_streamed(requirement_gathering_agent, "Kindly do a deep search and let me know 3 best idea's to get freelance projects about AI Agent development.", context=user_context)
    result = Runner.run_streamed(requirement_gathering_agent, manageUserQuery, context=user_context) 
    # result = Runner.run_streamed(agent, userQuery, context=user_context)
    # result = Runner.run_streamed(agent, "Kindly do a deep search and let me know 3 best idea's to get freelance projects about AI Agent development.")
    # return result.final_output

    async for event in result.stream_events():
        
        
        if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
            yield f"data: {json.dumps({'type': 'content', 'delta': event.data.delta})}\n\n"
            

        if event.type == "run_item_stream_event" and isinstance(event, RunItemStreamEvent):
            if event.name == "tool_output" and isinstance(event.item, ToolCallOutputItem):
                tool_output = event.item.output   
                # print("\n[TOOL RESULT DICT]:", tool_output)

                resources = [
                    {"title": r["title"], "url": r["url"]}
                    for r in tool_output.get("results", [])
                ]

                yield f"data: {json.dumps({'type': 'resources', 'resources': resources})}\n\n"

#___________________________________________________________________________________________________

                
                # for r in tool_output.get("results", []):
                #     print("Title:", r["title"])
                #     print("URL:", r["url"])
                #     print("Snippet:", r["snippet"])
        
#_____________________WORKING CURRENT CODE____________________________



#_____________________TESTING FAKE CODE____________________________

# # (ignore agent + Runner for now, just fake response)
#     userQuery = getattr(requestData, "content", "")

#     
#     yield f"data: {json.dumps({'type': 'content', 'delta': 'Hello'})}\n\n"
#     yield f"data: {json.dumps({'type': 'content', 'delta': '! How can I help you today?'})}\n\n"


#     resources = [
#         {
#             "title": "Deduxer",
#             "url": "https://www.deduxer.studio/blog/25-profitable-ai-business-ideas-best-ai-businesses-2024",
#         },
#         {
#             "title": "Next.js Documentation",
#             "url": "https://nextjs.org/docs",
#         },
#     ]
#     yield f"data: {json.dumps({'type': 'resources', 'resources': resources})}\n\n"

#     # end signal (optional, if frontend expects it)
#     yield f"data: [DONE]\n\n"

#_____________________TESTING FAKE CODE____________________________



        # # Tool output (Tavily search results)
        # if event.type == "run_item_stream_event" and event.name == "tool_output":
        #     print(f"\n\n[TOOL OUTPUT]: {event.name}")
        #     raw_item = getattr(event.item, "raw_item", None)

        #     if isinstance(raw_item, dict) and "output" in raw_item:
        #         output = raw_item["output"]

        #         try:
        #             if isinstance(output, dict):
        #                 tavily_data = output
        #             elif isinstance(output, str) and output.strip():  # only parse if not empty
        #                 tavily_data = json.loads(output)
        #             else:
        #                 print("Empty or invalid tool output")
        #                 tavily_data = {}

        #             if "results" in tavily_data:
        #                 resources = [
        #                     {"url": r["url"], "title": r.get("title", r["url"])}
        #                     for r in tavily_data["results"]
        #                 ]
        #                 print(f"\n\n[RESOURCES]: {resources}")

        #         except Exception as e:
        #             print("Error parsing tavily output:", e, "| Raw output:", output)

            # if isinstance(raw_item, dict) and "output" in raw_item:
            #     output = raw_item["output"]

            #     try:
            #         tavily_data = output if isinstance(output, dict) else json.loads(output)

            #         if "results" in tavily_data:
            #             resources = [
            #                 {"url": r["url"], "title": r.get("title", r["url"])}
            #                 for r in tavily_data["results"]
            #             ]
            #             print(f"\n\n[RESOURCES]: {resources} ")
            #             #yield {"type": "resources", "resources": resources}

            #     except Exception as e:
            #         print("Error parsing tavily output:", e)

    # Done marker (optional here, frontend can check in FastAPI too)
    print("[ALL DONE]")
    #yield {"type": "done"}



# TESTING
# asyncio.run(call_agent({}))

# asyncio.run(call_agent(AgentRequest(content="kindly tell me about latest news of 7 August 2025", deep_search=True)))

#_________________________________________WORKING LAST CODE_________________________________________

    # async for event in result.stream_events():
    #     # Normal model text chunks
    #     if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
    #         yield f"data: {json.dumps({'type': 'content', 'delta': event.data.delta})}\n\n"

    #     # Tool output (Tavily search results come here)
    #     if event.type == "run_item_stream_event" and event.name == "tool_output":
    #         raw_item = getattr(event.item, "raw_item", None)

    #         if isinstance(raw_item, dict) and "output" in raw_item:
    #             output = raw_item["output"]

    #             try:
    #                 # Sometimes output is already a dict, sometimes it's JSON string
    #                 tavily_data = output if isinstance(output, dict) else json.loads(output)

    #                 if "results" in tavily_data:
    #                     resources = [
    #                         {"url": r["url"], "title": r.get("title", r["url"])}
    #                         for r in tavily_data["results"]
    #                     ]
    #                     yield f"data: {json.dumps({'type': 'resources', 'resources': resources})}\n\n"

    #             except Exception as e:
    #                 print("Error parsing tavily output:", e)

    # # End marker
    # yield "data: [DONE]\n\n"

#_________________________________________WORKING LAST CODE 23-08-2025_________________________________________


    # async for event in result.stream_events():
    #     if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
    #         yield event.data.delta




#_________________________________________DIFFERENT OLD CODE_________________________________________________________________
            


            #print(event.data.delta, end="", flush=True)

#     try:
#         # IMPORTANT: Use run_streamed properly - iterate over the stream
#         result_stream = Runner.run_streamed(agent, userQuery, context=user_context)
        
#         # Check if result_stream has stream_events method (OpenAI Agent SDK pattern)
#         if hasattr(result_stream, 'stream_events'):
#             # Use stream_events() method for OpenAI Agent SDK
#             async for event in result_stream.stream_events():
#                 # Extract content from the event
#                 content = extract_content_from_event(event)
#                 if content:
#                     yield content
#         elif hasattr(result_stream, '__aiter__'):
#             # Direct async iteration
#             async for chunk in result_stream:
#                 content = extract_content_from_chunk(chunk)
#                 if content:
#                     yield content
#         else:
#             # Fallback: If streaming doesn't work, get final result and chunk it
#             print("Warning: Stream is not iterable, falling back to chunked final result")
#             if hasattr(result_stream, 'final_output'):
#                 final_text = result_stream.final_output
#                 # Stream word by word
#                 words = final_text.split(' ')
#                 for i, word in enumerate(words):
#                     if i == 0:
#                         yield word
#                     else:
#                         yield ' ' + word
#                     await asyncio.sleep(0.05)
#             else:
#                 yield "Unable to process the request properly."
                    
#     except Exception as e:
#         print(f"Error in call_agent_streamed: {e}")
#         yield f"Error occurred: {str(e)}"

# def extract_content_from_event(event):
#     """
#     Extract content from OpenAI Agent SDK stream events
#     """
#     # Skip non-content events
#     if hasattr(event, 'type'):
#         event_type = event.type
        
#         # Skip these event types as they don't contain user-facing content
#         if event_type in [
#             'agent_updated_stream_event', 
#             'raw_responses_stream_event',
#             'function_call',
#             'tool_call'
#         ]:
#             return None
            
#         # Handle text-containing events
#         if event_type == 'text_delta':
#             return getattr(event, 'text', '')
#         elif event_type == 'content_block_delta':
#             if hasattr(event, 'delta') and hasattr(event.delta, 'text'):
#                 return event.delta.text
#         elif event_type == 'message_delta':
#             if hasattr(event, 'delta') and hasattr(event.delta, 'content'):
#                 content = event.delta.content
#                 if isinstance(content, list) and len(content) > 0:
#                     return content[0].get('text', '') if isinstance(content[0], dict) else str(content[0])
#                 return str(content)
    
#     # Handle RawResponsesStreamEvent specifically
#     if hasattr(event, 'data'):
#         data = event.data
        
#         # Check if it's a text completion event
#         if hasattr(data, 'type') and data.type == 'content_block_delta':
#             if hasattr(data, 'delta') and hasattr(data.delta, 'text'):
#                 return data.delta.text
                
#         # Check for response content
#         if hasattr(data, 'response'):
#             response = data.response
#             if hasattr(response, 'output') and isinstance(response.output, list):
#                 for output_item in response.output:
#                     if hasattr(output_item, 'content'):
#                         if isinstance(output_item.content, list):
#                             for content_item in output_item.content:
#                                 if hasattr(content_item, 'text'):
#                                     return content_item.text
#                         elif hasattr(output_item.content, 'text'):
#                             return output_item.content.text
#                         elif isinstance(output_item.content, str):
#                             return output_item.content
    
#     # Try to extract from common attributes, but only if they contain actual text content
#     for attr in ['content', 'text', 'message']:
#         if hasattr(event, attr):
#             value = getattr(event, attr)
#             if isinstance(value, str) and value and not value.startswith('Agent(') and not value.startswith('Response('):
#                 return value
    
#     return None

# def extract_content_from_chunk(chunk):
#     """
#     Extract content from different chunk formats that OpenAI Agent SDK might return
#     """
#     # Try different possible chunk formats
#     if hasattr(chunk, 'content'):
#         return chunk.content
#     elif hasattr(chunk, 'delta'):
#         if hasattr(chunk.delta, 'content'):
#             return chunk.delta.content
#         return str(chunk.delta)
#     elif hasattr(chunk, 'text'):
#         return chunk.text
#     elif hasattr(chunk, 'message'):
#         if hasattr(chunk.message, 'content'):
#             return chunk.message.content
#         return str(chunk.message)
#     elif isinstance(chunk, dict):
#         # Handle dictionary responses
#         if 'content' in chunk:
#             return chunk['content']
#         elif 'text' in chunk:
#             return chunk['text']
#         elif 'delta' in chunk and 'content' in chunk['delta']:
#             return chunk['delta']['content']
#     elif isinstance(chunk, str):
#         return chunk
#     else:
#         # Fallback: convert to string
#         return str(chunk)











# ______________________________________________OLD CODE________________________________________________________




# async def call_agent(requestData):
#     user_context = None
    
#     if getattr(requestData, "deep_search", False):
        
#         user_context = UserContext(
#             email=getattr(requestData, "user_email", None),
#             username=getattr(requestData, "username", None),
#             deep_search=True
#         )
#     elif getattr(requestData, "user_email", None) and getattr(requestData, "username", None):
        
#         user_context = UserContext(
#             email=requestData.user_email,
#             username=requestData.username,
#             deep_search=False
#         )
#     else:
        
#         user_context = UserContext(
#             deep_search=False
#         )

#     userQuery = requestData.content
#     result = await Runner.run(agent, userQuery, context=user_context)
#     return result.final_output
    
    
    # if requestData.user_email and requestData.username and requestData.deep_search:
    #     user_context = UserContext(
    #         email=requestData.user_email,
    #         username=requestData.username,
    #         deep_search=True
    #     )
    # elif requestData.user_email and requestData.username:
    #     user_context = UserContext(
    #         email=requestData.user_email,
    #         username=requestData.username,
    #     )
    # elif requestData.deep_search:
    #      user_context = UserContext(
    #         deep_search=True
    #     )   

    # userQuery = requestData.content
    # result = await Runner.run(agent, userQuery, context=user_context)
    # return result.final_output




    # if requestData.user_email and requestData.username and requestData.deep_search:
    #     return "all variable set"
    # if requestData.user_email and requestData.username:
    #     return "User and email set"
    # elif requestData.deep_search:
    #     return "only deep search set"
    # else:
    #     return "nothing set"

    # deep_search=requestData.deep_search

    # # return requestData.deep_search
    # if getattr(deep_search, "deep_search", False):
    #     return "Deep Search set"

    # return "Deep Search not set"
    # return requestData.get("deep_search")

    



# ________________________________________________



    # username = requestData.username if hasattr(requestData, "username") else None
    # email = requestData.user_email if hasattr(requestData, "user_email") else None
    # deep_search = getattr(requestData, "deep_search", False)

    
    # user_context = None
    # if username and email:
    #     # Assuming your UserContext can accept deep_search as well
    #     user_context = UserContext(username, email, deep_search=deep_search)
    # elif deep_search:
    #     # If no user info but deep search is true
    #     user_context = UserContext(deep_search=deep_search)

    # userQuery = requestData['content']

    # if user_context:
    #     result = await Runner.run(agent, userQuery, context=user_context)
    # else:
    #     result = await Runner.run(agent, userQuery)


    # return result.final_output


# class AgentRequest(BaseModel):
#     content: str
#     username: Optional[str] = None
#     user_email: Optional[str] = None
#     deep_search: Optional[bool] = False

# asyncio.run(call_agent(AgentRequest(content="kindly tell me about latest news of 7 August 2025", deep_search=True)))

    # # Pass context only if created
    # if user_context:
    #     result = await Runner.run(agent, requestData.content, context=user_context)
    # else:
    #     result = await Runner.run(agent, requestData.content)

    # return result.final_output



    # user_context = UserContext("Fahad", "fahad@live.com")

    # result = await Runner.run(agent, requestData.content, context=user_context)
    # return result.final_output
    
    # return requestData.content
    # print(result.final_output)