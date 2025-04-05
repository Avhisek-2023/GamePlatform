import { Response } from "../CustomResponse/Response.js";
import UserProfile from "../models/userprofile.js";
import User from "../models/users.js";
import bcrypt from "bcryptjs";
export const getAllUsers = async (req, res) => {
  try {
    const allUser = await User.find();
    console.log(allUser);
    return new Response(
      res,
      true,
      200,
      "User fetched successfully",
      allUser
    ).successs();

  } catch (error) {
    console.log(error);
    return new Response(
      res,
      false,
      400,
      error.message,
      // error
    ).errorFun();
  }
};

export const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    return new Response(
      res,
      true,
      200,
      "User fetched successfully",
      user
    ).successs();
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

export const create = async (req, res) => {
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
    if (user) return new Response(
      res,
      false,
      400,
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
      await newUser.save();
      return new Response(
        res,
        true,
        201,
        "User created successfully",
        {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }
      ).successs();

    } else {
      return new Response(
        res,
        false,
        400,
        "Invalid User data",
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

export const getDetails = async (req, res) => {
  try {
    const user_id = req.user.userID;
    const userDetails = await UserProfile.findOne({ user_id });
    if (userDetails) {
      return new Response(
        res,
        true,
        200,
        "User details fetched successfully",
        userDetails
      ).successs();
    } else {
      return new Response(
        res,
        false,
        400,
        "No Details Found",
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

export const updateProfile = async (req, res) => {
  const user_id = req.params.id;
};
