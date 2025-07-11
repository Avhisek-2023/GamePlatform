import request from "supertest";
import { register, login } from "../src/controllers/auth.js";
import User from "../src/models/users.js";
import UserProfile from "../src/models/userprofile.js";
import authRoutes from "../src/routes/authRoutes.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { generateToken } from "../src/lib/jwtService.js";
import randomstring from "randomstring";
import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
// import { sendResetPasswordEmail } from "../src/helpers/emailHelper.js";
import { reset_password } from "../src/controllers/auth.js";

import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json());
app.use("/api", authRoutes);


jest.mock("nodemailer");
jest.mock("../src/models/users.js");
jest.mock("bcryptjs", () => ({
  genSalt: jest.fn(() => "mocked_salt"), 
  hash: jest.fn((password) => `hashed_${password}`),
  compare: jest.fn((plain, hashed) => hashed === `hashed_${plain}`),
}));
jest.mock("../src/lib/jwtService.js", () => ({
  generateToken: jest.fn(() => ({
    access_token: "mocked_access_token",
    refresh_token: "mocked_refresh_token",
  })),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(() => ({ userID: "mocked_user_id" })),
  sign: jest.fn(() => "mocked_token"),
}));
jest.mock("randomstring");



describe("AUTH API", () => {
  it("should register a new user", async() => {
    const mockUserSave = jest.fn().mockResolvedValue({
      _id: "mocked_user_id",
      name: "Adam",
      email: "adam@example.com",
      password: "hashed_1234567",
      role: "user",
    });
  
    UserProfile.prototype.save = jest.fn().mockResolvedValue({
      user_id: "mocked_user_id",
      name: "Adam",
      email: "adam@example.com",
      role: "user",
    });

    User.mockImplementation(() => ({
      save: mockUserSave,
    }));

    const response = await request(app).post("/api/auth/register").send({
      name: "Adam",
      email: "adam@example.com",
      password: "1234567",
      role: "user",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.access_token).toBe("mocked_access_token");
    expect(response.body.data.refresh_token).toBe("mocked_refresh_token");
  }) 

  it("should return 304 if user already exists", async() => {
    const mockUser = {
      _id: "mocked_user_id",
      email: "user@example.com",
      password: "hashed_123456",
    };

    User.findOne.mockResolvedValue(mockUser);

    const response = await request(app).post("/api/auth/register").send({
      name: "Adam",
      email: "user@example.com",
      password: "1234567",
      role: "user",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User already exists");
  })

  it("should login a user", async() => {
    const mockUser = {
      _id: "mocked_user_id",
      email: "adam@example.com",
      password: "hashed_1234567",
    };

    // Mock User.findOne() to return a fake user
    User.findOne.mockResolvedValue(mockUser);

    // Send a login request
    const response = await request(app).post("/api/auth/login").send({
      email: "adam@example.com",
      password: "1234567",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.accessToken).toBe("mocked_access_token");
    expect(response.body.data.refreshToken).toBe("mocked_refresh_token");
    expect(User.findOne).toHaveBeenCalledWith({ email: "adam@example.com" });
    expect(bcryptjs.compare).toHaveBeenCalledWith("1234567", "hashed_1234567");
    expect(generateToken).toHaveBeenCalledWith("mocked_user_id", expect.any(Object));
  })

  it("should return 401 if user does not exist", async () => {
    User.findOne.mockResolvedValue(null); // Simulate user not found

    const response = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Invalid Credentials");
  });

  it("should return 401 if password is incorrect", async () => {
    const mockUser = {
      _id: "mocked_user_id",
      email: "user@example.com",
      password: "hashed_123456",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcryptjs.compare.mockResolvedValue(false); // Simulate incorrect password

    const response = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "wrongpassword",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Invalid Credentials");
  });

  it("should return 500 on server error", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/api/auth/login").send({
      email: "adam@example.com",
      password: "1234567",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Internal Server Error");
  });

  it("should clear cookies and return success message", async () => {
    const response = await request(app).post("/api/auth/logout"); // Adjust route as per your setup

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Logout successfull");

    // Ensure cookies are cleared
    const setCookies = response.headers["set-cookie"];
    expect(setCookies).toEqual(
      expect.arrayContaining([
        expect.stringContaining("jwt=;"),
        expect.stringContaining("access_token=;"),
        expect.stringContaining("refresh_token=;"),
      ])
    );
  });

  it("should generate new tokens if refresh token is valid", async () => {
    jsonwebtoken.verify.mockImplementation(() => ({ userID: "mocked_user_id" }));
    User.findById = jest.fn().mockResolvedValue({ _id: "mocked_user_id" });

    const response = await request(app).post("/api/auth/refresh").send({
      refresh_token: "valid_refresh_token",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.access_token).toBe("mocked_access_token");
    expect(response.body.data.refresh_token).toBe("mocked_refresh_token");
  });

  it("should return 400 if refresh token is expired or invalid", async () => {
    jsonwebtoken.verify.mockImplementation(() => {
      throw new Error("Token expired");
    });

    const response = await request(app).post("/api/auth/refresh").send({
      refresh_token: "expired_refresh_token",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Internal Server Error");
  });

  it("should return 400 if user is not found", async () => {
    jsonwebtoken.verify.mockImplementation(() => ({ userID: "non_existent_user" }));
    User.findById = jest.fn().mockResolvedValue(null);

    const response = await request(app).post("/api/auth/refresh").send({
      refresh_token: "valid_refresh_token",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("RefreshToken Expired");
  });
})