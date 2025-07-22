from fastapi import FastAPI, Form, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

import base64, os
from pathlib import Path
from azure.ai.documentintelligence.models import AnalyzeDocumentRequest
from utils import client, is_file_or_url, load_file_as_base64

from langchain_openai import AzureChatOpenAI
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate


app = FastAPI()

origins = [
    "http://localhost:5173"
]

# Allow all origins (not in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,  
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)


# save file to a docs folder
@app.post("/getquiz/")
async def get_quiz(file: UploadFile = File(...), user_prompt: str = None):

    file_path = f"docs/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    fileContent = await read_file(file_path)

    # Delete the uploaded file
    if os.path.exists(file_path):
        os.remove(file_path)

    if user_prompt is None:
        user_prompt = "Generate mcqs based on this data : "    

    # generate_quiz()
    generated_mcqs = await generate_quiz(fileContent, user_prompt)

    result = eval(str(generated_mcqs).replace("\n", "").replace("```", "").replace("json", ""))

    return result


# ======================= Read pdf logic =======================


model_id = "prebuilt-tax.us.w2"
document_ai_client = client()

async def read_file(filepath: str):

    if is_file_or_url(filepath) == "url":

        poller = document_ai_client.begin_analyze_document(
            model_id,
            AnalyzeDocumentRequest(
                url_source=filepath
            )
        )

    elif is_file_or_url(filepath) == "file":

        file_base64 = load_file_as_base64(filepath)

        poller = document_ai_client.begin_analyze_document(
            model_id, 
            {
                "base64Source": file_base64
            }
        )


    result = poller.result()

    return result['content']


# ======================= generate MCQs logic =======================


load_dotenv()

llm = AzureChatOpenAI(
    azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    api_version="2025-01-01-preview",
)

async def generate_quiz(filecontent: str, userprompt: str):

    final_prompt = userprompt + "Generate mcqs based on this data : " + filecontent

    prompt = ChatPromptTemplate(
        [
            ("system", ("""
                        You are a teacher who generate quizzes or multiple choice questions based on data students give you, so generate atleast 15 mcqs. And always give the answers to all question at the end. Make sure to return the content response like this only everytime :
                        
                            "questions": [
                                
                                    "question": "",
                                    "options": ["", "", "", ""],
                                    "answer": ""
                                ,
                                // and so on...
                            
                        basically return me everything in json format
                        """)),
            ("user", "{user_input}"),
        ]
    )
    formatted_prompt = prompt.format(user_input=final_prompt)

    response = llm.invoke(formatted_prompt)

    return response.content





