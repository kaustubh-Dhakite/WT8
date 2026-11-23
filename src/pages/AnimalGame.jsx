import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, RotateCcw, Volume2 } from "lucide-react";
import { api, speakWord } from "../services/api";
import "../styles/AnimalGame.css";

const fallbackQuestions = [
  {
    emoji: "🦁",
    questionText: "Which animal is this?",
    options: ["Tiger", "Lion", "Cat", "Dog"],
    correctAnswer: "Lion"
  },
  {
    emoji: "🐘",
    questionText: "Which animal has a long trunk?",
    options: ["Horse", "Elephant", "Rabbit", "Monkey"],
    correctAnswer: "Elephant"
  },
  {
    emoji: "🐵",
    questionText: "Which animal loves climbing trees?",
    options: ["Monkey", "Cow", "Sheep", "Tiger"],
    correctAnswer: "Monkey"
  },
  {
    emoji: "🦒",
    questionText: "Which animal has a very long neck?",
    options: ["Zebra", "Lion", "Giraffe", "Bear"],
    correctAnswer: "Giraffe"
  },
  {
    emoji: "🐧",
    questionText: "Which bird cannot fly?",
    options: ["Parrot", "Eagle", "Penguin", "Crow"],
    correctAnswer: "Penguin"
  },
  {
    emoji: "🐰",
    questionText: "Which animal has long ears?",
    options: ["Rabbit", "Elephant", "Fox", "Cow"],
    correctAnswer: "Rabbit"
  },
  {
    emoji: "🐼",
    questionText: "Which animal loves eating bamboo?",
    options: ["Bear", "Panda", "Wolf", "Deer"],
    correctAnswer: "Panda"
  },
  {
    emoji: "🐬",
    questionText: "Which animal lives in the sea?",
    options: ["Camel", "Horse", "Dolphin", "Monkey"],
    correctAnswer: "Dolphin"
  }
];

function AnimalGame() {
  const [questions, setQuestions] = useState(fallbackQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedStatus, setSavedStatus] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await api.getQuestions("Guess the Animal");
        if (res.success && res.questions && res.questions.length > 0) {
          setQuestions(res.questions);
        }
      } catch (err) {
        console.warn("Using fallback animal questions:", err);
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
      speakWord(`Super! That is a ${option}`);
    } else {
      speakWord(`Good try! That is a ${currentQuestion.correctAnswer}`);
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
        gameTitle: "Guess the Animal",
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
    <div className="animal-game-page">

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
              <span className="game-label">🐾 ANIMAL WORLD</span>
              <h1>Guess the Animal!</h1>
              <p>Look carefully and choose the correct answer.</p>
            </div>

            <div className="game-progress">
              <span>
                Question {questionIndex + 1} of {questions.length}
              </span>

              <span>{Math.round(
                ((questionIndex + 1) / questions.length) * 100
              )}% Completed</span>
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

              <div className="animal-picture">
                {currentQuestion.emoji}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <h2>{currentQuestion.questionText}</h2>
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
                  onClick={() => speakWord(currentQuestion.questionText)}
                >
                  <Volume2 size={18} />
                </button>
              </div>

              <p className="choose-text">
                Choose your answer below!
              </p>

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
                      {selected !== "" &&
                        option === currentQuestion.correctAnswer && " ✓"}
                      {selected === option &&
                        option !== currentQuestion.correctAnswer && " ✗"}
                    </button>
                  );
                })}
              </div>

              {selected !== "" && (
                <div className={`answer-feedback ${
                  selected === currentQuestion.correctAnswer
                    ? "feedback-correct"
                    : "feedback-wrong"
                }`}>
                  {selected === currentQuestion.correctAnswer
                    ? `🎉 Amazing! You got it right! That is ${currentQuestion.correctAnswer}!`
                    : `😊 Good try! The correct answer is ${currentQuestion.correctAnswer}.`}
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

            <h1>Wonderful Work!</h1>

            <p>You completed the Animal Guessing Game!</p>

            <div className="final-score">
              <Star size={30} fill="#ffc83d" color="#ffc83d" />
              <span>{score} / {questions.length}</span>
            </div>

            {savedStatus && (
              <p style={{ color: "#2e7d32", fontWeight: "bold", fontSize: "14px", margin: "10px 0" }}>
                {savedStatus}
              </p>
            )}

            <h3>
              {score === questions.length
                ? "Perfect Score! You are an Animal Expert! 🦁"
                : score >= 5
                ? "Great job! Keep learning! 🌟"
                : "Good effort! Practice makes you better! 💛"}
            </h3>

            <button
              className="next-question-button"
              onClick={restartGame}
            >
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

export default AnimalGame;
