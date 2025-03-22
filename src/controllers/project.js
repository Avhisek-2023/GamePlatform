import { Response } from "../CustomResponse/Response.js";
import { upload } from "../lib/uploadZip.js";
import Project from "../models/project.js";
import { validate as uuidValidate } from "uuid";
import { v7 as uuidv7 } from "uuid";
export const createProject = async (req, res) => {
  try {
    const projectUUID = uuidv7();
    const user_id = req.user.userID;

    if (projectUUID !== null) {
      const projectObject = {
        projectID: projectUUID,
        projectName: projectUUID,
        developerID: user_id,
      };

      if (!uuidValidate(projectObject.projectID)) {
        return res.status(400).json({
          error: {
            message: "UUID is not valid",
            success: false,
            status: 400,
          },
        });
      } else {
        const project = await Project.create(projectObject);

        return new Response(res, true, "Project created successfully", {
          projectId: project.projectID,
          developerID: project.developerID,
          gameName: project.projectID,
          genre: project.genre,
          thumbnail: project.thumbnail,
          description: project.description,
        }).successs();
      }
    }
  } catch (error) {
    return new Response(
      res,
      false,
      "Error in creating project",
      error
    ).errorFun();
  }
};

export const uploadProject = async (req, res) => {
  try {
    const file = req.file;
    const { projectID, projectName, genre, description } = req.body;
    const project = await Project.findOne({ projectID });
    if (project) {
      project.projectName = projectName;
      project.genre = genre;
      project.description = description;
      project.projectFilePath = filePath(projectID);
      await project.save();
      upload(file, projectID, projectName, res);
      return new Response(res, true, "Project Uploaded successfully", {
        projectId: project.projectID,
        developerID: project.developerID,
        gameName: project.projectID,
        genre: project.genre,
        thumbnail: project.thumbnail,
        description: project.description,
        projectFilePath: project.projectFilePath,
      }).successs();
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Project not found" });
    }
  } catch (error) {
    return new Response(
      res,
      false,
      "Error in uploading project",
      error
    ).errorFun();
  }
};

const filePath = (projectID, projectName) => {
  return `public/uploads/${projectID}`;
};

export const getAllProject = async (req, res) => {
  try {
    const projects = await Project.find();
    return new Response(
      res,
      true,
      "Project Retrieved Successfully",
      projects
    ).successs();
  } catch (error) {
    return new Response(
      res,
      false,
      "Error in retrieving project",
      error
    ).errorFun();
  }
};

export const getDeveloperProject = async (req, res) => {
  try {
    const projects = await Project.find({ developerID: req.user.userID });
    return new Response(
      res,
      true,
      "Project Retrieved Successfully",
      projects
    ).successs();
  } catch (error) {
    return new Response(
      res,
      false,
      "Error in retrieving project",
      error
    ).errorFun();
  }
};
