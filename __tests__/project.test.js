import Project from "../src/models/project";
import { Response as CustomResponse } from "../src/CustomResponse/Response.js";
import { validate as uuidValidate } from "uuid";
import { v7 as uuidv7 } from "uuid";
import { createProject } from "../src/controllers/project.js";

jest.mock("../src/models/project.js");
jest.mock("uuid", () => ({
  v7: jest.fn(),
  validate: jest.fn(),
}));

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

describe("project controller", () => {
    let req;
  beforeEach(() => {
    req = {
      user: { userID: "user123" },
    };
  });

  it("should return 400 if uuid is not valid", async () => {
    const mockUUID = "invalid-uuid";
    uuidv7.mockReturnValue(mockUUID);
    uuidValidate.mockReturnValue(false);
    await createProject(req, mockRes);
    expect(CustomResponse).toHaveBeenCalledWith(
      mockRes,
      false,
      400,
      "UUID is not valid"
    );
    expect(CustomResponse().errorFun).toHaveBeenCalled();
  });
});
