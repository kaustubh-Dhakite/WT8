import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  PawPrint,
  Calculator,
  BookOpen,
  Palette,
  Star,
  Trophy,
  LogOut,
  Gamepad2,
  Flame,
  MessageSquare,
  Bell,
  X,
  Send
} from "lucide-react";
import { api } from "../services/api";
import "../styles/Home.css";

function HomePage() {
  const navigate = useNavigate();

  // User state
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  // Dynamic Dashboard Stats from MongoDB
  const [stars, setStars] = useState(user.stars || 120);
  const [gamesPlayed, setGamesPlayed] = useState(user.gamesPlayed || 8);
  const [achievementsCount, setAchievementsCount] = useState(user.achievements || 6);
  const [dailyStreak, setDailyStreak] = useState(3);
  const [recentBadges, setRecentBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Modals & tabs
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackGame, setFeedbackGame] = useState("General");
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  // Load real data from MongoDB on component mount
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Fetch user profile
        const profileRes = await api.getUserProfile();
        if (profileRes.success && profileRes.user) {
          setUser(profileRes.user);
          setStars(profileRes.user.stars ?? 0);
          setGamesPlayed(profileRes.user.gamesPlayed ?? 0);
          setAchievementsCount(profileRes.user.achievements ?? 0);
          setDailyStreak(profileRes.user.streak ?? 1);
          setRecentBadges(profileRes.user.badges || []);
          localStorage.setItem("user", JSON.stringify(profileRes.user));
        }

        // 2. Fetch Leaderboard
        const rankRes = await api.getRankings();
        if (rankRes.success && rankRes.rankings) {
          setLeaderboard(rankRes.rankings);
        }

        // 3. Fetch Notifications
        const notifRes = await api.getNotifications();
        if (notifRes.success && notifRes.notifications) {
          setNotifications(notifRes.notifications);
        }
      } catch (err) {
        console.warn("Could not fetch remote dashboard data, using local state:", err);
      }
    }

    fetchDashboardData();
  }, []);

  const activities = [
    {
      title: "Guess the Animal",
      description: "Discover amazing animals!",
      emoji: "🦁",
      color: "animal",
      icon: PawPrint,
      level: "Easy",
      route: "/animal-game"
    },
    {
      title: "Count the Objects",
      description: "Learn numbers with fun!",
      emoji: "⚽",
      color: "count",
      icon: Calculator,
      level: "Easy",
      route: "/count-game"
    },
    {
      title: "Learn Alphabets",
      description: "Explore the ABCs!",
      emoji: "🔤",
      color: "alphabet",
      icon: BookOpen,
      level: "Easy",
      route: "/alphabet-game"
    },
    {
      title: "Learn Colours",
      description: "Discover beautiful colours!",
      emoji: "🎨",
      color: "colour",
      icon: Palette,
      level: "Easy",
      route: "/colour-game"
    },
    {
      title: "Match the Pairs",
      description: "Find matching objects!",
      emoji: "🧩",
      color: "matching",
      icon: Gamepad2,
      level: "Fun",
      route: "/match-game"
    },
    {
      title: "Learn Numbers",
      description: "Explore numbers 1 to 20!",
      emoji: "🔢",
      color: "numbers",
      icon: Calculator,
      level: "Easy",
      route: "/numbers-game"
    }
  ];

  const handlePlay = (activity) => {
    if (activity.route) {
      navigate(activity.route);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    navigate("/");
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    try {
      setFeedbackSubmitting(true);
      const res = await api.submitFeedback({
        rating: feedbackRating,
        comment: feedbackComment,
        gameTitle: feedbackGame
      });

      if (res.success) {
        setFeedbackStatus("🎉 Thank you! Your feedback was saved to MongoDB!");
        setFeedbackComment("");
        setTimeout(() => {
          setShowFeedback(false);
          setFeedbackStatus("");
        }, 1800);
      }
    } catch {
      setFeedbackStatus("Failed to submit feedback. Please check backend connection.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const displayName = user.name ? user.name.split(" ")[0] : "Little Explorer";

  return (
    <div className="home-page">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          🧸 Little Learners
        </div>

        <nav className="sidebar-nav">

          <a href="#home" className="nav-item active">
            <Home size={20} />
            Home
          </a>

          <a href="#activities" className="nav-item">
            <Gamepad2 size={20} />
            Activities
          </a>

          <Link to="/library" className="nav-item">
            <BookOpen size={20} />
            Learning Library
          </Link>

          <button
            type="button"
            className="nav-item"
            style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
            onClick={() => setShowLeaderboard(true)}
          >
            <Trophy size={20} />
            Leaderboard
          </button>

          <button
            type="button"
            className="nav-item"
            style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
            onClick={() => setShowFeedback(true)}
          >
            <MessageSquare size={20} />
            Feedback
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            type="button"
            className="logout-link"
            style={{ background: "none", border: "none", width: "100%", cursor: "pointer", textAlign: "left" }}
            onClick={handleLogout}
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </aside>

      {/* Main Dashboard */}
      <main className="dashboard-content" id="home">

        {/* Top Header */}
        <header className="dashboard-header">

          <div>
            <p className="header-small">
              YOUR LEARNING SPACE
            </p>

            <h2>Welcome, {displayName}! 👋</h2>
          </div>

          <div className="profile-area">

            {/* Daily Streak Indicator */}
            <div className="streak-badge" title="Daily Learning Streak">
              <Flame size={18} color="#FF5722" fill="#FF5722" />
              <span>{dailyStreak} Day Streak</span>
            </div>

            {/* Notification Bell */}
            {notifications.length > 0 && (
              <button
                type="button"
                className="notif-btn"
                title="Notifications"
                onClick={() => setShowNotifications(true)}
              >
                <Bell size={18} />
                {notifications.some((n) => !n.isRead) && <span className="notif-dot" />}
              </button>
            )}

            <div className="star-count">
              <Star
                size={19}
                fill="#FFC83D"
                color="#FFC83D"
              />
              <span>{stars} Stars</span>
            </div>

            <div className="profile-avatar" title={user.name || "Explorer"}>
              🧒
            </div>

          </div>

        </header>

        {/* Welcome Banner */}
        <section className="welcome-banner">

          <div className="banner-text">

            <span className="banner-label">
              🌈 LET'S LEARN SOMETHING NEW
            </span>

            <h1>
              Learning is more fun when you play!
            </h1>

            <p>
              Explore exciting games, discover new things
              and collect stars along the way.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="#activities"
                className="start-button"
              >
                Explore Activities 🚀
              </a>

              <Link
                to="/library"
                className="start-button"
                style={{ background: "rgba(255, 255, 255, 0.9)", color: "#245b7d" }}
              >
                Learning Library 📚
              </Link>
            </div>

          </div>

          <div className="banner-image">
            🦁 🐼 🐰
            <span>⭐</span>
          </div>

        </section>

        {/* Learning Activities */}
        <section
          className="activities-section"
          id="activities"
        >

          <div className="section-heading">

            <div>
              <h2>Let's Start Learning! 🎯</h2>
              <p>
                Choose an activity and have fun.
              </p>
            </div>

            <span className="activity-count">
              {activities.length} Activities
            </span>

          </div>

          <div className="activities-grid">

            {activities.map((activity, index) => {

              const Icon = activity.icon;

              return (

                <div
                  className={`activity-card ${activity.color}`}
                  key={index}
                >

                  <div className="activity-top">

                    <span className="activity-icon">
                      <Icon size={20} />
                    </span>

                    <span className="activity-level">
                      {activity.level}
                    </span>

                  </div>

                  <div className="activity-emoji">
                    {activity.emoji}
                  </div>

                  <h3>
                    {activity.title}
                  </h3>

                  <p>
                    {activity.description}
                  </p>

                  <button
                    className="play-button"
                    onClick={() => handlePlay(activity)}
                  >
                    Play Now →
                  </button>

                </div>

              );

            })}

          </div>

        </section>

        {/* Learning Progress */}
        <section
          className="progress-section"
          id="progress"
        >

          <div className="progress-title">

            <h2>My Learning Progress 🏆</h2>

            <p>
              Keep learning and collect more stars!
            </p>

          </div>

          <div className="progress-cards">

            <div className="progress-card">
              <span>⭐</span>

              <div>
                <h3>{stars}</h3>
                <p>Total Stars</p>
              </div>
            </div>

            <div className="progress-card">
              <span>🎮</span>

              <div>
                <h3>{gamesPlayed}</h3>
                <p>Games Played</p>
              </div>
            </div>

            <div className="progress-card">
              <span>🏅</span>

              <div>
                <h3>{achievementsCount}</h3>
                <p>Achievements</p>
              </div>
            </div>

          </div>

          {/* Recent Badges Row if user has earned badges */}
          {recentBadges.length > 0 && (
            <div className="badges-unlocked-row">
              <h3>Earned Badges:</h3>
              <div className="badge-chips-list">
                {recentBadges.map((b, idx) => (
                  <div key={idx} className="badge-chip" title={b.title}>
                    <span>{b.icon || "🏅"}</span>
                    <strong>{b.title}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

        {/* Footer */}
        <footer className="dashboard-footer">

          Made with ❤️ for little learners | Play • Learn • Grow

        </footer>

      </main>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏆 Little Learners Leaderboard</h2>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowLeaderboard(false)}
              >
                <X size={20} />
              </button>
            </div>

            <p className="modal-sub">Real-time rankings based on total stars earned in MongoDB:</p>

            <div className="leaderboard-table">
              {leaderboard.map((item, idx) => (
                <div
                  key={idx}
                  className={`leaderboard-row ${item.userEmail === user.email ? "current-user-row" : ""}`}
                >
                  <div className="rank-col">
                    {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : `#${item.rank}`}
                  </div>
                  <div className="user-col">
                    <strong>{item.userName}</strong>
                    <span className="badge-pill">{item.badge}</span>
                  </div>
                  <div className="stars-col">
                    ⭐ {item.totalStars} Stars
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="modal-overlay" onClick={() => setShowFeedback(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>❤️ Share Your Feedback</h2>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowFeedback(false)}
              >
                <X size={20} />
              </button>
            </div>

            <p className="modal-sub">We love hearing from parents and teachers! Stored securely in MongoDB.</p>

            {feedbackStatus && (
              <div className="feedback-alert">
                {feedbackStatus}
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit}>
              <label className="form-lbl">Rating</label>
              <div className="star-rating-selector">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    className="star-rate-btn"
                    onClick={() => setFeedbackRating(starVal)}
                  >
                    <Star
                      size={24}
                      fill={starVal <= feedbackRating ? "#FFC83D" : "#E2E8F0"}
                      color={starVal <= feedbackRating ? "#FFC83D" : "#CBD5E1"}
                    />
                  </button>
                ))}
              </div>

              <label className="form-lbl">Activity / Feature</label>
              <select
                className="feedback-input"
                value={feedbackGame}
                onChange={(e) => setFeedbackGame(e.target.value)}
              >
                <option value="General">General Little Learners Experience</option>
                <option value="Guess the Animal">Guess the Animal</option>
                <option value="Count the Objects">Count the Objects</option>
                <option value="Learn Alphabets">Learn Alphabets</option>
                <option value="Learn Colours">Learn Colours</option>
                <option value="Match the Pairs">Match the Pairs</option>
                <option value="Learn Numbers">Learn Numbers</option>
                <option value="Learning Library">Learning Library</option>
              </select>

              <label className="form-lbl">Your Thoughts / Suggestions</label>
              <textarea
                className="feedback-textarea"
                rows="4"
                placeholder="Tell us what your little learner loved or how we can improve..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                required
              />

              <button
                type="submit"
                className="submit-feedback-btn"
                disabled={feedbackSubmitting}
              >
                <Send size={16} />
                {feedbackSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="modal-overlay" onClick={() => setShowNotifications(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔔 Notifications</h2>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowNotifications(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="notif-list">
              {notifications.map((n, idx) => (
                <div key={idx} className="notif-item">
                  <span className="notif-icon">{n.icon || "🔔"}</span>
                  <div className="notif-text">
                    <h4>{n.title}</h4>
                    <p>{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default HomePage;
