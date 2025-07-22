import os
from dotenv import load_dotenv
import base64
from urllib.parse import urlparse
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient


def client():
    load_dotenv()

    API_KEY = os.getenv("API_KEY")
    ENDPOINT = os.getenv("ENDPOINT")

    if not API_KEY or not ENDPOINT:
        raise ValueError("API_KEY and ENDPOINT must be set in the .env file")

    client = DocumentIntelligenceClient(
        endpoint=ENDPOINT,
        credential=AzureKeyCredential(API_KEY)
    )

    return client


def is_file_or_url(input_string):

    if os.path.isfile(input_string):
        return "file"
    elif urlparse(input_string).scheme in ['http', 'https']:
        return "url"
    else: 
        return "unknown"


def load_file_as_base64(file_path):

    with open(file_path, "rb") as f:
        data = f.read()

    base64_bytes = base64.b64encode(data)
    base64_string = base64_bytes.decode('utf-8')

    return base64_string

if __name__ == "__main__":
    client = client()
    print(client)

