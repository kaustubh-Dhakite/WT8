# 🧸 Little Learners — Full-Stack MERN Educational Platform

An interactive, responsive full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed for early childhood learning (ages 1–4). Built as an academic Web Technology laboratory project (Course Code: **2304362L**).

---

## 🌟 Features Overview

- **Preserved Original Design & Branding**: Exact color palettes, typography, card shapes, animations, and layouts.
- **6 Complete Educational Games**:
  1. 🦁 **Guess the Animal**: Multiple-choice wildlife recognition with immediate feedback and audio pronunciation.
  2. ⚽ **Count the Objects**: Interactive object counting with dynamic counters and number selection.
  3. 🔤 **Learn Alphabets**: Letter recognition for words from A to Z with speech audio.
  4. 🎨 **Learn Colours**: Identifying bright colors, color swatches, visual feedback, and voice synthesis.
  5. 🧩 **Match the Pairs**: 12-card memory matching flip game with move tracking and star awards.
  6. 🔢 **Learn Numbers**: Numbers 1 to 20 explorer mode + quiz mode with voice pronunciation.
- **Interactive Learning Library**:
  - Alphabet A–Z
  - Numbers 1–10 in words & 1–20
  - Wild Animals & Pet Animals
  - Fruits, Flowers, Plants & Trees, and Vehicles
  - Web Speech API integration for realistic toddler audio pronunciation.
- **Full Authentication System**:
  - Signup with client-side & server-side validation (Gmail verification `@gmail.com`, min 6 characters, uppercase requirement).
  - Secure bcrypt password hashing and JWT token issuance.
  - Login history tracking in `logins` collection.
- **Dynamic Learning Dashboard**:
  - Real-time stars, games played, and achievements retrieved from MongoDB.
  - Daily learning streak tracker with bonus star rewards.
  - Real-time leaderboard rankings computed across all users.
  - Feedback submission form saving reviews directly to MongoDB.
  - Notifications drawer for streaks and unlocked badges.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, React Router v7, HTML5, CSS3, Lucide React, Web Speech API |
| **Backend** | Node.js, Express.js, CORS, Dotenv, Bcrypt.js, JsonWebToken |
| **Database** | MongoDB Community Server, Mongoose ODM |
| **API Testing** | Postman (Collection included in `backend/postman_collection.json`) |

---

## 📂 Project Directory Structure

```text
little-learners/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection using Mongoose
│   ├── controllers/
│   │   ├── achievementController.js
│   │   ├── authController.js
│   │   ├── feedbackController.js
│   │   ├── gameController.js
│   │   ├── gameRecordController.js
│   │   ├── notificationController.js
│   │   ├── questionController.js
│   │   ├── rankingController.js
│   │   ├── statController.js
│   │   ├── streakController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & optional auth middleware
│   │   ├── errorHandler.js       # Express error and 404 handlers
│   │   └── validator.js          # Server-side validation middleware
│   ├── models/
│   │   ├── Achievement.js        # achievements collection
│   │   ├── DailyStreak.js        # daily_streaks collection
│   │   ├── Feedback.js           # feedback collection
│   │   ├── Game.js               # games collection
│   │   ├── GameRecord.js         # gamerecords collection
│   │   ├── GameStat.js           # gamestats collection
│   │   ├── Login.js              # logins collection
│   │   ├── Notification.js       # notifications collection
│   │   ├── Question.js           # questions collection
│   │   ├── Ranking.js            # rankings collection
│   │   ├── User.js               # users collection
│   │   └── UserAchievement.js    # user_achievements collection
│   ├── routes/
│   │   ├── achievementRoutes.js
│   │   ├── authRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── gameRecordRoutes.js
│   │   ├── gameRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── rankingRoutes.js
│   │   ├── statRoutes.js
│   │   ├── streakRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── jwt.js                # JWT token generator
│   │   └── seedData.js           # Safe seeding of questions & games without data loss
│   ├── .env                      # Environment configuration
│   ├── .env.example
│   ├── package.json
│   ├── postman_collection.json   # Ready-to-import Postman test collection
│   └── server.js                 # Express server entry point
├── src/
│   ├── assets/
│   ├── pages/
│   │   ├── AlphabetGame.jsx      # Game 3: Learn Alphabets
│   │   ├── AnimalGame.jsx        # Game 1: Guess the Animal
│   │   ├── ColourGame.jsx        # Game 4: Learn Colours
│   │   ├── CountGame.jsx         # Game 2: Count the Objects
│   │   ├── Home.jsx              # Dynamic Dashboard & Navigation
│   │   ├── LearningLibrary.jsx   # Multimedia Learning Library
│   │   ├── Login.jsx             # Login with full client validation & API integration
│   │   ├── MatchGame.jsx         # Game 5: Match the Pairs
│   │   ├── NumbersGame.jsx       # Game 6: Learn Numbers
│   │   └── Signup.jsx            # Registration with Gmail validation
│   ├── services/
│   │   └── api.js                # Frontend REST API service and Speech utility
│   ├── styles/
│   │   ├── AlphabetGame.css
│   │   ├── AnimalGame.css
│   │   ├── Auth.css
│   │   ├── ColourGame.css
│   │   ├── CountGame.css
│   │   ├── Home.css
│   │   ├── LearningLibrary.css
│   │   ├── MatchGame.css
│   │   └── NumbersGame.css
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

---

## 🗄️ MongoDB Collections Utilized

All 12 MongoDB collections in `mongodb://127.0.0.1:27017/little_learners` are connected via Mongoose:

