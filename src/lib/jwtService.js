import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";


configDotenv();

console.log(process.env.JWT_SECRET,"secret");


export const generateToken = (userID, res) => {
  const access_token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  const refresh_token = jwt.sign({ userID }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("access_token", access_token, {
    maxAge: 30 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "developement",
  });
  res.cookie("refresh_token", refresh_token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "developement",
  });

  return { access_token, refresh_token };
};
