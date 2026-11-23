import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, BookOpen, Search } from "lucide-react";
import { speakWord } from "../services/api";
import "../styles/LearningLibrary.css";

const libraryCategories = [
  { id: "wild", name: "Wild Animals", emoji: "🦁" },
  { id: "pets", name: "Pet Animals", emoji: "🐶" },
  { id: "fruits", name: "Fruits", emoji: "🍎" },
  { id: "flowers", name: "Flowers", emoji: "🌸" },
  { id: "plants", name: "Plants & Trees", emoji: "🌿" },
  { id: "vehicles", name: "Vehicles", emoji: "🚗" },
  { id: "alphabets", name: "Alphabet A–Z", emoji: "🔤" },
  { id: "numbers", name: "Numbers 1–20", emoji: "🔢" }
];

const libraryItems = {
  wild: [
    { name: "Lion", emoji: "🦁", sound: "Roar! Lion is the majestic King of the Jungle.", desc: "Has a magnificent golden mane." },
    { name: "Tiger", emoji: "🐯", sound: "Grrr! Tiger has orange fur with black stripes.", desc: "The biggest cat in the wild." },
    { name: "Elephant", emoji: "🐘", sound: "Trumpet! Elephant is the largest land animal.", desc: "Uses its long trunk to drink and pick food." },
    { name: "Giraffe", emoji: "🦒", sound: "Giraffe has a super long neck.", desc: "Eats green leaves high up on acacia trees." },
    { name: "Panda", emoji: "🐼", sound: "Panda loves munching on crunchy green bamboo.", desc: "Famous for black and white furry patches." },
    { name: "Monkey", emoji: "🐵", sound: "Ooh-ooh-aah-aah! Monkey loves swinging on trees.", desc: "Eats sweet bananas and plays with friends." },
    { name: "Zebra", emoji: "🦓", sound: "Zebra has beautiful black and white stripes.", desc: "Every zebra has a unique pattern of stripes." },
    { name: "Bear", emoji: "🐻", sound: "Growl! Bear loves sweet honey and berries.", desc: "Sleeps warmly in a cozy den in winter." }
  ],
  pets: [
    { name: "Dog", emoji: "🐶", sound: "Woof woof! Dog is man's best friend.", desc: "Loyal, playful, and loves wagging its tail." },
    { name: "Cat", emoji: "🐱", sound: "Meow meow! Cat purrs when it is happy.", desc: "Gentle, soft, and loves chasing balls of yarn." },
    { name: "Rabbit", emoji: "🐰", sound: "Hop hop! Rabbit loves crunchy carrots.", desc: "Has long soft ears and a cute twitchy nose." },
    { name: "Parrot", emoji: "🦜", sound: "Squawk! Parrot has colorful feathers.", desc: "Can mimic human words and sounds." },
    { name: "Hamster", emoji: "🐹", sound: "Squeak! Hamster loves running on its wheel.", desc: "Stores yummy seeds inside its puffy cheeks." },
    { name: "Goldfish", emoji: "🐠", sound: "Swish swish! Goldfish glides gracefully in water.", desc: "Has shimmering scales and a flowing tail." }
  ],
  fruits: [
    { name: "Apple", emoji: "🍎", sound: "Crunchy red apple keeps the doctor away.", desc: "Sweet, juicy, and packed with vitamins." },
    { name: "Banana", emoji: "🍌", sound: "Sweet yellow banana is monkey's favorite.", desc: "Easy to peel and gives instant energy." },
    { name: "Orange", emoji: "🍊", sound: "Juicy citrus orange is rich in Vitamin C.", desc: "Round, bright orange, and tangy-sweet." },
    { name: "Mango", emoji: "🥭", sound: "Mango is the King of all fruits.", desc: "Luscious, golden, and heavenly sweet in summer." },
    { name: "Grapes", emoji: "🍇", sound: "Sweet green and purple bunches of grapes.", desc: "Delicious bite-sized fruit that grows on vines." },
    { name: "Strawberry", emoji: "🍓", sound: "Sweet red strawberry with tiny golden seeds.", desc: "Heart-shaped and lovely with whipped cream." },
    { name: "Watermelon", emoji: "🍉", sound: "Refreshing watermelon with sweet red flesh.", desc: "Big, striped green outside, juicy inside." },
    { name: "Pineapple", emoji: "🍍", sound: "Tropical pineapple with a spiky green crown.", desc: "Tangy and sweet with golden tropical slices." }
  ],
  flowers: [
    { name: "Rose", emoji: "🌹", sound: "Red rose is known for its sweet romantic fragrance.", desc: "Has soft red petals and protective little thorns." },
    { name: "Sunflower", emoji: "🌻", sound: "Bright yellow sunflower turns towards the sun.", desc: "Tall and cheerful with golden petals." },
    { name: "Lotus", emoji: "🪷", sound: "Lotus is India's beautiful national flower.", desc: "Blooms cleanly and peacefully above the water." },
    { name: "Tulip", emoji: "🌷", sound: "Cup-shaped tulip blooms in colorful spring gardens.", desc: "Smooth bell-shaped flower with vibrant petals." },
    { name: "Daisy", emoji: "🌼", sound: "White daisy with a sunny yellow center.", desc: "Simple, friendly, and spreads sunshine." },
    { name: "Hibiscus", emoji: "🌺", sound: "Hibiscus flower with brilliant red petals.", desc: "Attracts hummingbirds and butterflies." }
  ],
  plants: [
    { name: "Banyan Tree", emoji: "🌳", sound: "Grand Banyan Tree provides cool shady breeze.", desc: "Huge canopy with long hanging aerial roots." },
    { name: "Cactus", emoji: "🌵", sound: "Green cactus stores water in the warm desert.", desc: "Has sharp spines instead of wide leaves." },
    { name: "Bamboo", emoji: "🎋", sound: "Bamboo is the fastest growing grass in nature.", desc: "Strong, hollow, and flexible green stalks." },
    { name: "Pine Tree", emoji: "🌲", sound: "Evergreen pine tree stays green even in winter.", desc: "Has needle-like leaves and woody pinecones." },
    { name: "Fern", emoji: "🌿", sound: "Feathery green fern loves cool shady rainforests.", desc: "Delicate fronds that unfurl like fiddleheads." },
    { name: "Sprout", emoji: "🌱", sound: "Little green seedling sprouting from fertile soil.", desc: "The baby beginning of every mighty tree." }
  ],
  vehicles: [
    { name: "Car", emoji: "🚗", sound: "Vroom vroom! Car drives safely on the road.", desc: "Has four wheels and takes families on trips." },
    { name: "School Bus", emoji: "🚌", sound: "Honk honk! Yellow school bus brings children to school.", desc: "Large friendly vehicle with many cozy seats." },
    { name: "Airplane", emoji: "✈️", sound: "Whoosh! Airplane flies high across the blue clouds.", desc: "Has big wings and jet engines to travel far." },
    { name: "Train", emoji: "🚂", sound: "Choo-choo! Train runs smoothly on long steel tracks.", desc: "Pulls passenger coaches across cities and hills." },
    { name: "Bicycle", emoji: "🚲", sound: "Ring ring! Bicycle is eco-friendly and fun to pedal.", desc: "Two wheels powered by your strong little legs." },
    { name: "Boat", emoji: "⛵", sound: "Splash! Sailboat glides with the gentle sea wind.", desc: "Floats across rivers, lakes, and wide oceans." },
    { name: "Fire Engine", emoji: "🚒", sound: "Wee-woo! Fire truck rushes to put out fires.", desc: "Has long ladders, water hoses, and flashing sirens." },
    { name: "Rocket", emoji: "🚀", sound: "3, 2, 1, Blast off! Rocket shoots into outer space.", desc: "Carries courageous astronauts to the moon and stars." }
  ],
  alphabets: Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    const examples = {
      A: { word: "Apple", emoji: "🍎" },
      B: { word: "Ball", emoji: "⚽" },
      C: { word: "Cat", emoji: "🐱" },
      D: { word: "Dog", emoji: "🐶" },
      E: { word: "Elephant", emoji: "🐘" },
      F: { word: "Fish", emoji: "🐟" },
      G: { word: "Grapes", emoji: "🍇" },
      H: { word: "House", emoji: "🏠" },
      I: { word: "Ice Cream", emoji: "🍦" },
      J: { word: "Juice", emoji: "🧃" },
      K: { word: "Kite", emoji: "🪁" },
      L: { word: "Lion", emoji: "🦁" },
      M: { word: "Monkey", emoji: "🐵" },
      N: { word: "Nest", emoji: "🪺" },
      O: { word: "Orange", emoji: "🍊" },
      P: { word: "Penguin", emoji: "🐧" },
      Q: { word: "Queen", emoji: "👑" },
      R: { word: "Rainbow", emoji: "🌈" },
      S: { word: "Sun", emoji: "☀️" },
      T: { word: "Tree", emoji: "🌳" },
      U: { word: "Umbrella", emoji: "☂️" },
      V: { word: "Violin", emoji: "🎻" },
      W: { word: "Watch", emoji: "⌚" },
      X: { word: "Xylophone", emoji: "🎼" },
      Y: { word: "Yo-yo", emoji: "🪀" },
      Z: { word: "Zebra", emoji: "🦓" }
    };
    const ex = examples[letter] || { word: letter, emoji: "✨" };
    return {
      name: `${letter} is for ${ex.word}`,
      emoji: ex.emoji,
      sound: `${letter} for ${ex.word}`,
      desc: `Capital letter ${letter} and lowercase ${letter.toLowerCase()}`
    };
  }),
  numbers: [
    { name: "1 - One", emoji: "1️⃣", sound: "Number One", desc: "One sun shining bright ☀️" },
    { name: "2 - Two", emoji: "2️⃣", sound: "Number Two", desc: "Two playful eyes 👀" },
    { name: "3 - Three", emoji: "3️⃣", sound: "Number Three", desc: "Three wheels on a tricycle 🛺" },
    { name: "4 - Four", emoji: "4️⃣", sound: "Number Four", desc: "Four legs on a dog 🐕" },
    { name: "5 - Five", emoji: "5️⃣", sound: "Number Five", desc: "Five fingers on one hand 🖐️" },
    { name: "6 - Six", emoji: "6️⃣", sound: "Number Six", desc: "Six legs on an insect 🐜" },
    { name: "7 - Seven", emoji: "7️⃣", sound: "Number Seven", desc: "Seven colours in a rainbow 🌈" },
    { name: "8 - Eight", emoji: "8️⃣", sound: "Number Eight", desc: "Eight legs on an octopus 🐙" },
    { name: "9 - Nine", emoji: "9️⃣", sound: "Number Nine", desc: "Nine planets and stars ⭐" },
    { name: "10 - Ten", emoji: "🔟", sound: "Number Ten", desc: "Ten little toes on your feet 🦶" },
    { name: "11 - Eleven", emoji: "1️⃣1️⃣", sound: "Number Eleven", desc: "Ten plus one more!" },
    { name: "12 - Twelve", emoji: "1️⃣2️⃣", sound: "Number Twelve", desc: "Twelve months in a year 📅" },
    { name: "13 - Thirteen", emoji: "1️⃣3️⃣", sound: "Number Thirteen", desc: "Baker's dozen sweet treats 🧁" },
    { name: "14 - Fourteen", emoji: "1️⃣4️⃣", sound: "Number Fourteen", desc: "Two whole weeks 🗓️" },
    { name: "15 - Fifteen", emoji: "1️⃣5️⃣", sound: "Number Fifteen", desc: "Three times five!" },
    { name: "16 - Sixteen", emoji: "1️⃣6️⃣", sound: "Number Sixteen", desc: "Four times four!" },
    { name: "17 - Seventeen", emoji: "1️⃣7️⃣", sound: "Number Seventeen", desc: "Ten and seven bright stars ✨" },
    { name: "18 - Eighteen", emoji: "1️⃣8️⃣", sound: "Number Eighteen", desc: "Ten plus eight!" },
    { name: "19 - Nineteen", emoji: "1️⃣9️⃣", sound: "Number Nineteen", desc: "Just one step before twenty!" },
    { name: "20 - Twenty", emoji: "2️⃣0️⃣", sound: "Number Twenty", desc: "Two whole tens! Hooray! 🎉" }
  ]
};

