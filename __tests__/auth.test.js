import { register } from "../src/controllers/auth.js";
import User from "../src/models/users.js";
import UserProfile from "../src/models/userprofile.js";
import { generateToken } from "../src/lib/jwtService.js";
import { Response as CustomResponse } from "../src/CustomResponse/Response.js";
import bcrypt from "bcryptjs";

// Mocks
jest.mock("../src/models/users.js");
jest.mock("../src/models/userprofile.js");
jest.mock("../src/lib/jwtService.js");
jest.mock("bcryptjs");

// Mock CustomResponse
const mockStatus = jest.fn().mockReturnThis();
const mockJson = jest.fn();
const mockRes = { status: mockStatus, json: mockJson };

let mockResponseInstance;

jest.mock("../src/CustomResponse/Response.js", () => {
  const errorFun = jest.fn();
  const successs = jest.fn();
  const Response = jest.fn().mockImplementation(() => {
    mockResponseInstance = { errorFun, successs };
    return mockResponseInstance;
  });
  return { Response };
});

describe("register controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if password is less than 6 chars", async () => {
    const req = {
      body: {
        name: "Adam",
        email: "adam@example.com",
        password: "123",
        role: "user",
      },
    };

    await register(req, mockRes);
    expect(CustomResponse).toHaveBeenCalledWith(mockRes, false, 400, "Password must be atleast 6 chatracters");
    expect(CustomResponse().errorFun).toHaveBeenCalled();
  });

  it("should return 304 if user already exists", async () => {
    const req = {
      body: {
        name: "Adam",
        email: "adam@example.com",
        password: "1234567",
        role: "user",
      },
    };

    User.findOne.mockResolvedValue({ _id: "mocked_user_id" });

    await register(req, mockRes);
    expect(User.findOne).toHaveBeenCalledWith({ email: "adam@example.com" });
    expect(CustomResponse).toHaveBeenCalledWith(mockRes, true, 304, "User already exists");
    expect(CustomResponse().errorFun).toHaveBeenCalled();
  });

  it("should return 201 on successful registration", async () => {
    const req = {
      body: {
        name: "Adam",
        email: "adam@example.com",
        password: "1234567",
        role: "user",
      },
    };

    User.findOne.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hashed_password");

    const savedUser = {
  _id: "mocked_user_id",
  email: "adam@example.com",
};

    const saveMock = jest.fn().mockResolvedValue(savedUser);

    User.mockImplementation(() => ({  _id: "mocked_user_id", save: saveMock }));

      generateToken.mockReturnValue({
      access_token: "mocked_access_token",
      refresh_token: "mocked_refresh_token",
    });

    UserProfile.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    }));

  

    await register(req, mockRes);

    expect(generateToken).toHaveBeenCalledWith("mocked_user_id", mockRes);
    expect(CustomResponse).toHaveBeenCalledWith(
      mockRes,
      true,
      201,
      "Registration successfull",
      { access_token: "mocked_access_token", refresh_token: "mocked_refresh_token" }
    );
    expect(CustomResponse().successs).toHaveBeenCalled();
  });

  it("should return 500 on unexpected error", async () => {
    const req = {
      body: {
        name: "Adam",
        email: "adam@example.com",
        password: "1234567",
        role: "user",
      },
    };

    User.findOne.mockRejectedValue(new Error("DB failure"));

    await register(req, mockRes);
    expect(CustomResponse).toHaveBeenCalledWith(mockRes, false, 500, "Internal Server Error");
    expect(CustomResponse().errorFun).toHaveBeenCalled();
  });
});

