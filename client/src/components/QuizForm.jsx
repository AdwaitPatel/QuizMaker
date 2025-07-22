import React, { useState } from "react";
import api from "../api";
import "./QuizForm.css";

const QuizForm = () => {
  const [file, setFile] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type (optional validation)
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please select a PDF or image file (JPG, JPEG, PNG)");
        setFile(null);
      }
    }
  };

  const handlePromptChange = (e) => {
    setUserPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!userPrompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError("");
    setQuiz(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_prompt", userPrompt);

      const response = await api.post("/getquiz/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setQuiz(response.data);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUserPrompt("");
    setQuiz(null);
    setError("");
    // Reset file input
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="quiz-form-container">
      <div className="quiz-form-card">
        <h2 className="form-title">Generate Quiz from Document</h2>

        {!quiz ? (
          <form onSubmit={handleSubmit} className="quiz-form">
            <div className="form-group">
              <label htmlFor="file-input" className="file-label">
                Upload Document
              </label>
              <div className="file-input-container">
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="file-input"
                />
                <div className="file-input-display">
                  {file ? (
                    <span className="file-selected">📄 {file.name}</span>
                  ) : (
                    <span className="file-placeholder">
                      Click to select a file or drag and drop
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prompt-input" className="prompt-label">
                Quiz Instructions
              </label>
              <textarea
                id="prompt-input"
                value={userPrompt}
                onChange={handlePromptChange}
                placeholder="Enter your instructions for the quiz generation (e.g., 'Focus on key concepts', 'Include difficult questions', 'Cover chapters 1-3')"
                className="prompt-textarea"
                rows="4"
              />
            </div>

            {error && <div className="error-message">⚠️ {error}</div>}

            <div className="form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !file || !userPrompt.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Generating Quiz...
                  </>
                ) : (
                  "Generate Quiz"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="quiz-results">
            <div className="results-header">
              <h3>Generated Quiz</h3>
              <button onClick={handleReset} className="btn btn-secondary">
                Generate New Quiz
              </button>
            </div>

            <div className="quiz-content">
              {quiz.questions &&
                quiz.questions.map((q, index) => (
                  <div key={index} className="question-card">
                    <h4 className="question-title">
                      Question {index + 1}: {q.question}
                    </h4>
                    <div className="options-list">
                      {q.options.map((option, optIndex) => (
                        <div key={optIndex} className="option-item">
                          <span className="option-label">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span className="option-text">{option}</span>
                        </div>
                      ))}
                    </div>
                    <div className="answer-section">
                      <strong>Answer: </strong>
                      <span className="correct-answer">{q.answer}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizForm;
