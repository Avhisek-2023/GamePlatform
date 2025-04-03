import UserProfile from "../models/userprofile.js";
import User from "../models/users.js";
import bcrypt from "bcryptjs";
export const getAllUsers = async (req, res) => {
  try {
    const allUser = await User.find();
    res.status(200).json(allUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const create = async (req, res) => {
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

    console.log(`request ${req.body}`);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log(newUser,'new user');

    if (newUser) {
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    } else {
      return  res.status(400).json({ message: "Invalid User data" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDetails = async (req, res) => {
  try {
    const user_id = req.user.userID;
    const userDetails = await UserProfile.findOne({ user_id });
    if (userDetails) {
      return res.status(200).json({ data: userDetails });
    } else {
      return res.status(400).json({ message: "No Details Found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const updateProfile = async (req, res) => {
  const user_id = req.params.id;
  console.log(user_id);
};
