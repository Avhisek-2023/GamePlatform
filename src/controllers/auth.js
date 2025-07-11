import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwtService.js";
import User from "../models/users.js";
import UserProfile from "../models/userprofile.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { Response } from "../CustomResponse/Response.js";
// import { sendResetPasswordEmail } from "../lib/emailService.js";
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (password.length < 6) {
      return new Response(
        res,
        false,
        400,

        "Password must be atleast 6 chatracters",
        // error
      ).errorFun();

    }
    const user = await User.findOne({ email });
    console.log(user);
    
    if (user) return new Response(
      res,
      true,
      304,
      "User already exists",
      // error
    ).errorFun();


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (newUser) {
      const { access_token, refresh_token } = generateToken(newUser._id, res);
      const user = await newUser.save();
      const newProfile = new UserProfile({
        user_id: user._id,
        name: name,
        email: email,
        role: role,
      });
      await newProfile.save();
      return new Response(res, true, 201, "Registration successfull", { access_token: access_token, refresh_token: refresh_token }).successs();

    } else {
      return new Response(
        res,
        false,
        400,
        "Registration failed",
        // error
      ).errorFun();

    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      res,
      false,
      500,
      "Internal Server Error",
      // error
    ).errorFun();
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return new Response(
      res,
      true,
      401,
      "Invalid Credentials",
      // error
    ).errorFun();

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return new Response(
        res,
        true,
        401,
        "Invalid Credentials",
        // error
      ).errorFun();

    const { access_token, refresh_token } = generateToken(user._id, res);
    return new Response(
      res, true, 200, "Login successfull", { access_token: access_token, refresh_token: refresh_token }
    ).successs();


  } catch (error) {
    console.error("Error:", error);
    return new Response(
      res,
      false,
      500,
      "Internal Server Error",
      // error
    ).errorFun();
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.cookie("access_token", "", { maxAge: 0 });
    res.cookie("refresh_token", "", { maxAge: 0 });
    return new Response(
      res, true, 200, "Logout successfull"
    ).successs();

  } catch (error) {
    return new Response(
      res,
      false,
      400,
      "invalid request",
      // error
    ).errorFun();
  }
};
const sendResetPasswordEmail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "app.testplatform123@gmail.com",
      to: email,
      subject: "For Reset password",
      html: `<b>Hii ${name}, Please click this link <a href=http://localhost:8004/api/auth/reset-password?token=${token}>reset your password></a> </b>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error", error);
      } else {
        console.log("Mail has been sent", info.response);
      }
    });
  } catch (error) {
    return new Response(
      res,
      false,
      400,
      "invalid request",
      // error
    ).errorFun();
  }
};

export const forget_password = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email });
    if (userData) {
      const randomstr = randomstring.generate();
      const data = await User.updateOne(
        { email: email },
        { $set: { token: randomstr } }
      );
      sendResetPasswordEmail(userData.name, userData.email, randomstr);
      return new Response(
        res,
        true,
        200,
        "Please check your mail and reset password",
        // error
      ).success();
    } else {
      return new Response(
        res,
        true,
        200,
        "Email Already Exists",
        // error
      ).errorFun();
    }
  } catch (error) {
    return new Response(
      res,
      false,
      400,
      error.message,
      // error
    ).errorFun();
  }
};

export const reset_password = async (req, res) => {
  try {
    const token = req.query.token;
    const userData = await User.findOne({ token: token });
    if (userData) {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate(
        {
          _id: userData._id,
        },
        { $set: { password: hashedPassword, token: "" } },
        { new: true }
      );
      const access_token = generateToken(userData._id, res);
      return new Response(
        res, true, 200, "Password reset successful", { access_token: access_token }
      ).successs();
    } else {
      return new Response(
        res,
        false,
        400,
        "Failed to reset password",
        // error
      ).errorFun();
    }
  } catch (error) {
    return new Response(
      res,
      false,
      500,
      "Internal Server Error",
      // error
    ).errorFun();
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const decode = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decode.userID);
    if (user) {
      const { access_token, refresh_token } = generateToken(user._id, res);
      return new Response(
        res, true, 201, "Password reset successful", { access_token: access_token, refresh_token: refresh_token }
      ).successs();

    } else {
      return new Response(
        res,
        false,
        400,
        "RefreshToken Expired",
        // error
      ).errorFun();
    }
  } catch (error) {
    return new Response(
      res,
      false,
      500,
      "Internal Server Error",
      // error
    ).errorFun();
  }
};
