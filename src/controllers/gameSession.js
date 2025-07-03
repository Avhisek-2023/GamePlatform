import { Response } from "../CustomResponse/Response.js";
import GameSession from "../models/gameSession.js";

export const createSession = async (req,res)=>{
  try {
    const{projectID}=req.body;
    const userID=req.user.userID;
    console.log(projectID,userID);
    const newSession=new GameSession({
      projectID,
      userID
    });
    const savedSession=await newSession.save();
    console.log(savedSession);
    
    return new Response(
      res,
      true,
      201,
      "Game session started.",
      savedSession
    ).successs();
    
  } catch (error) {
    return new Response(
      res,
      false,
      500,
      "Failed to start game session.",
      error.message
    ).errorFun();
  }
}

export const updateSession = async (req, res) => {
  try {
    const { sessionID, score, result, status } = req.body;

    const updatedSession = await GameSession.findByIdAndUpdate(
      sessionID,
      {
        endedAt: new Date(),
        score,
        result,
        status: status || "completed",
      },
      { new: true }
    );
   console.log(updatedSession);

    if (!updatedSession) {
      return new Response(
        res,
        false,
        404,
        "Game session not found.",
        null,
      ).errorFun();
    }

    return new Response(
      res,
      true,
      200,
      "Game session updated successfully.",
      updatedSession,

    ).successs();
  } catch (error) {
    return new Response(
      res,
      false,
      500,
      "Failed to update game session.",
      error.message
    ).errorFun();
  }
};

export const getAllSession= async(req,res)=>{
  try {
    const allSessions = await GameSession.find();
    return new Response(
      res,
      true,
      200,
      "Session fetched successfully",
      allSessions
    ).successs();

  } catch (error) {
    return new Response(
      res,
      false,
      400,
      error.message,
    ).errorFun();
  }
}