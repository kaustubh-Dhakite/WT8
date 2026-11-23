import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, RotateCcw, Volume2 } from "lucide-react";
import { api, speakWord } from "../services/api";
import "../styles/CountGame.css";

const fallbackQuestions = [
  {
    questionText: "How many balls are there?",
    emoji: "⚽",
    count: 3,
    options: ["2", "3", "4", "5"],
    correctAnswer: "3"
  },
  {
    questionText: "Count the sweet apples!",
    emoji: "🍎",
    count: 5,
    options: ["3", "4", "5", "6"],
    correctAnswer: "5"
  },
  {
    questionText: "How many stars can you see?",
    emoji: "⭐",
    count: 7,
    options: ["5", "6", "7", "8"],
    correctAnswer: "7"
  },
  {
    questionText: "Count the balloons!",
    emoji: "🎈",
    count: 4,
    options: ["2", "3", "4", "5"],
    correctAnswer: "4"
  },
  {
    questionText: "How many pink flowers are there?",
    emoji: "🌸",
    count: 6,
    options: ["4", "5", "6", "7"],
    correctAnswer: "6"
  },
  {
    questionText: "Count the juicy oranges!",
    emoji: "🍊",
    count: 8,
    options: ["6", "7", "8", "9"],
    correctAnswer: "8"
  },
  {
    questionText: "How many butterflies are fluttering?",
    emoji: "🦋",
    count: 2,
    options: ["1", "2", "3", "4"],
    correctAnswer: "2"
  },
  {
    questionText: "Count the cuddly teddy bears!",
    emoji: "🧸",
    count: 9,
    options: ["7", "8", "9", "10"],
    correctAnswer: "9"
  }
];

function CountGame() {
  const [questions, setQuestions] = useState(fallbackQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedStatus, setSavedStatus] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await api.getQuestions("Count the Objects");
        if (res.success && res.questions && res.questions.length > 0) {
          const formatted = res.questions.map((q) => ({
            ...q,
            count: parseInt(q.correctAnswer, 10) || 5
          }));
          setQuestions(formatted);
        }
      } catch (err) {
        console.warn("Using fallback count questions:", err);
      }
    }
    loadQuestions();
  }, []);

  const currentQuestion = questions[questionIndex] || fallbackQuestions[0];
  const targetCount = currentQuestion.count || parseInt(currentQuestion.correctAnswer, 10) || 3;

  const handleAnswer = (numberStr) => {
    if (selected !== null) return;
    setSelected(numberStr);

    const isCorrect = String(numberStr) === String(currentQuestion.correctAnswer || targetCount);
    if (isCorrect) {
      setScore((prev) => prev + 1);
      speakWord(`Super counting! Exactly ${numberStr}`);
    } else {
      speakWord(`Good effort! There are ${targetCount} objects.`);
    }
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      finishGame();
    } else {
      setQuestionIndex((prev) => prev + 1);
      setSelected(null);
    }
  };

  const finishGame = async () => {
    setFinished(true);
    try {
      setSavedStatus("Saving stars to Little Learners...");
      const finalScore = score + (String(selected) === String(targetCount) ? 0 : 0);
      const res = await api.saveGameRecord({
        gameTitle: "Count the Objects",
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
    setSelected(null);
    setScore(0);
    setFinished(false);
    setSavedStatus("");
  };

  return (
    <div className="count-game-page">

      <header className="count-header">
        <Link to="/home" className="count-back">
          <ArrowLeft size={19} />
          Back to Home
        </Link>

        <div className="count-logo">
          🧸 Little Learners
        </div>

        <div className="count-stars">
          <Star size={19} fill="#ffc83d" color="#ffc83d" />
          {score} Stars
        </div>
      </header>

      <main className="count-container">

        {!finished ? (
          <>
            <div className="count-heading">
              <span className="count-label">
                🔢 NUMBER WORLD
              </span>

              <h1>Count the Objects!</h1>

              <p>
                Count carefully and choose the correct number.
              </p>
            </div>

            <div className="count-progress-text">
              <span>
                Question {questionIndex + 1} of {questions.length}
              </span>

              <span>
                {Math.round(
                  ((questionIndex + 1) / questions.length) * 100
                )}% Completed
              </span>
            </div>

            <div className="count-progress-track">
              <div
                className="count-progress-fill"
                style={{
                  width: `${((questionIndex + 1) / questions.length) * 100}%`
                }}
              />
            </div>

            <section className="count-card">

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <h2>{currentQuestion.questionText || currentQuestion.title}</h2>
                <button
                  type="button"
                  style={{
                    background: "#eef6fc",
                    border: "none",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3196c6"
                  }}
                  title="Listen"
                  onClick={() => speakWord(currentQuestion.questionText || currentQuestion.title)}
                >
                  <Volume2 size={18} />
                </button>
              </div>

              <p className="count-instruction">
                Count each object one by one! 👇
              </p>

              <div className="objects-area">
                {Array.from(
                  { length: targetCount },
                  (_, index) => (
                    <span
                      key={index}
                      className="count-object"
                      onClick={() => speakWord(String(index + 1))}
                      style={{ cursor: "pointer" }}
                      title={`Object ${index + 1}`}
                    >
                      {currentQuestion.emoji}
                    </span>
                  )
                )}
              </div>

              <h3>Choose the correct number</h3>

              <div className="count-options">
                {currentQuestion.options.map((opt) => {
                  const numberStr = String(opt);
                  let className = "";

                  if (selected !== null) {
                    if (numberStr === String(targetCount)) {
                      className = "count-correct";
                    } else if (numberStr === String(selected)) {
                      className = "count-wrong";
                    }
                  }

                  return (
                    <button
                      key={numberStr}
                      className={`count-option ${className}`}
                      onClick={() => handleAnswer(numberStr)}
                      disabled={selected !== null}
                    >
                      {numberStr}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className={
                  String(selected) === String(targetCount)
                    ? "count-feedback right-feedback"
                    : "count-feedback wrong-feedback"
                }>
                  {String(selected) === String(targetCount)
                    ? `🎉 Excellent! Your counting is correct! There are ${targetCount}!`
                    : `😊 Good try! There are ${targetCount} objects.`}
                </div>
              )}

              <button
                className="count-next"
                onClick={nextQuestion}
                disabled={selected === null}
              >
                {questionIndex === questions.length - 1
                  ? "See My Result 🏆"
                  : "Next Question →"}
              </button>

            </section>
          </>
        ) : (
          <section className="count-result">

            <div className="count-trophy">🏆</div>

            <span className="count-label">
              GAME COMPLETED
            </span>

            <h1>Fantastic Counting!</h1>

            <p>You completed all the counting questions!</p>

            <div className="count-final-score">
              ⭐ {score} / {questions.length}
            </div>

            {savedStatus && (
              <p style={{ color: "#2e7d32", fontWeight: "bold", fontSize: "14px", margin: "10px 0" }}>
                {savedStatus}
              </p>
            )}

            <h3>
              {score === questions.length
                ? "Amazing! You are a counting champion! 🌟"
                : score >= 5
                ? "Great work! Keep practising! 💛"
                : "Good effort! Let's try again! 😊"}
            </h3>

            <button
              className="count-next"
              onClick={restartGame}
            >
              <RotateCcw size={18} />
              Play Again
            </button>

            <Link to="/home" className="count-home-link">
              Back to Dashboard
            </Link>

          </section>
        )}

      </main>
    </div>
  );
}

export default CountGame;
