import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };
import cors from "cors";
import User from "./models/users.js";
import uploadRoutes from "./routes/projectRoutes.js"
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };

dotenv.config();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

app.use(cors());
app.use(express.json());
app.use(cookieParser());



app.get('/',(req,res)=>{
  return res.status(200).json({
    message:"accounts"
  })
});


app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api",uploadRoutes)

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Db connected");
   
  })
  .catch((error) => console.log(error));
