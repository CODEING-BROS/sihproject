import React, { useState } from "react";
import QuizResults from "@/components/frontendComponents/QuizResults";
import { quizData } from "@/components/constraints/questions";

const Quiz = ({ language, onBack }) => {
  const questions = quizData[language];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswerOptionClick = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    if (option === questions[currentQuestion].answer) setScore(score + 1);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) setCurrentQuestion(nextQuestion);
    else setShowScore(true);
  };

  const currentQuestionData = questions[currentQuestion];
  const correctAnswer = currentQuestionData.answer;

  return (
    <>
      <style>{`
        :root {
          --primary-bg: #111827;
          --secondary-bg: #1f2937;
          --primary-text: #f9fafb;
          --secondary-text: #9ca3af;
          --accent-color: #3b82f6;
          --accent-hover: #2563eb;
          --correct-color: #34d399;
          --incorrect-color: #f87171;
        }

        .quiz-container {
          background-color: var(--secondary-bg);
          color: var(--primary-text);
          max-width: 700px;
          margin: auto;
          padding: 2rem;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        //   overflow: hidden;
        }

        .question-count {
          color: var(--secondary-text);
          font-size: 1rem;
        }

        .question-text {
          font-size: 1.75rem;
          font-weight: 600;
          min-height: 80px;
          max-height: 120px;
          overflow: hidden;
          padding: 1rem;
          border-radius: 10px;
        }

        .answer-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
          justify-content: center;
        }

        .answer-section button {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 500;
          text-align: left;
          border: 2px solid #4b5563;
          border-radius: 10px;
          background-color: transparent;
          color: var(--primary-text);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .answer-section button:hover:not(:disabled) {
          background-color: #374151;
          border-color: var(--accent-color);
        }

        .answer-section button.correct {
          background-color: rgba(52, 211, 153, 0.1);
          border-color: var(--correct-color);
          color: var(--correct-color);
        }

        .answer-section button.incorrect {
          background-color: rgba(248, 113, 113, 0.1);
          border-color: var(--incorrect-color);
          color: var(--incorrect-color);
        }

        .answer-section button.disabled {
          cursor: not-allowed;
        }

        .tick-icon {
          font-size: 1.2rem;
        }

        .next-section {
          margin-top: 1rem;
          text-align: right;
          flex-shrink: 0;
        }

        .next-section p {
          text-align: left;
          color: var(--correct-color);
          font-weight: 500;
        }

        .next-section button {
          background-color: var(--accent-color);
          color: var(--primary-text);
          padding: 0.8rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .next-section button:hover {
          background-color: var(--accent-hover);
        }
      `}</style>

      <div className="quiz-container">
        {showScore ? (
          <QuizResults
            score={score}
            totalQuestions={questions.length}
            onBack={onBack}
          />
        ) : (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>Question {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className="question-text">{currentQuestionData.question}</div>
            </div>

            <div className="answer-section">
              {currentQuestionData.options.map((option, index) => {
                const isCorrect = option === correctAnswer;
                const isSelected = selectedOption === option;
                let buttonClass = '';
                let icon = null;

                if (selectedOption) {
                  if (isCorrect) buttonClass = 'correct';
                  else if (isSelected) buttonClass = 'incorrect';
                  if (buttonClass) icon = isCorrect ? '✔️' : '❌';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(option)}
                    className={`${buttonClass} ${selectedOption ? 'disabled' : ''}`}
                    disabled={selectedOption}
                  >
                    {option} {icon && <span className="tick-icon">{icon}</span>}
                  </button>
                );
              })}
            </div>

            {selectedOption && (
              <div className="next-section">
                {selectedOption !== correctAnswer && (
                  <p>Correct Answer: {correctAnswer}</p>
                )}
                <button onClick={handleNextQuestion}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Quiz;
