import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, RotateCcw, Volume2 } from "lucide-react";
import { api, speakWord } from "../services/api";
import "../styles/AlphabetGame.css";

const fallbackQuestions = [
  { emoji: "🍎", word: "Apple", questionText: "Which letter does Apple start with?", answer: "A", options: ["A", "B", "C", "D"] },
  { emoji: "⚽", word: "Ball", questionText: "Which letter does Ball start with?", answer: "B", options: ["A", "B", "C", "D"] },
  { emoji: "🐱", word: "Cat", questionText: "Which letter does Cat start with?", answer: "C", options: ["C", "D", "E", "F"] },
  { emoji: "🐶", word: "Dog", questionText: "Which letter does Dog start with?", answer: "D", options: ["A", "D", "E", "F"] },
  { emoji: "🐘", word: "Elephant", questionText: "Which letter does Elephant start with?", answer: "E", options: ["B", "C", "E", "F"] },
  { emoji: "🐟", word: "Fish", questionText: "Which letter does Fish start with?", answer: "F", options: ["C", "D", "E", "F"] },
  { emoji: "🍇", word: "Grapes", questionText: "Which letter does Grapes start with?", answer: "G", options: ["G", "H", "I", "J"] },
  { emoji: "🏠", word: "House", questionText: "Which letter does House start with?", answer: "H", options: ["E", "F", "G", "H"] },
  { emoji: "🍦", word: "Ice Cream", questionText: "Which letter does Ice Cream start with?", answer: "I", options: ["G", "H", "I", "J"] },
  { emoji: "🧃", word: "Juice", questionText: "Which letter does Juice start with?", answer: "J", options: ["G", "H", "I", "J"] }
];

function AlphabetGame() {
  const [questions, setQuestions] = useState(fallbackQuestions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedStatus, setSavedStatus] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await api.getQuestions("Learn Alphabets");
        if (res.success && res.questions && res.questions.length > 0) {
          const formatted = res.questions.map((q) => ({
            emoji: q.emoji || "🔤",
            word: q.questionText.replace(/Which letter does | start with\?/g, "") || q.correctAnswer,
            questionText: q.questionText,
            answer: q.correctAnswer,
            options: q.options
          }));
          setQuestions(formatted);
        }
      } catch (err) {
        console.warn("Using fallback alphabet questions:", err);
      }
    }
    loadQuestions();
  }, []);

  const current = questions[index] || fallbackQuestions[0];

  const handleAnswer = (letter) => {
    if (selected !== "") return;
    setSelected(letter);

    const isCorrect = letter === current.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      speakWord(`Super! ${current.word} starts with ${letter}`);
    } else {
      speakWord(`Good try! ${current.word} starts with ${current.answer}`);
    }
  };

  const nextQuestion = () => {
    if (index === questions.length - 1) {
      finishGame();
    } else {
      setIndex((prev) => prev + 1);
      setSelected("");
    }
  };

  const finishGame = async () => {
    setFinished(true);
    try {
      setSavedStatus("Saving stars to Little Learners...");
      const finalScore = score + (selected === current.answer ? 0 : 0);
      const res = await api.saveGameRecord({
        gameTitle: "Learn Alphabets",
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
    setIndex(0);
    setSelected("");
    setScore(0);
    setFinished(false);
    setSavedStatus("");
  };

  return (
    <div className="alphabet-page">

      <header className="alphabet-header">
        <Link to="/home" className="alphabet-back">
          <ArrowLeft size={19} />
          Back to Home
        </Link>

        <div className="alphabet-logo">
          🧸 Little Learners
        </div>

        <div className="alphabet-stars">
          <Star size={19} fill="#ffc83d" color="#ffc83d" />
          {score} Stars
        </div>
      </header>

      <main className="alphabet-container">

        {!finished ? (
          <>
            <div className="alphabet-heading">
              <span className="alphabet-label">
                🔤 ABC WORLD
              </span>

              <h1>Let's Learn Alphabets!</h1>

              <p>
                Look at the picture and find its starting letter.
              </p>
            </div>

            <div className="alphabet-progress-text">
              <span>
                Question {index + 1} of {questions.length}
              </span>

              <span>
                {Math.round(((index + 1) / questions.length) * 100)}%
                Completed
              </span>
            </div>

            <div className="alphabet-progress-track">
              <div
                className="alphabet-progress-fill"
                style={{
                  width: `${((index + 1) / questions.length) * 100}%`
                }}
              />
            </div>

            <section className="alphabet-card">

              <div className="alphabet-picture">
                {current.emoji}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <h2>{current.word}</h2>
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
                  onClick={() => speakWord(`${current.word}, starts with ${current.answer}`)}
                >
                  <Volume2 size={18} />
                </button>
              </div>

              <p className="alphabet-question">
                Which letter does this word start with?
              </p>

              <div className="alphabet-options">
                {current.options.map((letter) => {
                  let className = "";

                  if (selected !== "") {
                    if (letter === current.answer) {
                      className = "alphabet-correct";
                    } else if (letter === selected) {
                      className = "alphabet-wrong";
                    }
                  }

                  return (
                    <button
                      key={letter}
                      className={`alphabet-option ${className}`}
                      onClick={() => handleAnswer(letter)}
                      disabled={selected !== ""}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              {selected !== "" && (
                <div className={
                  selected === current.answer
                    ? "alphabet-feedback alphabet-right"
                    : "alphabet-feedback alphabet-error"
                }>
                  {selected === current.answer
                    ? `🎉 Excellent! ${current.word} starts with ${current.answer}!`
                    : `😊 Good try! ${current.word} starts with ${current.answer}.`}
                </div>
              )}

              <button
                className="alphabet-next"
                onClick={nextQuestion}
                disabled={selected === ""}
              >
                {index === questions.length - 1
                  ? "See My Result 🏆"
                  : "Next Question →"}
              </button>

            </section>
          </>
        ) : (
          <section className="alphabet-result">

            <div className="alphabet-trophy">🏆</div>

            <span className="alphabet-label">
              GAME COMPLETED
            </span>

            <h1>Wonderful Learning!</h1>

            <p>You completed the Alphabet Game!</p>

            <div className="alphabet-final-score">
              ⭐ {score} / {questions.length}
            </div>

            {savedStatus && (
              <p style={{ color: "#2e7d32", fontWeight: "bold", fontSize: "14px", margin: "10px 0" }}>
                {savedStatus}
              </p>
            )}

            <h3>
              {score === questions.length
                ? "Perfect! You are an Alphabet Champion! 🌟"
                : score >= 6
                ? "Great work! Keep learning! 💛"
                : "Good effort! Let's practise again! 😊"}
            </h3>

            <button
              className="alphabet-next"
              onClick={restartGame}
            >
              <RotateCcw size={18} />
              Play Again
            </button>

            <Link to="/home" className="alphabet-home-link">
              Back to Dashboard
            </Link>

          </section>
        )}

      </main>
    </div>
  );
}

export default AlphabetGame;
