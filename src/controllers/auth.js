import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwtService.js";
import User from "../models/users.js";
import nodemailer from "nodemailer";
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
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
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
    generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
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
      const updatedUserData = await User.findByIdAndUpdate(
        {
          _id: userData._id,
        },
        { $set: { password: hashedPassword, token: "" } },
        { new: true }
      );
      return res.status(200).json({ data: updatedUserData });
    } else {
      return res.status(400).json({ msg: "This link has been expired" });
    }
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};
