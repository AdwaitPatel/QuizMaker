from langchain_openai import AzureChatOpenAI
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
import os

load_dotenv()

llm = AzureChatOpenAI(
    azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    api_version="2025-01-01-preview",
)

user_input = input("Enter Prompt : ")

prompt = ChatPromptTemplate(
    [
        ("system", ("You are a teacher who generate quizzes or multiple choice questions based on data students give you, so generate atleast 15 mcqs. And always give the answers to all question at the end.")),
        ("user", user_input),
    ]
)
response = llm.invoke(prompt.format(user_input=user_input))

print(response.content)


