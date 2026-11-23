import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, RotateCcw } from "lucide-react";
import { api, speakWord } from "../services/api";
import "../styles/MatchGame.css";

const cardItems = [
  { id: 1, name: "Lion", emoji: "🦁" },
  { id: 2, name: "Panda", emoji: "🐼" },
  { id: 3, name: "Rabbit", emoji: "🐰" },
  { id: 4, name: "Puppy", emoji: "🐶" },
  { id: 5, name: "Kitty", emoji: "🐱" },
  { id: 6, name: "Elephant", emoji: "🐘" }
];

function generateShuffledDeck() {
  const deck = [];
  cardItems.forEach((item) => {
    deck.push({ ...item, uniqueKey: `${item.id}-a` });
    deck.push({ ...item, uniqueKey: `${item.id}-b` });
  });
  return deck.sort(() => Math.random() - 0.5);
}

function MatchGame() {
  const [cards, setCards] = useState(generateShuffledDeck);
  const [flipped, setFlipped] = useState([]); // array of uniqueKeys currently flipped in turn
  const [matched, setMatched] = useState([]); // array of matched card ids
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const [stars, setStars] = useState(0);
  const [savedStatus, setSavedStatus] = useState("");

  const handleCardClick = (card) => {
    // Cannot click if already 2 cards flipped, or card is already flipped or already matched
    if (
      flipped.length === 2 ||
      flipped.includes(card.uniqueKey) ||
      matched.includes(card.id)
    ) {
      return;
    }

    speakWord(card.name);
    const newFlipped = [...flipped, card.uniqueKey];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const firstCard = cards.find((c) => c.uniqueKey === newFlipped[0]);
      const secondCard = card;

      if (firstCard.id === secondCard.id) {
        // MATCH!
        const newMatched = [...matched, firstCard.id];
        setMatched(newMatched);
        setFlipped([]);
        speakWord(`You found the matching ${firstCard.name}!`);

        if (newMatched.length === cardItems.length) {
          // Completed game!
          const earnedStars = Math.max(3, 8 - Math.floor((moves + 1) / 3));
          setStars(earnedStars);
          setFinished(true);
          saveResults(earnedStars);
        }
      } else {
        // NO MATCH -> flip back after short delay
        setTimeout(() => {
          setFlipped([]);
        }, 850);
      }
    }
  };

  const saveResults = async (earnedStars) => {
    try {
      setSavedStatus("Saving results to Little Learners...");
      const res = await api.saveGameRecord({
        gameTitle: "Match the Pairs",
        score: earnedStars,
        total: cardItems.length,
        starsEarned: earnedStars
      });
      if (res.success) {
        setSavedStatus("🌟 Results and stars saved to your profile!");
      }
    } catch {
      setSavedStatus("");
    }
  };

  const restartGame = () => {
    setCards(generateShuffledDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setFinished(false);
    setStars(0);
    setSavedStatus("");
  };

  return (
    <div className="match-game-page">
      <header className="game-header">
        <Link to="/home" className="back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <div className="game-logo">🧸 Little Learners</div>
        <div className="game-stars">
          <Star size={19} fill="#ffc83d" color="#ffc83d" />
          {matched.length} / {cardItems.length} Pairs
        </div>
      </header>

      <main className="game-container">
        {!finished ? (
          <>
            <div className="game-heading">
              <span className="game-label">🧩 BRAIN & MEMORY</span>
              <h1>Match the Pairs!</h1>
              <p>Flip two cards to find animal friends that look alike.</p>
            </div>

            <div className="match-stats-row">
              <div className="stat-pill">
                <span>🎯 Pairs Matched:</span>
                <strong>{matched.length} of {cardItems.length}</strong>
              </div>
              <div className="stat-pill">
                <span>🔄 Moves:</span>
                <strong>{moves}</strong>
              </div>
            </div>

            <div className="cards-grid">
              {cards.map((card) => {
                const isFlipped =
                  flipped.includes(card.uniqueKey) || matched.includes(card.id);
                const isMatched = matched.includes(card.id);

                return (
                  <button
                    key={card.uniqueKey}
                    type="button"
                    className={`memory-card ${isFlipped ? "flipped" : ""} ${
                      isMatched ? "matched" : ""
                    }`}
                    onClick={() => handleCardClick(card)}
                  >
                    <div className="card-inner">
                      <div className="card-front">
                        <span className="front-star">⭐</span>
                      </div>
                      <div className="card-back">
                        <span className="card-emoji">{card.emoji}</span>
                        <span className="card-label">{card.name}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <section className="result-card">
            <div className="trophy-emoji">🏆</div>
            <span className="game-label">MEMORY CHAMPION</span>
            <h1>Outstanding Memory!</h1>
            <p>You found all {cardItems.length} matching pairs in {moves} moves!</p>

            <div className="final-score">
              <Star size={30} fill="#ffc83d" color="#ffc83d" />
              <span>+{stars} Stars Earned!</span>
            </div>

            {savedStatus && <p className="saved-status-text">{savedStatus}</p>}

            <h3>
              {moves <= 8
                ? "Incredible Genius! You have a photographic memory! 🧠✨"
                : moves <= 14
                ? "Great job! Your memory skills are getting stronger! 🌟"
                : "Good job finding all pairs! Practice makes perfect! 💖"}
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

export default MatchGame;
