import Question from '../models/Question.js';
import Game from '../models/Game.js';
import GameStat from '../models/GameStat.js';

export const seedInitialData = async () => {
  try {
    // 1. Ensure all 6 games exist in games collection
    const defaultGames = [
      {
        title: "Guess the Animal",
        category: "Science & Nature",
        description: "Discover amazing animals and test wildlife knowledge!",
        emoji: "🦁",
        level: "Easy",
        route: "/animal-game",
        isActive: true
      },
      {
        title: "Count the Objects",
        category: "Math & Numbers",
        description: "Count fun objects and learn numbers with joy!",
        emoji: "⚽",
        level: "Easy",
        route: "/count-game",
        isActive: true
      },
      {
        title: "Learn Alphabets",
        category: "Language & Reading",
        description: "Explore the ABCs with colourful words and pictures!",
        emoji: "🔤",
        level: "Easy",
        route: "/alphabet-game",
        isActive: true
      },
      {
        title: "Learn Colours",
        category: "Visual Arts",
        description: "Discover bright beautiful colours and everyday items!",
        emoji: "🎨",
        level: "Easy",
        route: "/colour-game",
        isActive: true
      },
      {
        title: "Match the Pairs",
        category: "Brain & Memory",
        description: "Flip and match cute animal friends to train memory!",
        emoji: "🧩",
        level: "Fun",
        route: "/match-game",
        isActive: true
      },
      {
        title: "Learn Numbers",
        category: "Math & Logic",
        description: "Explore numbers 1 to 20 with interactive counting & quiz!",
        emoji: "🔢",
        level: "Easy",
        route: "/numbers-game",
        isActive: true
      }
    ];

    for (const g of defaultGames) {
      const exists = await Game.findOne({ title: g.title });
      if (!exists) {
        await Game.create(g);
      }
    }

    // 2. Ensure each game has its GameStat initialized
    for (const g of defaultGames) {
      const exists = await GameStat.findOne({ gameTitle: g.title });
      if (!exists) {
        await GameStat.create({
          gameTitle: g.title,
          emoji: g.emoji,
          highScore: 0,
          playCount: 0,
          totalStarsAwarded: 0,
          lastPlayedAt: new Date()
        });
      }
    }

    // 3. Ensure full questions exist safely for all games
    const initialQuestions = [
      // Guess the Animal
      {
        gameTitle: "Guess the Animal",
        questionText: "Which animal has a long neck?",
        emoji: "🦒",
        options: ["Lion", "Giraffe", "Zebra", "Bear"],
        correctAnswer: "Giraffe",
        difficulty: "Easy"
      },
      {
        gameTitle: "Guess the Animal",
        questionText: "Which animal is the King of the Jungle?",
        emoji: "🦁",
        options: ["Cat", "Lion", "Rabbit", "Dog"],
        correctAnswer: "Lion",
        difficulty: "Easy"
      },
      {
        gameTitle: "Guess the Animal",
        questionText: "Which animal has a long trunk?",
        emoji: "🐘",
        options: ["Horse", "Elephant", "Rabbit", "Monkey"],
        correctAnswer: "Elephant",
        difficulty: "Easy"
      },
      {
        gameTitle: "Guess the Animal",
        questionText: "Which animal loves climbing trees?",
        emoji: "🐵",
        options: ["Monkey", "Cow", "Sheep", "Tiger"],
        correctAnswer: "Monkey",
        difficulty: "Easy"
      },
      {
        gameTitle: "Guess the Animal",
        questionText: "Which bird cannot fly?",
        emoji: "🐧",
        options: ["Parrot", "Eagle", "Penguin", "Crow"],
        correctAnswer: "Penguin",
        difficulty: "Easy"
      },
      {
        gameTitle: "Guess the Animal",
        questionText: "Which animal has long ears and loves carrots?",
        emoji: "🐰",
        options: ["Rabbit", "Elephant", "Fox", "Cow"],
        correctAnswer: "Rabbit",
        difficulty: "Easy"
      },
      {
        gameTitle: "Guess the Animal",
        questionText: "Which animal loves eating green bamboo?",
        emoji: "🐼",
        options: ["Bear", "Panda", "Wolf", "Deer"],
        correctAnswer: "Panda",
        difficulty: "Easy"
      },
      {
        gameTitle: "Guess the Animal",
        questionText: "Which friendly animal swims in the sea?",
        emoji: "🐬",
        options: ["Camel", "Horse", "Dolphin", "Monkey"],
        correctAnswer: "Dolphin",
        difficulty: "Easy"
      },

      // Count the Objects
      {
        gameTitle: "Count the Objects",
        questionText: "Count the sweet apples!",
        emoji: "🍎",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        difficulty: "Easy"
      },
      {
        gameTitle: "Count the Objects",
        questionText: "How many footballs are on the field?",
        emoji: "⚽",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        difficulty: "Easy"
      },
      {
        gameTitle: "Count the Objects",
        questionText: "How many bright stars can you see?",
        emoji: "⭐",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7",
        difficulty: "Easy"
      },
      {
        gameTitle: "Count the Objects",
        questionText: "Count the flying balloons!",
        emoji: "🎈",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        difficulty: "Easy"
      },
      {
        gameTitle: "Count the Objects",
        questionText: "How many pink flowers are blooming?",
        emoji: "🌸",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6",
        difficulty: "Easy"
      },
      {
        gameTitle: "Count the Objects",
        questionText: "Count the juicy oranges!",
        emoji: "🍊",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        difficulty: "Easy"
      },
      {
        gameTitle: "Count the Objects",
        questionText: "How many colorful butterflies are fluttering?",
        emoji: "🦋",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        difficulty: "Easy"
      },
      {
        gameTitle: "Count the Objects",
        questionText: "Count the cuddly teddy bears!",
        emoji: "🧸",
        options: ["7", "8", "9", "10"],
        correctAnswer: "9",
        difficulty: "Easy"
      },

      // Learn Alphabets
      {
        gameTitle: "Learn Alphabets",
        questionText: "Which letter does Apple start with?",
        emoji: "🍎",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Alphabets",
        questionText: "Which letter does Ball start with?",
        emoji: "⚽",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Alphabets",
        questionText: "Which letter does Cat start with?",
        emoji: "🐱",
        options: ["C", "D", "E", "F"],
        correctAnswer: "C",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Alphabets",
        questionText: "Which letter does Dog start with?",
        emoji: "🐶",
        options: ["A", "D", "E", "F"],
        correctAnswer: "D",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Alphabets",
        questionText: "Which letter does Elephant start with?",
        emoji: "🐘",
        options: ["B", "C", "E", "F"],
        correctAnswer: "E",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Alphabets",
        questionText: "Which letter does Fish start with?",
        emoji: "🐟",
        options: ["C", "D", "E", "F"],
        correctAnswer: "F",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Alphabets",
        questionText: "Which letter does Grapes start with?",
        emoji: "🍇",
        options: ["G", "H", "I", "J"],
        correctAnswer: "G",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Alphabets",
        questionText: "Which letter does House start with?",
        emoji: "🏠",
        options: ["E", "F", "G", "H"],
        correctAnswer: "H",
        difficulty: "Easy"
      },

      // Learn Colours
      {
        gameTitle: "Learn Colours",
        questionText: "What colour is the bright sky?",
        emoji: "☀️",
        options: ["Blue", "Green", "Red", "Yellow"],
        correctAnswer: "Blue",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Colours",
        questionText: "What colour is a ripe red strawberry?",
        emoji: "🍓",
        options: ["Red", "Purple", "Orange", "Pink"],
        correctAnswer: "Red",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Colours",
        questionText: "What colour is the fresh green grass?",
        emoji: "🌱",
        options: ["Yellow", "Green", "Blue", "Brown"],
        correctAnswer: "Green",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Colours",
        questionText: "What colour is a sunny sunflower?",
        emoji: "🌻",
        options: ["Pink", "Yellow", "White", "Black"],
        correctAnswer: "Yellow",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Colours",
        questionText: "What colour is an orange pumpkin?",
        emoji: "🎃",
        options: ["Blue", "Red", "Orange", "Green"],
        correctAnswer: "Orange",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Colours",
        questionText: "What colour are sweet purple grapes?",
        emoji: "🍇",
        options: ["Purple", "Yellow", "Red", "Cyan"],
        correctAnswer: "Purple",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Colours",
        questionText: "What colour is a pink flamingo?",
        emoji: "🦩",
        options: ["Pink", "Green", "Blue", "Grey"],
        correctAnswer: "Pink",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Colours",
        questionText: "What colour is a fluffy white cloud?",
        emoji: "☁️",
        options: ["White", "Black", "Purple", "Green"],
        correctAnswer: "White",
        difficulty: "Easy"
      },

      // Learn Numbers
      {
        gameTitle: "Learn Numbers",
        questionText: "What number comes after 9?",
        emoji: "🔟",
        options: ["8", "10", "11", "12"],
        correctAnswer: "10",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Numbers",
        questionText: "What number is ONE?",
        emoji: "☝️",
        options: ["1", "2", "3", "4"],
        correctAnswer: "1",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Numbers",
        questionText: "How many legs does a dog have?",
        emoji: "🐕",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Numbers",
        questionText: "How many fingers are on one hand?",
        emoji: "🖐️",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Numbers",
        questionText: "What number comes after 14?",
        emoji: "🔢",
        options: ["13", "15", "16", "17"],
        correctAnswer: "15",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Numbers",
        questionText: "How many wheels does a bicycle have?",
        emoji: "🚲",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Numbers",
        questionText: "What number is represented by 2 tens (20)?",
        emoji: "🎯",
        options: ["10", "15", "18", "20"],
        correctAnswer: "20",
        difficulty: "Easy"
      },
      {
        gameTitle: "Learn Numbers",
        questionText: "Which number comes right before 8?",
        emoji: "🎲",
        options: ["6", "7", "9", "10"],
        correctAnswer: "7",
        difficulty: "Easy"
      }
    ];

    for (const q of initialQuestions) {
      const exists = await Question.findOne({ questionText: q.questionText });
      if (!exists) {
        await Question.create(q);
      }
    }

    console.log('✅ Database collections verified and ready.');
  } catch (err) {
    console.error('Error during data seeding check:', err);
  }
};
