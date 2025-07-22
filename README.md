# QuizMaker

A web application that generates quizzes from uploaded documents using AI.

## Features

- Upload documents and automatically generate quiz questions
- React frontend with modern UI
- FastAPI backend with Azure AI integration
- Document analysis and quiz generation

## Tech Stack

- Frontend: React, Vite, TailwindCSS
- Backend: FastAPI, Python
- AI Services: Azure AI Document Intelligence, OpenAI

## Setup

### Prerequisites

- Node.js
- Python 3.13+
- Azure AI and OpenAI API keys

### Installation

1. Clone the repository
2. Install client dependencies:

   ```
   cd client
   npm install
   ```

3. Install server dependencies:

   ```
   cd server
   python -m venv myenv
   source myenv/bin/activate
   pip install -r requirements.txt
   ```

4. Set up environment variables for API keys

### Running the Application

1. Start the backend server:

   ```
   cd server
   source myenv/bin/activate
   python main.py
   ```

2. Start the frontend development server:

   ```
   cd client
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

## Usage

1. Upload a document through the web interface
2. The system will analyze the document using Azure AI
3. AI generates relevant quiz questions based on the content
4. Review and use the generated quiz
