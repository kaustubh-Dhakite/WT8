import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, RotateCcw, Volume2, BookOpen, HelpCircle } from "lucide-react";
import { api, speakWord } from "../services/api";
import "../styles/NumbersGame.css";

const numberWords = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"
];

const fallbackQuestions = [
  {
    questionText: "What number comes after 9?",
    emoji: "🔟",
    options: ["8", "10", "11", "12"],
    correctAnswer: "10"
  },
  {
    questionText: "What number is ONE?",
    emoji: "☝️",
    options: ["1", "2", "3", "4"],
    correctAnswer: "1"
  },
  {
    questionText: "How many legs does a cute dog have?",
    emoji: "🐕",
    options: ["2", "3", "4", "5"],
    correctAnswer: "4"
  },
  {
    questionText: "How many fingers on one little hand?",
    emoji: "🖐️",
    options: ["3", "4", "5", "6"],
    correctAnswer: "5"
  },
  {
    questionText: "What number comes after 14?",
    emoji: "🔢",
    options: ["13", "15", "16", "17"],
    correctAnswer: "15"
  },
  {
    questionText: "How many wheels does a bicycle have?",
    emoji: "🚲",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2"
  },
  {
    questionText: "What number is represented by 2 tens (20)?",
    emoji: "🎯",
    options: ["10", "15", "18", "20"],
    correctAnswer: "20"
  },
  {
    questionText: "Which number comes right before 8?",
    emoji: "🎲",
    options: ["6", "7", "9", "10"],
    correctAnswer: "7"
  }
];

