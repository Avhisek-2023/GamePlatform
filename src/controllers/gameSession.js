import GameSession from "../models/gameSession";

export const saveSessionInitials = async (req, res) => {
  try {
    const { projectID } = req.body;
    const userID = req.user.userID;

    const newSession = new GameSession({
      projectID,
      userID,
    });

    const savedSession = await newSession.save();
    return new Response(
      res,
      true,
      201,
      "Game session started.",
      savedSession,
      null
    ).successs();
  } catch (error) {
    return new Response(
      res,
      false,
      500,
      "Failed to start game session.",
      null,
      error.message
    ).errorFun();
  }
};

export const saveSessionFinals = async (req, res) => {
  try {
    const { sessionId, score, result, status } = req.body;

    const updatedSession = await GameSession.findByIdAndUpdate(
      sessionId,
      {
        endedAt: new Date(),
        score,
        result,
        status: status || "completed",
      },
      { new: true }
    );

    if (!updatedSession) {
      return new Response(
        res,
        false,
        404,
        "Game session not found.",
        null,
        null
      ).errorFun();
    }

    return new Response(
      res,
      true,
      200,
      "Game session updated successfully.",
      updatedSession,
      null
    ).successs();
  } catch (error) {
    return new Response(
      res,
      false,
      500,
      "Failed to update game session.",
      null,
      error.message
    ).errorFun();
  }
};
