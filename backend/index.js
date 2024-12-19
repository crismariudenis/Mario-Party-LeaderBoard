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