function NumbersGame() {
  const [mode, setMode] = useState("quiz"); // 'quiz' or 'explore'
  const [questions, setQuestions] = useState(fallbackQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedStatus, setSavedStatus] = useState("");
  const [activeNumber, setActiveNumber] = useState(1);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await api.getQuestions("Learn Numbers");
        if (res.success && res.questions && res.questions.length > 0) {
          setQuestions(res.questions);
        }
      } catch (err) {
        console.warn("Using fallback questions for numbers game:", err);
      }
    }
    loadQuestions();
  }, []);

  const currentQuestion = questions[questionIndex] || fallbackQuestions[0];

  const handleAnswer = (option) => {
    if (selected !== "") return;
    setSelected(option);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      speakWord(`Awesome! The answer is ${option}`);
    } else {
      speakWord(`Nice try! The correct number is ${currentQuestion.correctAnswer}`);
    }
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      finishGame();
    } else {
      setQuestionIndex((prev) => prev + 1);
      setSelected("");
    }
  };

  const finishGame = async () => {
    setFinished(true);
    try {
      setSavedStatus("Saving stars to Little Learners...");
      const finalScore = score + (selected === currentQuestion.correctAnswer ? 0 : 0);
      const res = await api.saveGameRecord({
        gameTitle: "Learn Numbers",
        score: finalScore,
        total: questions.length,
        starsEarned: finalScore
      });
      if (res.success) {
        setSavedStatus("🌟 Progress saved to your account!");
      }
    } catch {
      setSavedStatus("");
    }
  };

  const restartGame = () => {
    setQuestionIndex(0);
    setSelected("");
    setScore(0);
    setFinished(false);
    setSavedStatus("");
  };

  return (
    <div className="numbers-game-page">
      <header className="game-header">
        <Link to="/home" className="back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <div className="game-logo">🧸 Little Learners</div>
        <div className="game-stars">
          <Star size={19} fill="#ffc83d" color="#ffc83d" />
          {score} Stars
        </div>
      </header>

      <main className="game-container">
        {/* Mode Switcher */}
        <div className="mode-switch-bar">
          <button
            type="button"
            className={`mode-tab ${mode === "quiz" ? "active" : ""}`}
            onClick={() => setMode("quiz")}
          >
            <HelpCircle size={17} />
            Numbers Quiz
          </button>
          <button
            type="button"
            className={`mode-tab ${mode === "explore" ? "active" : ""}`}
            onClick={() => {
              setMode("explore");
              speakWord(`Number ${activeNumber}, ${numberWords[activeNumber]}`);
            }}
          >
            <BookOpen size={17} />
            Explore Numbers 1–20
          </button>
        </div>

        {mode === "explore" ? (
          <section className="numbers-explorer-card">
            <h2>Explore Numbers 1 to 20 🎈</h2>
            <p>Click any number to hear its name and count objects!</p>

            <div className="active-number-banner">
              <div className="big-number-badge">{activeNumber}</div>
              <div className="number-info">
                <h3>{numberWords[activeNumber]}</h3>
                <button
                  type="button"
                  className="speech-btn"
                  onClick={() =>
                    speakWord(`Number ${activeNumber}, ${numberWords[activeNumber]}`)
                  }
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </div>

            <div className="number-objects-preview">
              {Array.from({ length: activeNumber }, (_, i) => (
                <span key={i} className="counted-item">
                  ⭐
                </span>
              ))}
            </div>

            <div className="number-buttons-grid">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`num-btn ${activeNumber === num ? "active-num" : ""}`}
                  onClick={() => {
                    setActiveNumber(num);
                    speakWord(`${num}, ${numberWords[num]}`);
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </section>
        ) : !finished ? (
          <>
            <div className="game-heading">
              <span className="game-label">🔢 MATH & LOGIC</span>
              <h1>Learn Numbers!</h1>
              <p>Explore numbers 1 to 20 with joyful questions.</p>
            </div>

            <div className="game-progress">
              <span>
                Question {questionIndex + 1} of {questions.length}
              </span>
              <span>
                {Math.round(((questionIndex + 1) / questions.length) * 100)}% Completed
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${((questionIndex + 1) / questions.length) * 100}%`
                }}
              />
            </div>

            <section className="question-card">
              <div className="number-picture">{currentQuestion.emoji}</div>

              <div className="question-speak-row">
                <h2>{currentQuestion.questionText}</h2>
                <button
                  type="button"
                  className="speech-btn"
                  title="Listen"
                  onClick={() => speakWord(currentQuestion.questionText)}
                >
                  <Volume2 size={20} />
                </button>
              </div>

              <p className="choose-text">Choose the correct number below!</p>

              <div className="answer-grid">
                {currentQuestion.options.map((option) => {
                  let answerClass = "";
                  if (selected !== "") {
                    if (option === currentQuestion.correctAnswer) {
                      answerClass = "correct";
                    } else if (option === selected) {
                      answerClass = "incorrect";
                    }
                  }

                  return (
                    <button
                      key={option}
                      className={`answer-option ${answerClass}`}
                      onClick={() => handleAnswer(option)}
                      disabled={selected !== ""}
                    >
                      {option}
                      {selected !== "" && option === currentQuestion.correctAnswer && " ✓"}
                      {selected === option && option !== currentQuestion.correctAnswer && " ✗"}
                    </button>
                  );
                })}
              </div>

              {selected !== "" && (
                <div
                  className={`answer-feedback ${
                    selected === currentQuestion.correctAnswer
                      ? "feedback-correct"
                      : "feedback-wrong"
                  }`}
                >
                  {selected === currentQuestion.correctAnswer
                    ? `🎉 Excellent! The answer is ${currentQuestion.correctAnswer}!`
                    : `😊 Good try! The correct number is ${currentQuestion.correctAnswer}.`}
                </div>
              )}

              <button
                className="next-question-button"
                onClick={nextQuestion}
                disabled={selected === ""}
              >
                {questionIndex === questions.length - 1
                  ? "See My Result 🏆"
                  : "Next Question →"}
              </button>
            </section>
          </>
        ) : (
          <section className="result-card">
            <div className="trophy-emoji">🏆</div>
            <span className="game-label">GAME COMPLETED</span>
            <h1>Number Wizard!</h1>
            <p>You completed the Numbers Adventure!</p>

            <div className="final-score">
              <Star size={30} fill="#ffc83d" color="#ffc83d" />
              <span>
                {score} / {questions.length}
              </span>
            </div>

            {savedStatus && <p className="saved-status-text">{savedStatus}</p>}

            <h3>
              {score === questions.length
                ? "Perfect Score! You are a Numbers Master! 🔢✨"
                : score >= 5
                ? "Wonderful counting! Keep up the brilliant work! 🌟"
                : "Good effort! Practice makes you a numbers genius! 💛"}
            </h3>

            <button className="next-question-button" onClick={restartGame}>
              <RotateCcw size={18} />
              Play Again
            </button>

            <Link to="/home" className="home-result-link">
              Back to Dashboard
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}

export default NumbersGame;
