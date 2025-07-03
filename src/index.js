import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/projectRoutes.js"
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };
import appMiddleware from "./middlewares/index.js";
import sessionRoutes from"./routes/gameSessionRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

appMiddleware(app);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT;
const DB_URL = "mongodb://localhost:27017/gameplatform" ;

app.use(cors());

app.get('/', (req, res) => {
  return res.status(200).json({
    message: "accounts"
  })
});


app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
  // console.log(`http://localhost:${PORT}`);
});
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", uploadRoutes);
app.use("/api",sessionRoutes);


mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Db connected");

  })
  .catch((error) => console.log(error));