function LearningLibrary() {
  const [activeCategory, setActiveCategory] = useState("wild");
  const [search, setSearch] = useState("");

  const items = libraryItems[activeCategory] || [];
  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="library-page">
      <header className="library-header">
        <Link to="/home" className="back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <div className="library-brand">🧸 Little Learners Library</div>
        <div className="library-badge">
          <BookOpen size={18} />
          <span>Interactive Library</span>
        </div>
      </header>

      <main className="library-content">
        <div className="library-hero">
          <span className="hero-tag">🌟 EXPLORE & LISTEN</span>
          <h1>Learning Library for Little Explorers</h1>
          <p>
            Tap any card to hear pronunciation and explore wonderful animals,
            fruits, flowers, vehicles, letters, and numbers!
          </p>

          <div className="library-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search words, animals, items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="categories-scroll-bar">
          {libraryCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill ${activeCategory === cat.id ? "active-cat" : ""}`}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearch("");
                speakWord(cat.name);
              }}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="library-grid">
          {filtered.map((item, index) => (
            <div
              key={index}
              className="library-card"
              onClick={() => speakWord(item.sound || item.name)}
            >
              <div className="card-top-action">
                <button
                  type="button"
                  className="card-audio-btn"
                  title="Listen"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(item.sound || item.name);
                  }}
                >
                  <Volume2 size={18} />
                </button>
              </div>

              <div className="card-item-emoji">{item.emoji}</div>

              <h3>{item.name}</h3>
              <p>{item.desc}</p>

              <button
                type="button"
                className="listen-chip"
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(item.sound || item.name);
                }}
              >
                Listen Sound 🔊
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default LearningLibrary;
