import { register } from "../src/controllers/auth";
import User from "../src/models/users";
import bcrypt from "bcryptjs";
import { generateToken } from "../src/lib/jwtService";

jest.mock("../src/models/users.js");
jest.mock("bcryptjs", () => ({
  AES: {
    encrypt: jest.fn().mockReturnValue("encrypted_password"),
  },
}));
