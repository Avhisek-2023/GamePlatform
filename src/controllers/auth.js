import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwtService.js";
import User from "../models/users.js";
import UserProfile from "../models/userprofile.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
// import { sendResetPasswordEmail } from "../lib/emailService.js";
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 chatracters" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

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
      // console.log(user);
      const newProfile = new UserProfile({
        user_id: user._id,
        name: name,
        email: email,
        role: role,
      });
      await newProfile.save();
      res.status(201).json({
        data: {
          access_token: access_token,
          refresh_token: refresh_token,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid User data" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) res.status(400).json({ message: "Invalid Credentials" });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      res.status(400).json({ message: "Invalid Credentials" });
    const { access_token, refresh_token } = generateToken(user._id, res);
    res.status(201).json({
      data: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.cookie("access_token", "", { maxAge: 0 });
    res.cookie("refresh_token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
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
    console.log(transporter);

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
    return res.status(400).json({ message: error });
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
      return res
        .status(200)
        .json({ message: "Please check your mail and reset password" });
    } else {
      return res.status(200).json({ message: "Email Already Exists" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
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
      return res.status(200).json({ access_token: access_token });
    } else {
      return res.status(400).json({ msg: "This link has been expired" });
    }
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const decode = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decode.userID);
    if (user) {
      const { access_token, refresh_token } = generateToken(user._id, res);
      res.status(201).json({
        data: {
          access_token: access_token,
          refresh_token: refresh_token,
        },
      });
    } else {
      return res.status(400).json({ message: "RefreshToken Expired" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