1. **`users`**: User records, hashed passwords, stars, games played, achievements count.
2. **`games`**: Active educational game definitions, titles, categories, difficulty, routes.
3. **`questions`**: Game questions, multiple-choice options, correct answers, and emojis.
4. **`gamerecords`**: Historical attempts storing user ID/email, scores, and stars earned.
5. **`gamestats`**: Per-game analytics including high scores, play counts, and total stars awarded.
6. **`achievements`**: Badge rules, requirements (games and stars required), and badge icons.
7. **`user_achievements`**: Badges unlocked by individual learners.
8. **`daily_streaks`**: Consecutive learning day counts, longest streaks, and bonus stars.
9. **`feedback`**: User/parent star ratings, suggestions, and feedback.
10. **`logins`**: Secure audit logs of user login/signup/logout events with timestamps.
11. **`notifications`**: Personalized alerts for streaks, leaderboard positions, and unlocked badges.
12. **`rankings`**: Live leaderboard calculated dynamically by stars earned.

---

## 🚀 Running the Application

### Prerequisites
- Node.js (v18+ or v20+)
- MongoDB Community Server running locally on port 27017

### 1. Start the Backend Server
```bash
# In the project root:
npm run server

# OR navigate to backend directory:
cd backend
npm install
npm start
```
The backend starts on `http://localhost:5000` and automatically connects to `mongodb://127.0.0.1:27017/little_learners`.

### 2. Start the Frontend Client
```bash
# In a separate terminal in the project root:
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 Postman API Testing Instructions

A complete, pre-configured Postman collection is included in the project:
`backend/postman_collection.json`

### Steps to Test in Postman:
1. Open **Postman**.
2. Click **Import** (top left).
3. Select or drag-and-drop `backend/postman_collection.json`.
4. Run requests in sequence:
   - **01. Health Check**: `GET /api` → Returns active endpoints list.
   - **02. Auth - Register User**: `POST /api/auth/register` → Creates new user, returns JWT.
   - **03. Auth - Login User**: `POST /api/auth/login` → Authenticates user, returns token.
   - **04. Auth - /me**: `GET /api/auth/me` with Bearer Token.
   - **05. Users - Profile**: `GET /api/users/profile`.
   - **06. Users - Update Profile (PUT CRUD)**: `PUT /api/users/profile`.
   - **07. Games - Get All**: `GET /api/games`.
   - **08. Questions - Get Questions**: `GET /api/questions?gameTitle=Guess the Animal`.
   - **09. Questions - Create Question (POST CRUD)**: `POST /api/questions`.
   - **10. Game Records - Save Record (POST)**: `POST /api/gamerecords` → Updates user stars and gamestats.
   - **11. Rankings - Leaderboard**: `GET /api/rankings`.
   - **12. Feedback - Submit Feedback (POST CRUD)**: `POST /api/feedback`.
   - **13. Feedback - Get All (GET CRUD)**: `GET /api/feedback`.
   - **14. Notifications - Get Notifications**: `GET /api/notifications?email=aarav@gmail.com`.
   - **15. Streaks - Get Streak**: `GET /api/streaks/my?email=aarav@gmail.com`.

---

## 📚 Web Technology Syllabus Compliance (Course Code: 2304362L)

1. **HTML5 & CSS3**: Semantics, custom responsive layouts, Trebuchet MS styling, smooth transitions.
2. **Bootstrap & Responsive Design**: Flexible grid layouts adapting seamlessly from mobile (320px) to desktop (1600px).
3. **JavaScript & JSON**: Arrays, objects, regex validation, event listeners, JSON data exchange.
4. **Client-Side Validation**: Form validation on signup and login for Gmail format, password length, and uppercase characters.
5. **ReactJS Components & Hooks**: `useState`, `useEffect`, `useNavigate`, reusable component hierarchy.
6. **React Router Navigation**: Multi-page routing across Auth, Home, 6 Educational Games, and Library.
7. **Node.js & Express.js**: RESTful server, middleware architecture, modular routing, and controller separation.
8. **Server-Side Validation**: Sanitization and validation for credentials, game records, and feedback.
9. **RESTful API & CRUD Operations**:
   - **Create (POST)**: `/api/auth/register`, `/api/gamerecords`, `/api/feedback`, `/api/questions`
   - **Read (GET)**: `/api/users/profile`, `/api/games`, `/api/questions`, `/api/rankings`, `/api/gamestats`
   - **Update (PUT/PATCH)**: `/api/users/profile`, `/api/notifications/:id/read`
   - **Delete (DELETE)**: `/api/feedback/:id`, `/api/questions/:id`, `/api/notifications/:id`
10. **MongoDB & NoSQL Database Operations**: 12 Mongoose models, aggregations, streak tracking, atomic score updates.
11. **Security Best Practices**: Password hashing with bcrypt (salt rounds 10), JWT bearer authentication, `.env` protection.
12. **Postman API Testing**: Full collection provided and tested.
"# WT8" 
