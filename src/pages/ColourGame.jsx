import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, RotateCcw, Volume2 } from "lucide-react";
import { api, speakWord } from "../services/api";
import "../styles/ColourGame.css";

const fallbackQuestions = [
  {
    questionText: "What colour is the bright sky?",
    emoji: "☀️",
    options: ["Blue", "Green", "Red", "Yellow"],
    correctAnswer: "Blue",
    colorHex: "#36A9E0"
  },
  {
    questionText: "What colour is a ripe strawberry?",
    emoji: "🍓",
    options: ["Red", "Purple", "Orange", "Pink"],
    correctAnswer: "Red",
    colorHex: "#FF4D4D"
  },
  {
    questionText: "What colour is the fresh green grass?",
    emoji: "🌱",
    options: ["Yellow", "Green", "Blue", "Brown"],
    correctAnswer: "Green",
    colorHex: "#4CD964"
  },
  {
    questionText: "What colour is a sunny sunflower?",
    emoji: "🌻",
    options: ["Pink", "Yellow", "White", "Black"],
    correctAnswer: "Yellow",
    colorHex: "#FFCC00"
  },
  {
    questionText: "What colour is an orange pumpkin?",
    emoji: "🎃",
    options: ["Blue", "Red", "Orange", "Green"],
    correctAnswer: "Orange",
    colorHex: "#FF9500"
  },
  {
    questionText: "What colour are sweet juicy grapes?",
    emoji: "🍇",
    options: ["Purple", "Yellow", "Red", "Cyan"],
    correctAnswer: "Purple",
    colorHex: "#9B59B6"
  },
  {
    questionText: "What colour is a gentle flamingo?",
    emoji: "🦩",
    options: ["Pink", "Green", "Blue", "Grey"],
    correctAnswer: "Pink",
    colorHex: "#FF77A9"
  },
  {
    questionText: "What colour is a fluffy cloud?",
    emoji: "☁️",
    options: ["White", "Black", "Purple", "Green"],
    correctAnswer: "White",
    colorHex: "#EBF5FB"
  }
];

const colorMap = {
  Red: "#FF4D4D",
  Blue: "#36A9E0",
  Green: "#4CD964",
  Yellow: "#FFCC00",
  Orange: "#FF9500",
  Purple: "#9B59B6",
  Pink: "#FF77A9",
  White: "#F0F4F8"
};

function ColourGame() {
  const [questions, setQuestions] = useState(fallbackQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedStatus, setSavedStatus] = useState("");

  // Fetch questions from MongoDB API
  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await api.getQuestions("Learn Colours");
        if (res.success && res.questions && res.questions.length > 0) {
          const formatted = res.questions.map((q) => ({
            ...q,
            colorHex: colorMap[q.correctAnswer] || "#36A9E0"
          }));
          setQuestions(formatted);
        }
      } catch (err) {
        console.warn("Using fallback questions for colours game:", err);
      } finally {
        setLoading(false);
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
      speakWord(`Correct! That is ${option}`);
    } else {
      speakWord(`Good try! That is ${currentQuestion.correctAnswer}`);
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
        gameTitle: "Learn Colours",
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

  if (loading) {
    return (
      <div className="colour-game-page">
        <div className="game-loading">Loading magical colours... 🎨</div>
      </div>
    );
  }

  return (
    <div className="colour-game-page">
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
        {!finished ? (
          <>
            <div className="game-heading">
              <span className="game-label">🎨 COLOUR WORLD</span>
              <h1>Learn Colours!</h1>
              <p>Look at the colour and choose the correct name.</p>
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
              <div
                className="colour-display"
                style={{
                  backgroundColor: currentQuestion.colorHex || "#FFCC00",
                  boxShadow: `0 8px 25px ${currentQuestion.colorHex || "#FFCC00"}66`
                }}
              >
                <span className="colour-emoji">{currentQuestion.emoji}</span>
              </div>

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

              <p className="choose-text">Choose your answer below!</p>

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
                      <span
                        className="option-swatch"
                        style={{ backgroundColor: colorMap[option] || "#bbb" }}
                      />
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
                    ? `🎉 Wonderful! It is indeed ${currentQuestion.correctAnswer}!`
                    : `😊 Good try! The correct colour is ${currentQuestion.correctAnswer}.`}
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
            <h1>Rainbow Artist!</h1>
            <p>You completed the Colour Learning Adventure!</p>

            <div className="final-score">
              <Star size={30} fill="#ffc83d" color="#ffc83d" />
              <span>
                {score} / {questions.length}
              </span>
            </div>

            {savedStatus && <p className="saved-status-text">{savedStatus}</p>}

            <h3>
              {score === questions.length
                ? "Perfect Score! You know all the magical colours! 🌈"
                : score >= 5
                ? "Brilliant work! You are becoming a Colour Master! 🎨"
                : "Good effort! Let's play again and explore colours! 💛"}
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

export default ColourGame;
