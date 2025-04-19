import swaggerAutogen from "swagger-autogen";
const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:8004/api",
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/authRoutes.js", "./routes/userRoutes.js"];

swaggerAutogen()(outputFile, routes, doc);
