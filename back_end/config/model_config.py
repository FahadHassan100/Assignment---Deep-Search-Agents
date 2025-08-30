import os
from tavily import TavilyClient
from dotenv import find_dotenv, load_dotenv
from agents import set_tracing_disabled, OpenAIChatCompletionsModel
from openai import AsyncOpenAI



load_dotenv(find_dotenv())
set_tracing_disabled(disabled=False)

gemini_api_key = os.environ.get("GEMINI_API_KEY")
tavily_api_key = os.environ.get("TAVILY_API_KEY")
openai_api_key = os.environ.get("OPENAI_API_KEY")


tavily_client = TavilyClient(api_key=tavily_api_key)

external_client = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

Gemini25 = OpenAIChatCompletionsModel(
    openai_client=external_client,
    model="gemini-2.5-flash"
)

Gemini20 = OpenAIChatCompletionsModel(
    openai_client=external_client,
    model="gemini-2.0-flash"
)