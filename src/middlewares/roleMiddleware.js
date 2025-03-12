import User from "../models/users.js";

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userID;
      const user = await User.findById(userId);
      //   console.log(req.user);

      if (!allowedRoles.includes(user.role))
        return res.status(401).json({ message: "Access Denied" });
      next();
    } catch (error) {
      console.log(error.message);
    }
  };
};
