const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();




const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Or specify allowed origins
  })
);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schemas


const submissionSchema = new mongoose.Schema({
  games: [{ place: Number, players: [String], bonus: Number }],
});

// Create models for the schemas
const Submission = mongoose.model("Submission", submissionSchema);

// Routes
// Fetch all games
app.get("/submissions", async (req, res) => {
  try {
      const games = await Submission.find();
      console.log(games);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch games" });
  }
});

app.get("/player-stats", async (req, res) => {
  try {
    // Define points for each place
    const placePoints = {
      1: 4,
      2: 2,
      3: 1,
      4: 0,
    };

    // Fetch all submissions
    const submissions = await Submission.find();

    // Create a dictionary to store player stats
    const playerStats = {};

    submissions.forEach((submission) => {
      submission.games.forEach((game) => {
        const pointsForPlace = placePoints[game.place] || 0;

        game.players.forEach((player) => {
          if (!playerStats[player]) {
            playerStats[player] = { totalPoints: 0, gamesPlayed: 0 };
          }

          // Add place points and bonus to the player's total points
          playerStats[player].totalPoints += pointsForPlace + game.bonus;
          playerStats[player].gamesPlayed += 1;
        });
      });
    });

    // Convert stats to an array with averages
    const statsArray = Object.entries(playerStats).map(([player, stats]) => ({
      player,
      totalPoints: stats.totalPoints,
      gamesPlayed: stats.gamesPlayed,
      averagePoints:
        stats.gamesPlayed > 0 ? stats.totalPoints / stats.gamesPlayed : 0,
    }));
    statsArray.sort((a, b) => b.averagePoints - a.averagePoints);
    res.json(statsArray);
  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).json({ message: "Failed to fetch player stats" });
  }
});

// Submit form data
app.post("/submissions", async (req, res) => {
  try {
    const { games } = req.body;

    if (!Array.isArray(games)) {
      return res
        .status(400)
        .json({ message: "Invalid games format. Must be an array." });
    }

    const newSubmission = new Submission({ games });
    console.log(games);
    console.log(req.body);
    console.log(newSubmission);
    await newSubmission.save();
    res.status(201).json({ message: "Submission saved!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save submission" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
