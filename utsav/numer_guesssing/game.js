const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");

// Initialize the readline interface
const rl = readline.createInterface({ input, output });

// State to track high scores (fewest attempts per difficulty)
const highScores = {
  Easy: Infinity,
  Medium: Infinity,
  Hard: Infinity,
};

// Helper function to generate a dynamic hint
function getHint(targetNumber) {
  const isEven = targetNumber % 2 === 0;
  const isMultipleOf5 = targetNumber % 5 === 0;

  // Pick a random hint to keep it fresh
  const hints = [
    `The number is an ${isEven ? "even" : "odd"} number.`,
    isMultipleOf5
      ? `The number is a multiple of 5.`
      : `The number is NOT a multiple of 5.`,
  ];

  return hints[Math.floor(Math.random() * hints.length)];
}

// Main game loop
async function startGame() {
  console.log("\n=======================================");
  console.log("  Welcome to the Number Guessing Game! ");
  console.log("=======================================");

  let keepPlaying = true;

  while (keepPlaying) {
    await playRound();

    const answer = await rl.question(
      "\nDo you want to play another round? (y/n): ",
    );
    if (answer.toLowerCase().trim() !== "y") {
      keepPlaying = false;
    }
  }

  console.log("\nThanks for playing! Goodbye.");
  rl.close();
}

// Logic for a single round
async function playRound() {
  console.log("\nI'm thinking of a number between 1 and 100.");
  console.log("Please select the difficulty level:");
  console.log("1. Easy (10 chances)");
  console.log("2. Medium (5 chances)");
  console.log("3. Hard (3 chances)");

  let maxChances = 0;
  let difficultyName = "";

  // Loop until user provides a valid difficulty
  while (true) {
    const choice = await rl.question("Enter your choice (1, 2, or 3): ");
    if (choice === "1") {
      maxChances = 10;
      difficultyName = "Easy";
      break;
    } else if (choice === "2") {
      maxChances = 5;
      difficultyName = "Medium";
      break;
    } else if (choice === "3") {
      maxChances = 3;
      difficultyName = "Hard";
      break;
    } else {
      console.log("Invalid choice. Please try again.");
    }
  }

  console.log(
    `\nGreat! You have selected the ${difficultyName} difficulty level.`,
  );
  console.log(
    "Let's start the game! (Type 'hint' at any time if you get stuck)",
  );

  // Game variables
  const targetNumber = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;
  let hasWon = false;
  const startTime = Date.now(); // Start timer

  // Guessing loop
  while (attempts < maxChances) {
    const userInput = await rl.question("Enter your guess: ");

    // Hint System
    if (userInput.toLowerCase().trim() === "hint") {
      console.log(`--> HINT: ${getHint(targetNumber)}`);
      continue; // We don't penalize them an attempt for asking for a hint
    }

    const guess = parseInt(userInput, 10);

    // Validation
    if (isNaN(guess) || guess < 1 || guess > 100) {
      console.log("Please enter a valid number between 1 and 100.");
      continue;
    }

    attempts++;

    // Win condition
    if (guess === targetNumber) {
      hasWon = true;
      break;
    }
    // Feedback logic
    else if (guess > targetNumber) {
      console.log(`Incorrect! The number is less than ${guess}.`);
    } else {
      console.log(`Incorrect! The number is greater than ${guess}.`);
    }
  }

  // End of round calculations
  const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1); // Convert ms to seconds

  if (hasWon) {
    console.log(
      `\nCongratulations! You guessed the correct number in ${attempts} attempts.`,
    );
    console.log(`It took you ${timeTaken} seconds.`);

    // High Score Tracking
    if (attempts < highScores[difficultyName]) {
      highScores[difficultyName] = attempts;
      console.log(
        `🎉 NEW HIGH SCORE for ${difficultyName}! (${attempts} attempts)`,
      );
    }
  } else {
    console.log(
      `\nGame Over! You ran out of chances. The correct number was ${targetNumber}.`,
    );
  }

  // Display current session high scores
  console.log("\n--- Session High Scores ---");
  console.log(
    `Easy:   ${highScores.Easy === Infinity ? "-" : highScores.Easy + " attempts"}`,
  );
  console.log(
    `Medium: ${highScores.Medium === Infinity ? "-" : highScores.Medium + " attempts"}`,
  );
  console.log(
    `Hard:   ${highScores.Hard === Infinity ? "-" : highScores.Hard + " attempts"}`,
  );
  console.log("---------------------------");
}

// Start the application
startGame();
