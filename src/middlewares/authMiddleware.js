import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token;
  let authHead = req.headers.Authorization || req.headers.authorization;

  if (authHead && authHead.startsWith("Bearer")) {
    token = authHead.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Token is Not present" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({ message: error });
  }
};
