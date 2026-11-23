import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/Home";
import AnimalGame from "./pages/AnimalGame";
import CountGame from "./pages/CountGame";
import AlphabetGame from "./pages/AlphabetGame";
import ColourGame from "./pages/ColourGame";
import MatchGame from "./pages/MatchGame";
import NumbersGame from "./pages/NumbersGame";
import LearningLibrary from "./pages/LearningLibrary";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/animal-game" element={<AnimalGame />} />
        <Route path="/count-game" element={<CountGame />} />
        <Route path="/alphabet-game" element={<AlphabetGame />} />
        <Route path="/colour-game" element={<ColourGame />} />
        <Route path="/match-game" element={<MatchGame />} />
        <Route path="/numbers-game" element={<NumbersGame />} />
        <Route path="/library" element={<LearningLibrary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
