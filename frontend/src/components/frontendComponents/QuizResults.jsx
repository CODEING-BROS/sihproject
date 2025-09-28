import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const QuizResults = ({ score, totalQuestions, onBack }) => {
  const correctAnswers = score;
  const incorrectAnswers = totalQuestions - score;
  const performance = Math.round((correctAnswers / totalQuestions) * 100);

  const data = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ["#34d399", "#f87171"],
        borderColor: ["#1f2937", "#1f2937"],
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: "80%",
  };

  return (
    <>
      <style>{`
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 700px;
          margin: auto;
          padding: 2rem;
          background-color: #1f2937;
          border-radius: 20px;
          color: #f9fafb;
        }

        .results-header {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
        }

        .results-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media(min-width: 768px) {
          .results-layout {
            flex-direction: row;
          }
        }

        .chart-container {
          position: relative;
          width: 208px;
          height: 208px;
          margin: auto;
        }

        .chart-percentage {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          font-weight: 700;
        }

        .stats-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
        }

        .stat-item {
          background-color: #374151;
          padding: 1rem;
          border-radius: 10px;
          border-left: 4px solid #9ca3af;
        }

        .stat-item.correct { border-left-color: #34d399; }
        .stat-item.incorrect { border-left-color: #f87171; }

        .stat-label {
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .try-again-btn {
          background-color: #3b82f6;
          color: #f9fafb;
          font-weight: 600;
          padding: 0.8rem 2rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          margin: auto;
          display: block;
          margin-top: 1.5rem;
        }

        .try-again-btn:hover {
          background-color: #2563eb;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="results-container">
        <h2 className="results-header">Quiz Completed!</h2>

        <div className="results-layout">
          <div className="chart-container">
            <Doughnut data={data} options={options} />
            <div className="chart-percentage">{performance}%</div>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-label">Total Questions</div>
              <div className="stat-value">{totalQuestions}</div>
            </div>
            <div className="stat-item correct">
              <div className="stat-label">Correct Answers</div>
              <div className="stat-value">{correctAnswers}</div>
            </div>
            <div className="stat-item incorrect">
              <div className="stat-label">Incorrect Answers</div>
              <div className="stat-value">{incorrectAnswers}</div>
            </div>
          </div>
        </div>

        <button className="try-again-btn" onClick={onBack}>
          Try Another Quiz
        </button>
      </div>
    </>
  );
};

export default QuizResults;
