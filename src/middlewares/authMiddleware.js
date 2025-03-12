import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log(process.env.JWT_SECRET);

  let token;
  let authHead = req.headers.Authorization || req.headers.authorization;

  if (authHead && authHead.startsWith("Bearer")) {
    token = authHead.split(" ")[1];
  }
  // console.log("Auth", token);
  if (!token) {
    return res.status(401).json({ message: "Token is Not present" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    // console.log("Decoded User is:", decode);
    next();
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
