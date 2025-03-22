import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    projectID: {
      type: String,
      required: true,
    },
    developerID: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
    },
    genre: {
      type: String,
      enum: ["Action", "Puzzle"],
    },
    thumbnail: {
      type: String,
    },
    description: {
      type: String,
    },
    projectFilePath: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
