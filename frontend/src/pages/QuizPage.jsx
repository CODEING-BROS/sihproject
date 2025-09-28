import React, { useState } from "react";
import Quiz from "./Quiz";
import { quizData, languageIcons } from "@/components/constraints/questions";
import Navbar from "@/components/frontendComponents/Navbar";

const QuizPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const languages = Object.keys(quizData);

  const handleBackToSelection = () => setSelectedLanguage(null);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-gray-800 rounded-2xl p-8 shadow-xl text-center overflow-hidden">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Programming Language Quiz
            </h1>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center">
            {!selectedLanguage ? (
              <div className="w-full">
                <h2 className="text-xl text-white mb-6">Choose a Language</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {languages.map((language) => {
                    const Icon = languageIcons[language];
                    return (
                      <button
                        key={language}
                        onClick={() => setSelectedLanguage(language)}
                        className="flex items-center justify-center gap-2 bg-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-600 transition-transform transform hover:-translate-y-1 w-full"
                      >
                        <Icon className="text-2xl" />
                        {language}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <Quiz language={selectedLanguage} onBack={handleBackToSelection} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
