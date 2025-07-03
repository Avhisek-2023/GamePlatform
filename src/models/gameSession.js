import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema(
  {
    projectID: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["running", "completed", "abandoned"],
      default: "running",
    },
    score: {
      type: Number,
      default: null,
    },
    result: {
      type: String,
      enum: ["won", "lost", "draw", null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const GameSession = mongoose.model("GameSession", gameSessionSchema);

export default GameSession;
